import React, { useState, useEffect, useCallback, useMemo } from 'react';

// --- CSS STYLES (Combined into the JS file) ---
const styles = {
  // New Color Palette:
  // Primary Teal: #00b8a9
  // Highlight Teal: #71eeb8
  // Light Blue (Control Button): #4da6ff
  // Array Box/Bar BG: #5fa3cf
  
  global: {
    fontFamily: '"Inter", sans-serif',
    backgroundColor: '#f5f5f5', // Light gray background
    minHeight: '100vh',
    padding: '20px',
    color: '#333',
  },
  container: {
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  header: {
    textAlign: 'center',
    marginBottom: '20px',
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#000a09ff', // Light Teal Header Color
  },
  buttonGroup: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    marginBottom: '20px',
  },
  button: {
    padding: '10px 15px',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '500',
    transition: 'background-color 0.15s ease, transform 0.05s ease',
    flexGrow: 1,
    minWidth: '120px',
  },
  algoButtonActive: {
    backgroundColor: '#086e65ff', // Light Teal
    color: 'white',
    boxShadow: '0 2px 4px rgba(0, 184, 169, 0.3)',
  },
  algoButtonInactive: {
    backgroundColor: '#e0e0e0',
    color: '#333',
  },
  controlButton: {
    backgroundColor: '#106dc9ff', // Light Blue
    color: 'white',
  },
  controlButtonDisabled: {
    backgroundColor: '#ccc',
    cursor: 'not-allowed',
  },
  inputControl: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    alignItems: 'center',
    marginBottom: '20px',
    padding: '15px',
    backgroundColor: '#f9f9f9',
    borderRadius: '6px',
  },
  input: {
    padding: '8px 10px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    flexGrow: 1,
    minWidth: '200px',
  },
  stepInfo: {
    padding: '10px 15px',
    backgroundColor: '#eee',
    borderRadius: '6px',
    marginBottom: '20px',
    fontWeight: '600',
    textAlign: 'center',
    fontSize: '1.1rem',
  },
  arrayViz: {
    display: 'flex',
    gap: '4px',
    justifyContent: 'center',
    alignItems: 'flex-end',
    height: '150px',
    marginBottom: '30px',
    borderBottom: '1px solid #ccc',
    paddingBottom: '10px',
    overflowX: 'auto',
  },
  arrayBar: (height, isHighlight) => ({
    width: '30px',
    height: `${height * 3}px`,
    backgroundColor: isHighlight ? '#71eeb8' : '#5fa3cf', // Highlight Teal : Array Box BG
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    fontWeight: 'bold',
    borderRadius: '3px 3px 0 0',
    transition: 'height 0.3s ease, background-color 0.3s ease, transform 0.3s ease',
    marginBottom: '-10px',
    transform: isHighlight ? 'scale(1.05)' : 'scale(1)',
  }),
  arrayBox: (isHighlight) => ({
    width: '40px',
    height: '40px',
    backgroundColor: isHighlight ? '#71eeb8' : '#5fa3cf', // Highlight Teal : Array Box BG
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '4px',
    fontWeight: 'bold',
    transition: 'background-color 0.3s ease, transform 0.3s ease',
    transform: isHighlight ? 'scale(1.05)' : 'scale(1)',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  }),
  pseudocodeSection: {
    backgroundColor: '#2e2e2e', // Dark gray/black for code background
    color: '#e0e0e0',
    padding: '15px',
    borderRadius: '6px',
    lineHeight: '1.6',
    fontSize: '0.9rem',
    whiteSpace: 'pre-wrap',
  },
  codeLine: (isHighlighted) => ({
    padding: '2px 5px',
    borderRadius: '3px',
    backgroundColor: isHighlighted ? '#00b8a9' : 'transparent', // Light Teal Highlight
    color: isHighlighted ? 'white' : '#e0e0e0',
    fontWeight: isHighlighted ? 'bold' : 'normal',
    transition: 'background-color 0.2s ease',
    display: 'block',
  }),
  auxiliaryViz: {
    marginTop: '20px',
    marginBottom: '20px',
    padding: '15px',
    backgroundColor: '#f0f0f0',
    borderRadius: '6px',
  },
  auxiliaryRow: {
    display: 'flex',
    justifyContent: 'center',
    gap: '4px',
    marginBottom: '10px',
    flexWrap: 'wrap',
  },
  auxiliaryCell: (isHighlight) => ({
    width: '40px',
    height: '40px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: isHighlight ? '#71eeb8' : '#ddd', // Highlight Teal : Default Gray
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '0.8rem',
    fontWeight: '500',
    transition: 'background-color 0.3s ease',
  }),
  auxLabel: {
    fontWeight: 'bold',
    fontSize: '0.7rem',
    color: '#555',
    marginTop: '2px',
  }
};
// --- END CSS STYLES ---

