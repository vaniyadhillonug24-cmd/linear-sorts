import "./App.css";
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

function App() {
  const [algorithm, setAlgorithm] = useState("");
  const [input, setInput] = useState("");
  const [sorted, setSorted] = useState([]);
  const [buckets, setBuckets] = useState([]);
  const [radixSteps, setRadixSteps] = useState([]);
  const [showRangeInput, setShowRangeInput] = useState(false);
  const [countTable, setCountTable] = useState([]);
  const resultRef = useRef(null);

  const isInitialView =
    !algorithm &&
    sorted.length === 0 &&
    buckets.length === 0 &&
    radixSteps.length === 0;

  const algorithmInfo = {
    counting: {
      title: "Counting Sort Algorithm",
      steps: [
        "Initialize a count array C[0..k] with all zeros and an output array B[1..n].",
        "Count the occurrence of each element in the input array A[1..n] by incrementing C[A[i]] for each element.",
        "Modify the count array so that each C[i] contains the cumulative count of elements less than or equal to i.",
        "Build the output array by traversing A from right to left, placing each element A[i] at position C[A[i]] in B, and then decrementing C[A[i]].",
        "Copy all elements from B back into A so that A now contains the sorted elements in ascending order.",
      ],
      complexity: "Time Complexity: O(n + k)",
    },
    radix: {
      title: "Radix Sort Algorithm",
      steps: [
        "Find the maximum element in the array to determine the number of digits in the largest number.",
        "Set the digit position exp to 1 (representing the least significant digit).",
        "While the maximum element divided by exp is greater than 0, perform a Counting Sort on the array based on the current digit (using (A[i] / exp) % 10 to get the digit value).",
        "In the counting process, count the occurrences of each digit (0–9), compute cumulative counts, place elements in the output array according to their current digit, and then copy them back to the original array.",
        "Multiply exp by 10 to move to the next more significant digit and repeat the process until all digits have been sorted.",
      ],
      complexity: "Time Complexity: O(d * (n + k))",
    },
    bucket: {
      title: "Bucket Sort Algorithm",
      steps: [
        "Determine the number of buckets to be used and create an empty list (or array) of buckets.",
        "Distribute all elements from the input array into their respective buckets based on a suitable mapping function (for example, using the value range or value × number of buckets).",
        "Sort each individual bucket using an appropriate sorting algorithm such as insertion sort.",
        "Concatenate all sorted buckets in order to form the final sorted array.",
        "Copy the combined sorted elements back into the original array to get the final sorted result in ascending order.",
      ],
      complexity: "Time Complexity: O(n + k)",
    },
  };

  const countingSort = (arr) => {
    if (!arr.length) return [];

    let max = Math.max(...arr);
    let min = Math.min(...arr);
    let range = max - min + 1;
    let count = new Array(range).fill(0);
    let output = new Array(arr.length);

    for (let i = 0; i < arr.length; i++) count[arr[i] - min]++;

    const tableData = [];
    for (let i = min; i <= max; i++) {
      tableData.push({ number: i, count: count[i - min] });
    }
    setCountTable(tableData);

    for (let i = 1; i < count.length; i++) count[i] += count[i - 1];
    for (let i = arr.length - 1; i >= 0; i--) {
      output[count[arr[i] - min] - 1] = arr[i];
      count[arr[i] - min]--;
    }

    return output;
  };

  const countingSortForRadix = (arr, exp) => {
    let output = new Array(arr.length).fill(0);
    let count = new Array(10).fill(0);

    for (let i = 0; i < arr.length; i++) {
      count[Math.floor(arr[i] / exp) % 10]++;
    }

    for (let i = 1; i < 10; i++) count[i] += count[i - 1];

    for (let i = arr.length - 1; i >= 0; i--) {
      let index = Math.floor(arr[i] / exp) % 10;
      output[count[index] - 1] = arr[i];
      count[index]--;
    }

    for (let i = 0; i < arr.length; i++) arr[i] = output[i];
  };

  const radixSort = async (arr) => {
    setRadixSteps([]);
    const steps = [];
    if (!arr.length) return arr;
    const max = Math.max(...arr);

    for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
      countingSortForRadix(arr, exp);
      steps.push({
        exp,
        result: [...arr],
      });
      setRadixSteps([...steps]);
      await new Promise((resolve) => setTimeout(resolve, 600));
    }

    return arr;
  };

  const bucketSort = async (arr) => {
    let n = arr.length;
    let newBuckets = Array.from({ length: 10 }, () => []);
    setBuckets([...newBuckets]);

    for (let i = 0; i < n; i++) {
      let index = Math.floor(arr[i] * 10);
      newBuckets[index].push(arr[i]);
      setBuckets([...newBuckets]);
      await new Promise((resolve) => setTimeout(resolve, 350));
    }

    for (let i = 0; i < 10; i++) newBuckets[i].sort((a, b) => a - b);
    return newBuckets.flat();
  };

  const handleSort = async () => {
    if (!input.trim()) {
      alert("Please enter numbers first!");
      return;
    }

    let arr = input
      .split(",")
      .map((n) => parseFloat(n.trim()))
      .filter((n) => !Number.isNaN(n));
    if (!arr.length) {
      alert("Please enter valid numbers separated by commas.");
      return;
    }

    let result = [];
    setCountTable([]);

    if (algorithm === "counting") {
      result = countingSort(arr);
    } else if (algorithm === "radix") {
      setRadixSteps([]);
      result = await radixSort(arr);
    } else if (algorithm === "bucket") {
      if (arr.some((n) => n < 0 || n > 1)) {
        alert("All numbers must be between 0 and 1 for Bucket Sort");
        return;
      }
      result = await bucketSort(arr);
    }

    setSorted(result);
    setInput("");

    setTimeout(() => {
      if (resultRef.current)
        resultRef.current.scrollIntoView({ behavior: "smooth" });
    }, 250);
  };

  useEffect(() => {
    if ((buckets.length > 0 || radixSteps.length > 0) && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [buckets, radixSteps]);

  return (
    <div className="app-root min-h-screen w-full bg-gradient-to-br from-purple-600 via-pink-500 to-yellow-400 text-white">
      <div
        className={`layout-wrapper w-full ${
          isInitialView ? "min-h-screen flex items-center" : "pt-6 pb-12"
        }`}
      >
        <div className="container mx-auto px-6">
          <div className={`flex flex-col md:flex-row items-start justify-center gap-6`}>
            <div
              className={`flex-1 flex flex-col items-center ${
                isInitialView ? "justify-center" : "justify-start"
              }`}
            >
              <motion.h1
                className="text-5xl font-extrabold mb-6 text-center drop-shadow-lg"
                initial={{ y: -30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
              >
                Linear Time Sorting
              </motion.h1>

              <motion.h2
                className="text-2xl font-semibold mb-6 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                Choose a Sorting Algorithm
              </motion.h2>

              <div className="flex gap-4 mb-6 flex-wrap justify-center">
                {["counting", "radix", "bucket"].map((algo) => (
                  <button
                    key={algo}
                    onClick={() => {
                      setAlgorithm(algo);
                      setSorted([]);
                      setBuckets([]);
                      setRadixSteps([]);
                      setCountTable([]);
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
                  <label className="mr-4 text-lg font-medium">Range: 0 to 1</label>
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

              {/* Counting Sort Table */}
              {algorithm === "counting" && countTable.length > 0 && (
                <motion.div
                  className="mt-10 bg-white bg-opacity-20 p-6 rounded-2xl shadow-lg w-full max-w-3xl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <h3 className="text-2xl font-semibold mb-4 text-center text-yellow-300">
                    Counting Table
                  </h3>
                  <table className="border-collapse border border-white text-center mx-auto mb-6">
                    <thead>
                      <tr>
                        <th className="border border-white px-4 py-2">Number</th>
                        <th className="border border-white px-4 py-2">Count</th>
                      </tr>
                    </thead>
                    <tbody>
                      {countTable.map((row, i) => (
                        <tr key={i}>
                          <td className="border border-white px-4 py-1">{row.number}</td>
                          <td className="border border-white px-4 py-1">{row.count}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {sorted.length > 0 && (
                    <>
                      <h3 className="text-xl font-semibold mb-2 text-center">
                        Final Sorted Output:
                      </h3>
                      <p className="text-lg font-medium text-yellow-200 text-center">
                        {sorted.join(", ")}
                      </p>
                    </>
                  )}
                </motion.div>
              )}

              {/* Radix Sort */}
              {algorithm === "radix" && radixSteps.length > 0 && (
                <motion.div
                  className="mt-10 bg-white bg-opacity-20 p-6 rounded-2xl shadow-lg w-full max-w-3xl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <h3 className="text-2xl font-semibold mb-4 text-center text-yellow-300">
                    Step-by-Step Radix Sort Progress
                  </h3>
                  <div className="flex flex-col gap-4 mb-6">
                    {radixSteps.map((step, i) => (
                      <motion.div
                        key={i}
                        className="bg-yellow-300/20 rounded-xl p-4 text-center"
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        <p className="font-semibold mb-2">Digit Place: {step.exp}</p>
                        <p className="text-lg font-medium">{step.result.join(", ")}</p>
                      </motion.div>
                    ))}
                  </div>

                  {/* 🟢 Final Sorted Output for Radix Sort */}
                  {sorted.length > 0 && (
                    <>
                      <h3 className="text-xl font-semibold mb-2 text-center">
                        Final Sorted Output:
                      </h3>
                      <p className="text-lg font-medium text-yellow-200 text-center">
                        {sorted.join(", ")}
                      </p>
                    </>
                  )}
                </motion.div>
              )}

              {/* Bucket Sort */}
              {algorithm === "bucket" && buckets.length > 0 && (
                <motion.div
                  className="mt-10 bg-white bg-opacity-20 p-6 rounded-2xl shadow-lg w-full max-w-3xl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <h3 className="text-2xl font-semibold mb-4 text-center">
                    Bucket Distribution
                  </h3>
                  <table className="border-collapse border border-white text-center mx-auto mb-6">
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
                                initial={{ opacity: 0, y: -6 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4 }}
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

                  {/* 🟢 Final Sorted Output for Bucket Sort */}
                  {sorted.length > 0 && (
                    <>
                      <h3 className="text-xl font-semibold mb-2 text-center">
                        Final Sorted Output:
                      </h3>
                      <p className="text-lg font-medium text-yellow-200 text-center">
                        {sorted.join(", ")}
                      </p>
                    </>
                  )}
                </motion.div>
              )}
            </div>

            {/* Algorithm Info Box (unchanged) */}
            <motion.div
              className="md:w-1/3 w-full bg-white bg-opacity-20 p-6 rounded-2xl shadow-lg backdrop-blur-md self-stretch"
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
                  Select an algorithm to view its steps here!
                </p>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
