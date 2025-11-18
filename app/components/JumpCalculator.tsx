"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { formatNumber } from "@/lib/formatNumber";

interface Measurement {
  id: number;
  name: string;
  leg_length: string;
  height_90_degree: string;
  weight_kg: string | null;
}

export default function JumpCalculator() {
  const { data: session } = useSession();
  const [framesPerSecond, setFramesPerSecond] = useState<string>("");
  const [amountOfFrames, setAmountOfFrames] = useState<string>("");
  const [startFrame, setStartFrame] = useState<string>("");
  const [endFrame, setEndFrame] = useState<string>("");
  const [bodyWeight, setBodyWeight] = useState<string>("");
  const [legLength, setLegLength] = useState<string>("");
  const [height90Degree, setHeight90Degree] = useState<string>("");
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [selectedMeasurementId, setSelectedMeasurementId] =
    useState<string>("");
  const [useFrameRange, setUseFrameRange] = useState<boolean>(false);

  useEffect(() => {
    if (session?.user?.email) {
      fetchMeasurements();
      fetchSettings();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user?.email]);

  const fetchMeasurements = async () => {
    try {
      const response = await fetch("/api/measurements");
      const data = await response.json();
      if (response.ok && data.measurements) {
        setMeasurements(data.measurements);
      }
    } catch (error) {
      console.error("Failed to fetch measurements:", error);
    }
  };

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/settings");
      const data = await response.json();
      if (
        response.ok &&
        data.settings?.framesPerSecond !== null &&
        data.settings?.framesPerSecond !== undefined
      ) {
        setFramesPerSecond(data.settings.framesPerSecond.toString());
      }
    } catch (error) {
      console.error("Failed to fetch settings:", error);
    }
  };

  const handleMeasurementSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    setSelectedMeasurementId(selectedId);

    if (selectedId) {
      const measurement = measurements.find(
        (m) => m.id === parseInt(selectedId)
      );
      if (measurement) {
        setLegLength(measurement.leg_length);
        setHeight90Degree(measurement.height_90_degree);
        if (measurement.weight_kg) {
          setBodyWeight(measurement.weight_kg);
        } else {
          setBodyWeight("");
        }
      }
    } else {
      setLegLength("");
      setHeight90Degree("");
      setBodyWeight("");
    }
  };

  const calculate = () => {
    const fps = parseFloat(framesPerSecond);
    const start = parseFloat(startFrame);
    const end = parseFloat(endFrame);
    const weight = parseFloat(bodyWeight);
    const legLen = parseFloat(legLength);
    const height90 = parseFloat(height90Degree);

    // Calculate frames based on input mode
    let calculatedFrames: number;
    const isValidStartFrame = !isNaN(start) && startFrame.trim() !== "";
    const isValidEndFrame = !isNaN(end) && endFrame.trim() !== "";

    if (useFrameRange && isValidStartFrame && isValidEndFrame && end >= start) {
      calculatedFrames = end - start;
    } else if (!useFrameRange) {
      calculatedFrames = parseFloat(amountOfFrames);
    } else {
      return null; // Invalid input in frame range mode
    }

    // Check if fps and frames are valid numbers
    const isValidFps = !isNaN(fps) && framesPerSecond.trim() !== "" && fps > 0;
    const isValidFrames =
      !isNaN(calculatedFrames) &&
      ((!useFrameRange && amountOfFrames.trim() !== "") ||
        (useFrameRange && isValidStartFrame && isValidEndFrame)) &&
      calculatedFrames > 0;

    // Time in flight calculation: amount of frames / frames per second = time in seconds
    if (!isValidFps || !isValidFrames) {
      return null;
    }

    const timeInFlight = calculatedFrames / fps; // in seconds
    const timeInFlightMs = timeInFlight * 1000; // convert to milliseconds

    // Calculate jump height based on time in flight
    // Formula: h = (1/8) * g * t²
    // where g = 9.81 m/s² (gravity) and t = time in flight
    // Result in meters, convert to cm by multiplying by 100
    const gravity = 9.81; // m/s²
    const jumpHeightMeters = (1 / 8) * gravity * timeInFlight * timeInFlight;
    const jumpHeightCm = jumpHeightMeters * 100;

    // Calculate takeoff velocity based on time in flight
    // Formula: v0 = g * (t / 2)
    // where g = 9.81 m/s² and t = time in flight
    // The time to reach peak is half the total flight time
    const takeoffVelocity = gravity * (timeInFlight / 2);

    // Calculate average force (Fm) using work-energy principle
    // Formula: F_avg = m * g + (m * v²) / (2 * d)
    // where m = body weight (kg), g = 9.81 m/s², v = takeoff velocity, d = countermovement depth
    // Countermovement depth (d) = leg length (standing) - hip height (at 90 degrees)
    const isValidWeight =
      !isNaN(weight) && bodyWeight.trim() !== "" && weight > 0;
    const isValidLegLength =
      !isNaN(legLen) && legLength.trim() !== "" && legLen > 0;
    const isValidHeight90 =
      !isNaN(height90) && height90Degree.trim() !== "" && height90 > 0;

    let averageForce: number | null = null;
    let relativeForce: number | null = null;
    if (isValidWeight && isValidLegLength && isValidHeight90) {
      // Countermovement depth = leg length (standing) - hip height (at 90 degrees)
      const countermovementDepthCm = legLen - height90;
      if (countermovementDepthCm > 0) {
        const countermovementDepthMeters = countermovementDepthCm / 100; // Convert cm to meters
        const averageForceN =
          weight * gravity +
          (weight * takeoffVelocity * takeoffVelocity) /
            (2 * countermovementDepthMeters);
        averageForce = averageForceN;
        // Relative force = average force / (9.81 * body weight)
        // This gives the force as a multiple of body weight (dimensionless)
        relativeForce = averageForceN / (gravity * weight);
      }
    }

    const results: {
      timeInFlight: number;
      timeInFlightMs: number;
      jumpHeight: number;
      takeoffVelocity: number;
      averageForce: number | null;
      relativeForce: number | null;
    } = {
      timeInFlight,
      timeInFlightMs,
      jumpHeight: jumpHeightCm,
      takeoffVelocity,
      averageForce,
      relativeForce,
    };

    return results;
  };

  const results = calculate();

  return (
    <div className="w-full max-w-4xl mx-auto px-2 md:px-0">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 md:p-6 lg:p-8">
        <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-gray-900 dark:text-white">
          Input Parameters
        </h2>

        {session?.user?.email && measurements.length > 0 && (
          <div className="mb-4 md:mb-6 p-3 md:p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
            <label
              htmlFor="measurementSelect"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Load Saved Measurement
            </label>
            <select
              id="measurementSelect"
              value={selectedMeasurementId}
              onChange={handleMeasurementSelect}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="">-- Select a measurement --</option>
              {measurements.map((measurement) => (
                <option key={measurement.id} value={measurement.id}>
                  {measurement.name} (Leg:{" "}
                  {formatNumber(measurement.leg_length)}cm, Height 90°:{" "}
                  {formatNumber(measurement.height_90_degree)}cm
                  {measurement.weight_kg
                    ? `, Weight: ${formatNumber(measurement.weight_kg)}kg`
                    : ""}
                  )
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Selecting a measurement will fill in Leg Length, Height 90°, and
              Weight (if available)
            </p>
          </div>
        )}

        <div className="mb-4 md:mb-6 p-3 md:p-4 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-md">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3 md:mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Frame Input Mode
              </label>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Choose how to specify the number of frames
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setUseFrameRange(!useFrameRange);
                // Clear the other mode's fields when switching
                if (!useFrameRange) {
                  setAmountOfFrames("");
                } else {
                  setStartFrame("");
                  setEndFrame("");
                }
              }}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                useFrameRange ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-600"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  useFrameRange ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <span
              className={
                useFrameRange
                  ? "font-semibold text-blue-600 dark:text-blue-400"
                  : ""
              }
            >
              {useFrameRange ? "✓ Frame Range" : "Frame Range"}
            </span>
            <span className="mx-2">•</span>
            <span
              className={
                !useFrameRange
                  ? "font-semibold text-blue-600 dark:text-blue-400"
                  : ""
              }
            >
              {!useFrameRange ? "✓ Direct Input" : "Direct Input"}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div>
            <label
              htmlFor="fps"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Frames per Second
            </label>
            <input
              id="fps"
              type="number"
              step="0.01"
              value={framesPerSecond}
              onChange={(e) => setFramesPerSecond(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="e.g., 30, 60, 120"
            />
          </div>

          {!useFrameRange ? (
            <div>
              <label
                htmlFor="frames"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Amount of Frames
              </label>
              <input
                id="frames"
                type="number"
                step="1"
                value={amountOfFrames}
                onChange={(e) => setAmountOfFrames(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="e.g., 15, 30, 60"
              />
            </div>
          ) : (
            <>
              <div>
                <label
                  htmlFor="startFrame"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Start Frame
                </label>
                <input
                  id="startFrame"
                  type="number"
                  step="1"
                  value={startFrame}
                  onChange={(e) => setStartFrame(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="e.g., 10, 20, 30"
                />
              </div>

              <div>
                <label
                  htmlFor="endFrame"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  End Frame
                </label>
                <input
                  id="endFrame"
                  type="number"
                  step="1"
                  value={endFrame}
                  onChange={(e) => setEndFrame(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="e.g., 25, 50, 90"
                />
              </div>
            </>
          )}
        </div>

        {useFrameRange && (
          <div className="mt-2 mb-4">
            {(() => {
              const start = parseFloat(startFrame);
              const end = parseFloat(endFrame);
              const isValidStart = !isNaN(start) && startFrame.trim() !== "";
              const isValidEnd = !isNaN(end) && endFrame.trim() !== "";
              if (isValidStart && isValidEnd) {
                if (end >= start) {
                  const calculated = end - start;
                  return (
                    <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                      Calculated frames: {calculated}
                    </p>
                  );
                } else {
                  return (
                    <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                      End frame must be greater than or equal to start frame
                    </p>
                  );
                }
              }
              return null;
            })()}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-4 md:mt-6">
          <div>
            <label
              htmlFor="weight"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Body Weight (kg)
            </label>
            <input
              id="weight"
              type="number"
              step="0.1"
              value={bodyWeight}
              onChange={(e) => {
                setBodyWeight(e.target.value);
                setSelectedMeasurementId("");
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="e.g., 70, 80, 90"
            />
          </div>

          <div>
            <label
              htmlFor="legLength"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Leg Length (cm)
            </label>
            <input
              id="legLength"
              type="number"
              step="0.1"
              value={legLength}
              onChange={(e) => {
                setLegLength(e.target.value);
                setSelectedMeasurementId("");
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="e.g., 80, 90, 100"
            />
          </div>

          <div className="md:col-span-2">
            <label
              htmlFor="height90"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Height 90° (cm)
            </label>
            <input
              id="height90"
              type="number"
              step="0.1"
              value={height90Degree}
              onChange={(e) => {
                setHeight90Degree(e.target.value);
                setSelectedMeasurementId("");
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="e.g., 150, 180, 200"
            />
          </div>
        </div>

        <div className="mt-4 md:mt-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Time in Flight
            </label>
            <div className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md">
              {results ? (
                <>
                  <p className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white">
                    {formatNumber(results.timeInFlightMs)} ms
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    (frames ÷ fps)
                  </p>
                </>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">
                  Enter Frames per Second and Amount of Frames
                </p>
              )}
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Jump Height
            </label>
            <div className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md">
              {results ? (
                <>
                  <p className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white">
                    {formatNumber(results.jumpHeight)} cm
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    (calculated from time in flight)
                  </p>
                </>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">
                  Enter Frames per Second and Amount of Frames
                </p>
              )}
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Takeoff Velocity
            </label>
            <div className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md">
              {results ? (
                <>
                  <p className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white">
                    {formatNumber(results.takeoffVelocity)} m/s
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    (calculated from time in flight)
                  </p>
                </>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">
                  Enter Frames per Second and Amount of Frames
                </p>
              )}
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Average Force (Fm)
            </label>
            <div className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md">
              {results && results.averageForce !== null ? (
                <>
                  <p className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white">
                    {formatNumber(results.averageForce)} N
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    (calculated from body weight, takeoff velocity, leg length,
                    and hip height at 90 degrees)
                  </p>
                </>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">
                  Enter Body Weight, Leg Length, and Height 90° to calculate
                </p>
              )}
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Relative Force (Frel)
            </label>
            <div className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md">
              {results && results.relativeForce !== null ? (
                <>
                  <p className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white">
                    {formatNumber(results.relativeForce, 3)}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    (average force divided by body weight × 9.81, multiple of
                    body weight)
                  </p>
                </>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">
                  Enter Body Weight, Leg Length, and Height 90° to calculate
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