// Initial array state (empty as requested)
const INITIAL_ARRAY = [];

// --- PSEUDOCODE DEFINITIONS ---
const PSEUDOCODE = {
  counting: `// Counting Sort (Range K)
1. function CountingSort(arr, n, k):
2.   count = new Array(k + 1).fill(0)
3.   output = new Array(n)
4.
5.   // 1. Count each element's frequency
6.   for x in arr:
7.     count[x] = count[x] + 1
8.
9.   // 2. Calculate cumulative sum
10.  for i from 1 to k:
11.    count[i] = count[i] + count[i-1]
12.
13.  // 3. Place elements into sorted order
14.  for i from n-1 down to 0:
15.    value = arr[i]
16.    position = count[value] - 1
17.    output[position] = value
18.    count[value] = count[value] - 1
19.
20.  // 4. Copy output array back to arr
21.  for i from 0 to n-1:
22.    arr[i] = output[i]
`,
  bucket: `// Bucket Sort (N items, M buckets)
1. function BucketSort(arr, n, m):
2.   buckets = new Array(m)
3.   Initialize all buckets as empty lists
4.   max_val = max(arr)
5.
6.   // 1. Distribute elements into buckets
7.   for x in arr:
8.     bucket_index = floor(x * m / (max_val + 1))
9.     buckets[bucket_index].append(x)
10.
11.  // 2. Sort each bucket
12.  for i from 0 to m-1:
13.    Sort(buckets[i]) // e.g., using Insertion Sort
14.
15.  // 3. Concatenate the sorted buckets
16.  index = 0
17.  for i from 0 to m-1:
18.    for x in buckets[i]:
19.      arr[index] = x
20.      index = index + 1
`,
  radix: `// Radix Sort (base 10, using Counting Sort as subroutine)
1. function RadixSort(arr):
2.   max_val = max(arr)
3.   exp = 1 // Start with the least significant digit (1s place)
4.
5.   // Loop through all digits (1, 10, 100, ...)
6.   while max_val / exp > 0:
7.     // Apply Counting Sort based on current digit (exp)
8.     CountingSortByDigit(arr, exp)
9.     exp = exp * 10
10.
11.
// Subroutine: Counting Sort by specific digit (exp)
12. function CountingSortByDigit(arr, exp):
13.  count = new Array(10).fill(0)
14.  output = new Array(n)
15.
16.  // 1. Count frequencies of digit
17.  for x in arr:
18.    digit = (x / exp) % 10
19.    count[digit] = count[digit] + 1
20.
21.  // 2. Calculate cumulative sum
22.  for i from 1 to 9:
23.    count[i] = count[i] + count[i-1]
24.
25.  // 3. Place elements into sorted order
26.  for i from n-1 down to 0:
27.    value = arr[i]
28.    digit = (value / exp) % 10
29.    position = count[digit] - 1
30.    output[position] = value
31.    count[digit] = count[digit] - 1
32.
33.  // 4. Copy output array back to arr
34.  for i from 0 to n-1:
35.    arr[i] = output[i]
`
};
// --- END PSEUDOCODE DEFINITIONS ---

// Helper function to generate a random array
const generateRandomArray = () => {
  const size = Math.floor(Math.random() * 8) + 5; // 5 to 12 elements
  // Note: Radix and Counting Sort work best when the numbers are small and positive
  return Array.from({ length: size }, () => Math.floor(Math.random() * 50) + 1); 
};

// --- SORTING ALGORITHM LOGIC (Generates History) ---

