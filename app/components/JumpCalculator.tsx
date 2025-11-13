"use client";

import { useState } from "react";

export default function JumpCalculator() {
  const [framesPerSecond, setFramesPerSecond] = useState<string>("");
  const [amountOfFrames, setAmountOfFrames] = useState<string>("");
  const [bodyWeight, setBodyWeight] = useState<string>("");
  const [legLength, setLegLength] = useState<string>("");
  const [height90Degree, setHeight90Degree] = useState<string>("");

  const calculate = () => {
    const fps = parseFloat(framesPerSecond);
    const frames = parseFloat(amountOfFrames);
    const weight = parseFloat(bodyWeight);
    const legLen = parseFloat(legLength);
    const height90 = parseFloat(height90Degree);

    // Check if fps and frames are valid numbers
    const isValidFps = !isNaN(fps) && framesPerSecond.trim() !== "" && fps > 0;
    const isValidFrames = !isNaN(frames) && amountOfFrames.trim() !== "";

    // Time in flight calculation: amount of frames / frames per second = time in seconds
    if (!isValidFps || !isValidFrames) {
      return null;
    }

    const timeInFlight = frames / fps; // in seconds
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
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
          Input Parameters
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              onChange={(e) => setBodyWeight(e.target.value)}
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
              onChange={(e) => setLegLength(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="e.g., 80, 90, 100"
            />
          </div>

          <div className="md:col-span-2">
            <label
              htmlFor="height90"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Height with 90 Degree (cm)
            </label>
            <input
              id="height90"
              type="number"
              step="0.1"
              value={height90Degree}
              onChange={(e) => setHeight90Degree(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="e.g., 150, 180, 200"
            />
          </div>
        </div>

        <div className="mt-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Time in Flight
            </label>
            <div className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md">
              {results ? (
                <>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {results.timeInFlightMs.toFixed(2)} ms
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
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {results.jumpHeight.toFixed(2)} cm
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
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {results.takeoffVelocity.toFixed(2)} m/s
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
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {results.averageForce.toFixed(2)} N
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    (calculated from body weight, takeoff velocity, leg length,
                    and hip height at 90 degrees)
                  </p>
                </>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">
                  Enter Body Weight, Leg Length, and Height with 90 Degree to
                  calculate
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
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {results.relativeForce.toFixed(3)}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    (average force divided by body weight × 9.81, multiple of
                    body weight)
                  </p>
                </>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">
                  Enter Body Weight, Leg Length, and Height with 90 Degree to
                  calculate
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
