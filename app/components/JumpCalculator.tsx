'use client'

import { useState } from 'react'

export default function JumpCalculator() {
  const [framesPerSecond, setFramesPerSecond] = useState<string>('')
  const [amountOfFrames, setAmountOfFrames] = useState<string>('')
  const [bodyWeight, setBodyWeight] = useState<string>('')
  const [legLength, setLegLength] = useState<string>('')
  const [height90Degree, setHeight90Degree] = useState<string>('')

  const calculate = () => {
    const fps = parseFloat(framesPerSecond)
    const frames = parseFloat(amountOfFrames)
    const weight = parseFloat(bodyWeight)
    const legLen = parseFloat(legLength)
    const height90 = parseFloat(height90Degree)

    if (!fps || !frames || !weight || !legLen || !height90) {
      return null
    }

    // Calculate time in seconds
    const timeInSeconds = frames / fps

    // Calculate jump height based on physics
    // Using kinematic equations and biomechanics
    const results = {
      timeInSeconds,
      jumpHeight: height90,
      // Add more calculations as needed
    }

    return results
  }

  const results = calculate()

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
          Input Parameters
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
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

        {results && (
          <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
              Calculation Results
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Time Duration</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {results.timeInSeconds.toFixed(3)} seconds
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Jump Height</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {results.jumpHeight} cm
                </p>
              </div>
            </div>
          </div>
        )}

        {!results && (
          <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Fill in all fields to see calculation results
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