// 1. Counting Sort History Generator
const getCountingSortSteps = (initialArr) => {
  const steps = [];
  let currentArr = [...initialArr];
  const n = currentArr.length;
  if (n === 0) return steps;

  const maxVal = Math.max(...currentArr);
  const k = maxVal; // Range K is maxVal
  
  // Step 1: Initialization
  let count = Array(k + 1).fill(0);
  let output = Array(n).fill(null);
  steps.push({ array: [...currentArr], auxiliary: { count: [...count], output: [...output] }, highlightLine: 2, description: 'Initialize Count and Output arrays.' });
  steps.push({ array: [...currentArr], auxiliary: { count: [...count], output: [...output] }, highlightLine: 3, description: 'Initialize Count and Output arrays.' });

  // Step 2: Count Frequencies (Lines 6-8)
  for (let i = 0; i < n; i++) {
    const val = currentArr[i];
    count[val]++;
    steps.push({ array: [...currentArr], highlightIndices: [i], auxiliary: { count: [...count], output: [...output] }, highlightLine: 7, description: `Counting element ${val}. count[${val}] = ${count[val]}` });
  }

  // Step 3: Cumulative Sum (Lines 10-12)
  for (let i = 1; i <= k; i++) {
    if (i < count.length) {
      count[i] = count[i] + count[i - 1];
      steps.push({ array: [...currentArr], highlightIndices: [i], auxiliary: { count: [...count], output: [...output] }, highlightLine: 11, description: `Cumulative sum at index ${i}.` });
    }
  }

  // Step 4: Place elements (Lines 14-18)
  // This must be done in reverse for stability
  for (let i = n - 1; i >= 0; i--) {
    const value = currentArr[i];
    const position = count[value] - 1;

    steps.push({ array: [...currentArr], highlightIndices: [i], auxiliary: { count: [...count], output: [...output] }, highlightLine: 15, description: `Processing element ${value} at index ${i}.` });

    steps.push({ array: [...currentArr], highlightIndices: [i], auxiliary: { count: [...count], output: [...output] }, highlightLine: 16, description: `Calculated position in output: ${position}.` });

    output[position] = value;
    steps.push({ array: [...currentArr], highlightIndices: [i], auxiliary: { count: [...count], output: [...output] }, highlightLine: 17, description: `Place ${value} at output index ${position}.` });

    count[value]--;
    steps.push({ array: [...currentArr], highlightIndices: [i], auxiliary: { count: [...count], output: [...output] }, highlightLine: 18, description: `Decrement count[${value}].` });
  }

  // Step 5: Copy back (Lines 21-22)
  for (let i = 0; i < n; i++) {
    currentArr[i] = output[i];
    steps.push({ array: [...currentArr], highlightIndices: [i], auxiliary: { count: [...count], output: [...output] }, highlightLine: 22, description: `Copying sorted element back: ${currentArr[i]}` });
  }

  // Final State
  steps.push({ array: [...currentArr], auxiliary: { count: [...count], output: [...output] }, highlightLine: 0, description: 'Sort finished.' });
  return steps;
};

// 2. Bucket Sort History Generator
const getBucketSortSteps = (initialArr) => {
  const steps = [];
  let currentArr = [...initialArr];
  const n = currentArr.length;
  if (n === 0) return steps;

  const maxVal = Math.max(...currentArr);
  const numBuckets = 5; // Fixed 5 buckets for visualization simplicity

  // Step 1: Initialize Buckets
  const buckets = Array.from({ length: numBuckets }, () => []);
  steps.push({ array: [...currentArr], auxiliary: { buckets: buckets.map(b => [...b]) }, highlightLine: 2, description: 'Initialize 5 empty buckets.' });

  // Step 2: Distribution (Lines 7-9)
  for (let i = 0; i < n; i++) {
    const value = currentArr[i];
    const bucketIndex = Math.floor(value * numBuckets / (maxVal + 1));
    buckets[bucketIndex].push(value);

    steps.push({
      array: [...currentArr],
      highlightIndices: [i],
      auxiliary: { buckets: buckets.map(b => [...b]) },
      highlightLine: 9,
      description: `Placing ${value} into Bucket ${bucketIndex}.`
    });
  }

  // Step 3: Sort Buckets (Lines 12-14)
  for (let i = 0; i < numBuckets; i++) {
    buckets[i].sort((a, b) => a - b); // Sorting each bucket (simulated)
    steps.push({
      array: [...currentArr],
      auxiliary: { buckets: buckets.map(b => [...b]) },
      highlightLine: 13,
      description: `Sorting Bucket ${i}.`
    });
  }

  // Step 4: Concatenate (Lines 17-20)
  let k = 0;
  for (let i = 0; i < numBuckets; i++) {
    for (const value of buckets[i]) {
      currentArr[k] = value;
      steps.push({
        array: [...currentArr],
        highlightIndices: [k],
        auxiliary: { buckets: buckets.map(b => [...b]) },
        highlightLine: 19,
        description: `Concatenating ${value} from Bucket ${i} to main array index ${k}.`
      });
      k++;
    }
  }

  // Final State
  steps.push({ array: [...currentArr], auxiliary: { buckets: buckets.map(b => [...b]) }, highlightLine: 0, description: 'Sort finished.' });
  return steps;
};

