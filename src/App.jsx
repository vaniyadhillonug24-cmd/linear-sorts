import "./App.css";
import React, { useState } from "react";
import { motion } from "framer-motion";

function App() {
  const [algorithm, setAlgorithm] = useState("");
  const [input, setInput] = useState("");
  const [sorted, setSorted] = useState([]);
  const [buckets, setBuckets] = useState([]);
  const [showRangeInput, setShowRangeInput] = useState(false);

  // Algorithm Descriptions
  const algorithmInfo = {
    counting: {
      title: "Counting Sort Algorithm",
      steps: [
        "1. Find the maximum and minimum value in the array.",
        "2. Create a count array to store frequency of each element.",
        "3. Modify count array by adding previous counts (prefix sum).",
        "4. Place elements into output array in sorted order using count array.",
        "5. Copy the output back to original array."
      ],
      complexity: "Time Complexity: O(n + k)"
    },
    radix: {
      title: "Radix Sort Algorithm",
      steps: [
        "1. Find the maximum number to know number of digits.",
        "2. Perform Counting Sort for every digit (from LSD to MSD).",
        "3. For each pass, group elements by current digit (0–9).",
        "4. Merge all buckets and move to next digit place."
      ],
      complexity: "Time Complexity: O(d * (n + k))"
    },
    bucket: {
      title: "Bucket Sort Algorithm",
      steps: [
        "1. Create empty buckets (usually 10).",
        "2. Distribute elements into buckets based on value range.",
        "3. Sort each bucket individually (using insertion sort or built-in).",
        "4. Concatenate all buckets to get the sorted array."
      ],
      complexity: "Time Complexity: O(n + k)"
    },
  };

  // Counting Sort
  const countingSort = (arr) => {
    let max = Math.max(...arr);
    let min = Math.min(...arr);
    let range = max - min + 1;
    let count = new Array(range).fill(0);
    let output = new Array(arr.length);

    for (let i = 0; i < arr.length; i++) count[arr[i] - min]++;
    for (let i = 1; i < count.length; i++) count[i] += count[i - 1];
    for (let i = arr.length - 1; i >= 0; i--) {
      output[count[arr[i] - min] - 1] = arr[i];
      count[arr[i] - min]--;
    }
    return output;
  };

  // Radix Sort
  const countingSortForRadix = (arr, exp) => {
    let output = new Array(arr.length).fill(0);
    let count = new Array(10).fill(0);

    for (let i = 0; i < arr.length; i++)
      count[Math.floor(arr[i] / exp) % 10]++;

    for (let i = 1; i < 10; i++) count[i] += count[i - 1];

    for (let i = arr.length - 1; i >= 0; i--) {
      let index = Math.floor(arr[i] / exp) % 10;
      output[count[index] - 1] = arr[i];
      count[index]--;
    }

    for (let i = 0; i < arr.length; i++) arr[i] = output[i];
  };

  const radixSort = (arr) => {
    const max = Math.max(...arr);
    for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10)
      countingSortForRadix(arr, exp);
    return arr;
  };

  // Bucket Sort
  const bucketSort = async (arr) => {
    let n = arr.length;
    let newBuckets = Array.from({ length: 10 }, () => []);
    setBuckets([...newBuckets]);

    for (let i = 0; i < n; i++) {
      let index = Math.floor(arr[i] * 10);
      newBuckets[index].push(arr[i]);
      setBuckets([...newBuckets]);
      await new Promise((resolve) => setTimeout(resolve, 400));
    }

    for (let i = 0; i < 10; i++) newBuckets[i].sort((a, b) => a - b);

    return newBuckets.flat();
  };

  const handleSort = async () => {
    if (!input.trim()) {
      alert("Please enter numbers first!");
      return;
    }

    let arr = input.split(",").map((n) => parseFloat(n.trim()));
    let result = [];

    if (algorithm === "counting") result = countingSort(arr);
    else if (algorithm === "radix") result = radixSort(arr);
    else if (algorithm === "bucket") {
      if (arr.some((n) => n < 0 || n > 1)) {
        alert("All numbers must be between 0 and 1 for Bucket Sort");
        return;
      }
      result = await bucketSort(arr);
    }

    setSorted(result);
    setInput("");
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-start justify-center bg-gradient-to-br from-purple-600 via-pink-500 to-yellow-400 text-white p-6 gap-6">

      {/* Left Section - Main Sorting UI */}
      <div className="flex-1 flex flex-col items-center">
        <motion.h1
          className="text-5xl font-extrabold mb-6 text-center drop-shadow-lg"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          Linear Time Sorting
        </motion.h1>

        <motion.h2
          className="text-2xl font-semibold mb-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Choose a Sorting Algorithm
        </motion.h2>

        <div className="flex gap-4 mb-8 flex-wrap justify-center">
          {["counting", "radix", "bucket"].map((algo) => (
            <button
              key={algo}
              onClick={() => {
                setAlgorithm(algo);
                setSorted([]);
                setBuckets([]);
                setInput("");
                setShowRangeInput(algo === "bucket");
              }}
              className={`px-6 py-2 rounded-2xl text-lg font-bold transition-all duration-300 ${
                algorithm === algo
                  ? "bg-green-400 text-black"
                  : "bg-white text-purple-700 hover:bg-green-300"
              }`}
            >
              {algo.charAt(0).toUpperCase() + algo.slice(1)} Sort
            </button>
          ))}
        </div>

        {showRangeInput && (
          <div className="mb-6 text-center">
            <label className="mr-4 text-lg font-medium">
              Range: 0 to 1
            </label>
          </div>
        )}

        {algorithm && (
          <div className="text-center">
            <input
              type="text"
              placeholder={
                algorithm === "bucket"
                  ? "Enter numbers between 0 and 1, separated by commas"
                  : "Enter integers separated by commas"
              }
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="px-4 py-2 rounded-xl text-black w-80 text-center mb-4 focus:ring-2 focus:ring-yellow-400"
            />
            <br />
            <button
              onClick={handleSort}
              className="bg-yellow-400 text-black px-6 py-2 rounded-xl font-bold hover:bg-yellow-300 transition-all"
            >
              Sort Now
            </button>
          </div>
        )}

        {algorithm === "bucket" && buckets.length > 0 && (
          <motion.div
            className="mt-10 bg-white bg-opacity-20 p-6 rounded-2xl shadow-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h3 className="text-2xl font-semibold mb-4 text-center">
              Bucket Distribution
            </h3>
            <table className="border-collapse border border-white text-center mx-auto">
              <thead>
                <tr>
                  <th className="border border-white px-4 py-2">Bucket</th>
                  <th className="border border-white px-4 py-2">Values</th>
                </tr>
              </thead>
              <tbody>
                {buckets.map((b, i) => (
                  <tr key={i}>
                    <td className="border border-white px-4 py-1">{i}</td>
                    <td className="border border-white px-4 py-1">
                      {b.map((num, j) => (
                        <motion.span
                          key={j}
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5 }}
                          className="inline-block mx-1 bg-yellow-300 text-black rounded px-2 py-1"
                        >
                          {num.toFixed(2)}
                        </motion.span>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}

        {sorted.length > 0 && (
          <motion.div
            className="mt-10 bg-white bg-opacity-20 p-6 rounded-2xl shadow-lg text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h3 className="text-2xl font-semibold mb-4 text-center">
              Final Sorted Output :
            </h3>
            <div className="flex flex-wrap justify-center gap-3 text-lg">
              {sorted.map((num, i) => (
                <motion.span
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.2 }}
                  className="bg-green-300 text-black rounded px-2 py-1 inline-block"
                >
                  {num.toFixed(2)}
                </motion.span>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Right Section - Algorithm Info Box */}
      <motion.div
        className="md:w-1/3 w-full bg-white bg-opacity-20 p-6 rounded-2xl shadow-lg backdrop-blur-md"
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
      >
        {algorithm ? (
          <>
            <h2 className="text-3xl font-bold mb-4 text-yellow-300">
              {algorithmInfo[algorithm].title}
            </h2>
            <ul className="list-disc list-inside text-lg mb-4 space-y-2">
              {algorithmInfo[algorithm].steps.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ul>
            <p className="font-semibold text-xl text-green-200">
              {algorithmInfo[algorithm].complexity}
            </p>
          </>
        ) : (
          <p className="text-lg text-center text-white/80">
            Select an algorithm to view its steps here ! 
          </p>
        )}
      </motion.div>
    </div>
  );
}
export default App;