// 3. Radix Sort History Generator
const getRadixSortSteps = (initialArr) => {
  const steps = [];
  let currentArr = [...initialArr];
  const n = currentArr.length;
  if (n === 0) return steps;

  const maxVal = Math.max(...currentArr);
  let exp = 1;

  steps.push({ array: [...currentArr], auxiliary: {}, highlightLine: 3, description: 'Starting Radix Sort. Max value is ' + maxVal });

  while (Math.floor(maxVal / exp) > 0) {
    steps.push({ array: [...currentArr], auxiliary: {}, highlightLine: 6, description: `Starting pass for digit: ${exp}` });

    // --- Counting Sort Subroutine for current digit (exp) ---
    const k = 10; // Digits 0-9
    let count = Array(k).fill(0);
    let output = Array(n).fill(null);

    // Initialization step in subroutine
    steps.push({ array: [...currentArr], auxiliary: { count: [...count] }, highlightLine: 13, description: `Initialize count array for ${exp}'s place.` });

    // 1. Count Frequencies (Lines 17-19)
    for (let i = 0; i < n; i++) {
      const val = currentArr[i];
      const digit = Math.floor(val / exp) % 10;
      count[digit]++;
      steps.push({ array: [...currentArr], highlightIndices: [i], auxiliary: { count: [...count] }, highlightLine: 19, description: `Counting digit ${digit} of ${val}.` });
    }

    // 2. Cumulative Sum (Lines 22-23)
    for (let i = 1; i < k; i++) {
      count[i] = count[i] + count[i - 1];
      steps.push({ array: [...currentArr], auxiliary: { count: [...count] }, highlightLine: 23, description: `Cumulative sum on count array.` });
    }

    // 3. Place elements (Lines 26-31)
    for (let i = n - 1; i >= 0; i--) {
      const value = currentArr[i];
      const digit = Math.floor(value / exp) % 10;
      const position = count[digit] - 1;

      steps.push({ array: [...currentArr], highlightIndices: [i], auxiliary: { count: [...count], output: [...output] }, highlightLine: 28, description: `Processing ${value}. Digit is ${digit}.` });

      output[position] = value;
      steps.push({ array: [...currentArr], highlightIndices: [i], auxiliary: { count: [...count], output: [...output] }, highlightLine: 30, description: `Place ${value} at output index ${position}.` });

      count[digit]--;
      steps.push({ array: [...currentArr], highlightIndices: [i], auxiliary: { count: [...count], output: [...output] }, highlightLine: 31, description: `Decrement count[${digit}].` });
    }

    // 4. Copy back (Lines 34-35)
    for (let i = 0; i < n; i++) {
      currentArr[i] = output[i];
      steps.push({ array: [...currentArr], highlightIndices: [i], auxiliary: { count: [...count], output: [...output] }, highlightLine: 35, description: `Copying sorted element back.` });
    }

    exp *= 10;
    steps.push({ array: [...currentArr], auxiliary: {}, highlightLine: 9, description: `Moving to the next digit.` });
  }

  // Final State
  steps.push({ array: [...currentArr], auxiliary: {}, highlightLine: 0, description: 'Radix Sort finished.' });
  return steps;
};

// --- MAIN REACT COMPONENT ---
const VisualizationApp = () => {
  const [algorithm, setAlgorithm] = useState('counting'); // 'counting', 'bucket', 'radix'
  const [initialArray, setInitialArray] = useState(INITIAL_ARRAY);
  const [array, setArray] = useState(INITIAL_ARRAY);
  const [inputArrayText, setInputArrayText] = useState(""); // Empty initial input text

  const [speed, setSpeed] = useState(500); // milliseconds
  const [isSorting, setIsSorting] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [history, setHistory] = useState([]);

  // Memoize the sorting steps generation based on algorithm and initial array
  const generateHistory = useCallback(() => {
    const arr = [...initialArray];
    switch (algorithm) {
      case 'counting':
        return getCountingSortSteps(arr);
      case 'bucket':
        return getBucketSortSteps(arr);
      case 'radix':
        return getRadixSortSteps(arr);
      default:
        return [];
    }
  }, [algorithm, initialArray]);

  // Handle Input Parsing and Array Update
  const parseInput = (text) => {
    const newArr = text
      .split(',')
      .map(s => parseInt(s.trim()))
      .filter(n => !isNaN(n) && n >= 0 && n <= 100); // Filter for valid, non-negative numbers up to 100
    
    // Use the parsed array if valid, otherwise use an empty array (INITIAL_ARRAY)
    const finalArr = newArr.length > 0 ? newArr : INITIAL_ARRAY; 
    
    setInitialArray(finalArr);
    setArray(finalArr);
    setInputArrayText(finalArr.join(', '));
    setCurrentStep(0);
    setIsSorting(false);
    setHistory([]);
  };

  // START button logic
  const handleStart = () => {
    if (isSorting || array.length === 0) return; // Prevent start if sorting or array is empty
    const newHistory = generateHistory();
    setHistory(newHistory);
    setCurrentStep(0);
    setIsSorting(true);
  };

  // NEXT STEP logic (runs via interval)
  useEffect(() => {
    let intervalId;
    if (isSorting && currentStep < history.length - 1) {
      intervalId = setInterval(() => {
        setCurrentStep(prev => prev + 1);
      }, speed);
    } else if (currentStep === history.length - 1 && history.length > 0) {
      setIsSorting(false);
    }

    // Cleanup function
    return () => clearInterval(intervalId);
  }, [isSorting, currentStep, history.length, speed]);

  // Update array state on step change
  useEffect(() => {
    if (history.length > 0 && currentStep < history.length) {
      setArray(history[currentStep].array);
    }
  }, [currentStep, history]);

  // RESET button logic
  const handleReset = () => {
    setIsSorting(false);
    setCurrentStep(0);
    setArray(initialArray);
    setHistory([]);
  };

  // Helper to retrieve current step data
  const currentStepData = history.length > 0 ? history[currentStep] : null;
  const currentHighlightLine = currentStepData?.highlightLine || 0;
  const currentHighlightIndices = currentStepData?.highlightIndices || [];
  const currentAuxiliary = currentStepData?.auxiliary || {};

  const pseudocode = PSEUDOCODE[algorithm];

  // Helper to display auxiliary data
  const AuxiliaryDisplay = ({ data, algorithm }) => {
    if (algorithm === 'counting' && data.count) {
      const count = data.count;
      return (
        <div style={styles.auxiliaryViz}>
          <h4 style={{textAlign: 'center', margin: '0 0 10px 0'}}>Count Array (Index = Value)</h4>
          <div style={styles.auxiliaryRow}>
            {count.map((value, index) => (
              <div key={`count-${index}`} style={styles.auxiliaryCell(currentHighlightIndices.includes(index))}>
                {value}
                <span style={styles.auxLabel}>[{index}]</span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    if (algorithm === 'radix' && data.count) {
        const count = data.count;
        return (
          <div style={styles.auxiliaryViz}>
            <h4 style={{textAlign: 'center', margin: '0 0 10px 0'}}>Count Array (Index = Digit)</h4>
            <div style={styles.auxiliaryRow}>
              {count.map((value, index) => (
                <div key={`count-${index}`} style={styles.auxiliaryCell(false)}>
                  {value}
                  <span style={styles.auxLabel}>[{index}]</span>
                </div>
              ))}
            </div>
          </div>
        );
      }
    if (algorithm === 'bucket' && data.buckets) {
      const buckets = data.buckets;
      return (
        <div style={styles.auxiliaryViz}>
          <h4 style={{textAlign: 'center', margin: '0 0 10px 0'}}>Buckets</h4>
          <div style={{display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '20px'}}>
            {buckets.map((bucket, index) => (
              <div key={`bucket-${index}`} style={{padding: '10px', border: '1px solid #ccc', borderRadius: '4px', minWidth: '100px'}}>
                <div style={{...styles.auxLabel, color: '#00b8a9', fontSize: '0.9rem'}}>Bucket {index}</div>
                <div style={{display: 'flex', gap: '5px', flexWrap: 'wrap', marginTop: '5px'}}>
                  {bucket.length > 0 ? bucket.map((val, idx) => (
                    <span key={`bval-${index}-${idx}`} style={styles.arrayBox(false)}>{val}</span>
                  )) : (
                    <span style={{color: '#999', fontSize: '0.8rem'}}>Empty</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={styles.global}>
      <div style={styles.container}>
        <h1 style={styles.header}>Linear Time Sorting</h1>

        {/* Algorithm Selection Buttons */}
        <div style={styles.buttonGroup}>
          <button
            onClick={() => setAlgorithm('counting')}
            style={{ ...styles.button, ...(algorithm === 'counting' ? styles.algoButtonActive : styles.algoButtonInactive) }}
          >
            Counting Sort
          </button>
          <button
            onClick={() => setAlgorithm('bucket')}
            style={{ ...styles.button, ...(algorithm === 'bucket' ? styles.algoButtonActive : styles.algoButtonInactive) }}
          >
            Bucket Sort
          </button>
          <button
            onClick={() => setAlgorithm('radix')}
            style={{ ...styles.button, ...(algorithm === 'radix' ? styles.algoButtonActive : styles.algoButtonInactive) }}
          >
            Radix Sort
          </button>
        </div>

        {/* Input and Controls */}
        <div style={styles.inputControl}>
          <label style={{whiteSpace: 'nowrap'}}>Enter numbers (0-100, comma-separated):</label>
          <input
            type="text"
            value={inputArrayText}
            onChange={(e) => setInputArrayText(e.target.value)}
            style={styles.input}
            disabled={isSorting}
          />

          <button
            onClick={() => parseInput(inputArrayText)}
            style={{ ...styles.button, ...styles.controlButton }}
            disabled={isSorting}
          >
            Load
          </button>
          <button
            onClick={handleStart}
            style={{ 
              ...styles.button, 
              ...(isSorting || initialArray.length === 0 || history.length > 0 ? styles.controlButtonDisabled : styles.controlButton) 
            }}
            disabled={isSorting || initialArray.length === 0 || history.length > 0}
          >
            Start
          </button>
          <button
            onClick={handleReset}
            style={{ ...styles.button, ...styles.controlButton }}
          >
            Reset
          </button>
          <button
            onClick={() => parseInput(generateRandomArray().join(', '))}
            style={{ ...styles.button, ...styles.controlButton }}
            disabled={isSorting}
          >
            Generate New Array
          </button>
          <label style={{marginLeft: '10px', whiteSpace: 'nowrap'}}>Speed (ms):</label>
          <select
            value={speed}
            onChange={(e) => setSpeed(parseInt(e.target.value))}
            style={{...styles.input, maxWidth: '100px'}}
            disabled={isSorting}
          >
            <option value={1000}>Slow (1000ms)</option>
            <option value={500}>Medium (500ms)</option>
            <option value={200}>Fast (200ms)</option>
          </select>
        </div>

        {/* Status and Array Visualization */}
        <div style={styles.stepInfo}>
          Current Step: {currentStep} / {history.length > 0 ? history.length - 1 : 0}
          {currentStepData && <div style={{marginTop: '5px', fontSize: '0.9rem', fontWeight: 'normal', color: '#666'}}>{currentStepData.description}</div>}
        </div>

        <h3 style={{textAlign: 'center'}}>Current Array</h3>
        <div style={styles.arrayViz}>
          {array.length > 0 ? array.map((value, index) => (
            <div
              key={index}
              style={styles.arrayBox(currentHighlightIndices.includes(index))}
            >
              {value}
            </div>
          )) : (
            <div style={{color: '#888', padding: '10px'}}>Please Load or Generate an array to begin visualization.</div>
          )}
        </div>

        {/* Auxiliary Visualization (Count/Bucket) */}
        <AuxiliaryDisplay data={currentAuxiliary} algorithm={algorithm} />

        {/* Pseudocode Section */}
        <h3 style={{marginTop: '40px', marginBottom: '10px'}}>C++ Pseudocode: {algorithm.charAt(0).toUpperCase() + algorithm.slice(1)} Sort</h3>
        <div style={styles.pseudocodeSection}>
          {pseudocode.split('\n').map((line, index) => (
            <span
              key={index}
              style={styles.codeLine(line.trim().startsWith(currentHighlightLine + '.') || line.trim().startsWith(currentHighlightLine + '.'))}
            >
              {line}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VisualizationApp;