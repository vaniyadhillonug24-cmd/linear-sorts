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
    maxWidth: '1200px', // Increased width for better auxiliary display
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
    color: '#00b8a9', // Light Teal Header Color
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
    backgroundColor: '#00b8a9', // Light Teal
    color: 'white',
    boxShadow: '0 2px 4px rgba(0, 184, 169, 0.3)',
  },
  algoButtonInactive: {
    backgroundColor: '#e0e0e0',
    color: '#333',
  },
  controlButton: {
    backgroundColor: '#4da6ff', // Light Blue
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
    minHeight: '80px', // Reduced height since we are using boxes
    marginBottom: '30px',
    paddingBottom: '10px',
    overflowX: 'auto',
  },
  // Bar styles removed since we use arrayBox exclusively for clarity
  arrayBox: (isHighlight) => ({
    width: '50px', // Slightly larger box for better visibility
    height: '50px',
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
    fontSize: '0.9rem',
    flexShrink: 0,
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
    overflowX: 'auto', // Allow scrolling for large count arrays
  },
  auxiliaryRow: {
    display: 'flex',
    justifyContent: 'flex-start', // Align left for potentially long arrays
    gap: '2px',
    marginBottom: '10px',
    flexWrap: 'nowrap', // Prevent wrapping in the auxiliary row
  },
  auxiliaryCell: (isHighlight) => ({
    minWidth: '40px',
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
    flexShrink: 0,
  }),
  auxLabel: {
    fontWeight: 'bold',
    fontSize: '0.7rem',
    color: '#555',
    marginTop: '2px',
  },
  bucketContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
    flexWrap: 'wrap', // Allow wrapping for 10 buckets
    padding: '10px 0',
  },
  singleBucket: (isHighlight) => ({
    padding: '5px',
    border: isHighlight ? '3px solid #71eeb8' : '2px solid #00b8a9',
    borderRadius: '6px',
    minWidth: '90px',
    minHeight: '100px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: isHighlight ? '#f0fff5' : '#fff',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    transition: 'border 0.3s, background-color 0.3s',
    flex: '1 1 18%', // Max 5 per row on wider screens
    maxWidth: '120px',
  }),
  bucketValue: {
    backgroundColor: '#eee',
    borderRadius: '3px',
    padding: '2px 5px',
    margin: '2px 0',
    fontSize: '0.8rem',
    fontWeight: '500',
    width: '90%',
    textAlign: 'center',
  }
};
// --- END CSS STYLES ---

// Initial array state (empty as requested)
const INITIAL_ARRAY = [];

// --- PSEUDOCODE DEFINITIONS ---
const PSEUDOCODE = {
  counting: `// Counting Sort (Range K) - For Non-Negative Integers
1. function CountingSort(arr, n):
2.   max_val = max(arr)
3.   k = max_val + 1 // Range size
4.   count = new Array(k).fill(0) // 1. Init count array
5.   output = new Array(n)
6.
7.   // 1. Count each element's frequency
8.   for x in arr:
9.     count[x] = count[x] + 1
10.
11.  // 2. Calculate cumulative sum
12.  for i from 1 to k-1:
13.    count[i] = count[i] + count[i-1]
14.
15.  // 3. Place elements into sorted order (Reverse loop for stability)
16.  for i from n-1 down to 0:
17.    value = arr[i]
18.    position = count[value] - 1
19.    output[position] = value
20.    count[value] = count[value] - 1
21.
22.  // 4. Copy output array back to arr
23.  for i from 0 to n-1:
24.    arr[i] = output[i]
`,
  bucket: `// Bucket Sort (For uniformly distributed numbers in [0, 1) or normalized range)
1. function BucketSort(arr, n, num_buckets=10):
2.   buckets = new Array(num_buckets)
3.   Initialize all buckets as empty lists
4.   // Find max_val and min_val to normalize if necessary,
5.   // but assume range [0, 1) for simplicity with 10 buckets
6.
7.   // 1. Distribute elements into buckets
8.   for x in arr:
9.     // Mapping x (assuming 0 <= x < 1) to an index 0-9
10.    bucket_index = floor(x * num_buckets) 
11.    buckets[bucket_index].append(x)
12.
13.  // 2. Sort each bucket
14.  for i from 0 to num_buckets-1:
15.    Sort(buckets[i]) // e.g., using Insertion Sort (standard library sort here)
16.
17.  // 3. Concatenate the sorted buckets
18.  index = 0
19.  for i from 0 to num_buckets-1:
20.    for x in buckets[i]:
21.      arr[index] = x
22.      index = index + 1
`,
  radix: `// Radix Sort (base 10, using Counting Sort as subroutine - LSD)
1. function RadixSort(arr):
2.   max_val = max(arr)
3.   exp = 1 // Start with the least significant digit (1s place)
4.
5.   // Loop through all digits (1, 10, 100, ...)
6.   while max_val / exp > 0:
7.     // Apply stable Counting Sort based on current digit (exp)
8.     CountingSortByDigit(arr, exp) 
9.     exp = exp * 10
10.
11.
// Subroutine: Counting Sort by specific digit (exp)
12. function CountingSortByDigit(arr, n, exp):
13.  count = new Array(10).fill(0) // Digits 0-9
14.  output = new Array(n)
15.
16.  // 1. Count frequencies of digit
17.  for x in arr:
18.    digit = floor(x / exp) % 10
19.    count[digit] = count[digit] + 1
20.
21.  // 2. Calculate cumulative sum
22.  for i from 1 to 9:
23.    count[i] = count[i] + count[i-1]
24.
25.  // 3. Place elements into sorted order (Reverse loop for stability)
26.  for i from n-1 down to 0:
27.    value = arr[i]
28.    digit = floor(value / exp) % 10
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

// Helper function to generate a random integer array (for Counting/Radix)
const generateRandomIntArray = () => {
  const size = Math.floor(Math.random() * 8) + 5; // 5 to 12 elements
  // Max value up to 9999 to clearly show 4 Radix passes
  return Array.from({ length: size }, () => Math.floor(Math.random() * 9999) + 1); 
};

// Helper function to generate a random decimal array (for Bucket Sort)
const generateRandomDecimalArray = () => {
    const size = Math.floor(Math.random() * 8) + 5; // 5 to 12 elements
    // Generate numbers between 0.000 and 0.999
    return Array.from({ length: size }, () => parseFloat(Math.random().toFixed(3)));
};

// --- SORTING ALGORITHM LOGIC (Generates History) ---

// 1. Counting Sort History Generator (Detailed Steps)
const getCountingSortSteps = (initialArr) => {
  const steps = [];
  let currentArr = [...initialArr];
  const n = currentArr.length;
  if (n === 0) return steps;

  // IMPORTANT: Filter to ensure only non-negative integers
  const integerArr = currentArr.filter(Number.isInteger);
  if (integerArr.length !== n) {
      // This should be caught by input validation, but safety check
      return [{ array: [...currentArr], auxiliary: {}, highlightLine: 0, description: 'Error: Counting Sort requires non-negative integers.' }];
  }
  
  const maxVal = Math.max(...integerArr);
  const k = maxVal + 1; // Range K is maxVal + 1 (for 0-based indexing)
  
  // Step 1: Initialization (Lines 4-5)
  let count = Array(k).fill(0);
  let output = Array(n).fill(null);
  steps.push({ array: [...currentArr], auxiliary: { count: [...count], output: [...output] }, highlightLine: 4, description: `Initialize Count Array (size ${k}) for range 0 to ${maxVal}.` });
  steps.push({ array: [...currentArr], auxiliary: { count: [...count], output: [...output] }, highlightLine: 5, description: 'Initialize Output Array.' });

  // Step 2: Count Frequencies (Lines 8-9)
  steps.push({ array: [...currentArr], auxiliary: { count: [...count], output: [...output] }, highlightLine: 8, description: 'Start counting element frequencies.' });
  for (let i = 0; i < n; i++) {
    const val = integerArr[i];
    count[val]++;
    steps.push({ array: [...integerArr], highlightIndices: [i], auxiliary: { count: [...count], output: [...output], highlightCountIndex: val }, highlightLine: 9, description: `Counting element ${val}. count[${val}] = ${count[val]}.` });
  }

  // Step 3: Cumulative Sum (Lines 12-13)
  steps.push({ array: [...integerArr], auxiliary: { count: [...count], output: [...output] }, highlightLine: 12, description: 'Calculate cumulative sum (running total).' });
  for (let i = 1; i < k; i++) {
    count[i] = count[i] + count[i - 1];
    steps.push({ array: [...integerArr], auxiliary: { count: [...count], output: [...output], highlightCountIndex: i }, highlightLine: 13, description: `Update count[${i}] = count[${i}] + count[${i-1}] = ${count[i]}.` });
  }

  // Step 4: Place elements (Lines 16-20) - Backward for stability
  steps.push({ array: [...integerArr], auxiliary: { count: [...count], output: [...output] }, highlightLine: 16, description: 'Start placing elements into the output array (in reverse for stability).' });
  
  // Use a copy of count for placement to visualize the full original count array first
  let placementCount = [...count];

  for (let i = n - 1; i >= 0; i--) {
    const value = integerArr[i];
    const position = placementCount[value] - 1;

    steps.push({ array: [...integerArr], highlightIndices: [i], auxiliary: { count: [...placementCount], output: [...output], highlightCountIndex: value }, highlightLine: 17, description: `Processing element ${value} at index ${i}.` });

    steps.push({ array: [...integerArr], highlightIndices: [i], auxiliary: { count: [...placementCount], output: [...output], highlightCountIndex: value }, highlightLine: 18, description: `Calculated position in output using cumulative sum: index ${position}.` });

    output[position] = value;
    steps.push({ array: [...integerArr], highlightIndices: [i], auxiliary: { count: [...placementCount], output: [...output], highlightOutputIndex: position, highlightCountIndex: value }, highlightLine: 19, description: `Place ${value} at output index ${position}.` });

    placementCount[value]--;
    steps.push({ array: [...integerArr], auxiliary: { count: [...placementCount], output: [...output], highlightCountIndex: value }, highlightLine: 20, description: `Decrement count[${value}] to prepare for the next identical element.` });
  }

  // Step 5: Copy back (Lines 23-24)
  steps.push({ array: [...integerArr], auxiliary: { count: [...placementCount], output: [...output] }, highlightLine: 23, description: 'Copying sorted elements from output back to main array.' });
  let finalArr = [...integerArr]; // Start with currentArr (which is integerArr)
  for (let i = 0; i < n; i++) {
    finalArr[i] = output[i];
    steps.push({ array: [...finalArr], highlightIndices: [i], auxiliary: { count: [...placementCount], output: [...output], highlightOutputIndex: i }, highlightLine: 24, description: `Copying element ${finalArr[i]} to index ${i}.` });
  }

  // Final State
  steps.push({ array: [...finalArr], auxiliary: { count: [...placementCount], output: [...output] }, highlightLine: 0, description: 'Counting Sort finished.' });
  return steps;
};

// 2. Bucket Sort History Generator (Detailed Steps)
const getBucketSortSteps = (initialArr) => {
  const steps = [];
  let currentArr = [...initialArr];
  const n = currentArr.length;
  if (n === 0) return steps;

  // IMPORTANT: Filter to ensure numbers are in the [0, 1) range for standard bucket sort
  const decimalArr = currentArr.filter(val => val >= 0 && val < 1);
  if (decimalArr.length !== n) {
      return [{ array: [...currentArr], auxiliary: {}, highlightLine: 0, description: 'Error: Bucket Sort (standard) requires numbers between 0 (inclusive) and 1 (exclusive).' }];
  }

  const numBuckets = 10; // Fixed 10 buckets (0-9) as requested

  // Step 1: Initialize Buckets (Lines 2-3)
  const buckets = Array.from({ length: numBuckets }, () => []);
  steps.push({ array: [...decimalArr], auxiliary: { buckets: buckets.map(b => [...b]) }, highlightLine: 3, description: 'Initialize 10 empty buckets.' });

  // Step 2: Distribution (Lines 8-11)
  steps.push({ array: [...decimalArr], auxiliary: { buckets: buckets.map(b => [...b]) }, highlightLine: 8, description: 'Start distributing decimal elements (0.x) into 10 buckets.' });
  for (let i = 0; i < n; i++) {
    const value = decimalArr[i];
    // Calculate index: floor(x * 10) gives index 0-9
    const bucketIndex = Math.floor(value * numBuckets); 
    buckets[bucketIndex].push(value);

    steps.push({
      array: [...decimalArr],
      highlightIndices: [i],
      auxiliary: { buckets: buckets.map(b => [...b]), highlightBucket: bucketIndex },
      highlightLine: 11,
      description: `Placing value ${value.toFixed(3)} into Bucket ${bucketIndex}. Index calculated by floor(${value.toFixed(3)} * 10).`
    });
  }

  // Step 3: Sort Buckets (Lines 14-15)
  steps.push({ array: [...decimalArr], auxiliary: { buckets: buckets.map(b => [...b]) }, highlightLine: 14, description: 'Start sorting elements within each bucket (e.g., using Insertion Sort).' });
  for (let i = 0; i < numBuckets; i++) {
    const preSortBucket = [...buckets[i]];
    buckets[i].sort((a, b) => a - b); // Sorting each bucket (standard array sort for simulation)
    
    // Only generate a step if the bucket was modified
    if (preSortBucket.length > 1) {
      steps.push({
        array: [...decimalArr],
        auxiliary: { buckets: buckets.map(b => [...b]), highlightBucket: i },
        highlightLine: 15,
        description: `Sorting Bucket ${i}: [${preSortBucket.map(v => v.toFixed(3)).join(', ')}] -> [${buckets[i].map(v => v.toFixed(3)).join(', ')}]`
      });
    }
  }

  // Step 4: Concatenate (Lines 18-21)
  steps.push({ array: [...decimalArr], auxiliary: { buckets: buckets.map(b => [...b]) }, highlightLine: 18, description: 'Start concatenating sorted buckets back into the main array.' });
  let k = 0;
  let finalArr = [...decimalArr];
  for (let i = 0; i < numBuckets; i++) {
    for (const value of buckets[i]) {
      finalArr[k] = value;
      steps.push({
        array: [...finalArr],
        highlightIndices: [k],
        auxiliary: { buckets: buckets.map(b => [...b]), highlightBucket: i },
        highlightLine: 21,
        description: `Concatenating ${value.toFixed(3)} from Bucket ${i} to main array index ${k}.`
      });
      k++;
    }
  }

  // Final State
  steps.push({ array: [...finalArr], auxiliary: { buckets: buckets.map(b => [...b]) }, highlightLine: 0, description: 'Bucket Sort finished.' });
  return steps;
};

// 3. Radix Sort History Generator (Detailed Steps - LSD)
const getRadixSortSteps = (initialArr) => {
  const steps = [];
  let currentArr = [...initialArr];
  const n = currentArr.length;
  if (n === 0) return steps;

  // IMPORTANT: Filter to ensure non-negative integers
  const integerArr = currentArr.filter(Number.isInteger);
  if (integerArr.length !== n) {
      return [{ array: [...currentArr], auxiliary: {}, highlightLine: 0, description: 'Error: Radix Sort requires non-negative integers.' }];
  }
  currentArr = integerArr;

  const maxVal = Math.max(...currentArr);
  let exp = 1;
  let pass = 1;

  steps.push({ array: [...currentArr], auxiliary: {}, highlightLine: 3, description: 'Starting Radix Sort (LSD). Determining max digits.' });

  // Main Radix Loop (Line 6)
  while (Math.floor(maxVal / exp) > 0) {
    steps.push({ array: [...currentArr], auxiliary: { exp }, highlightLine: 6, description: `Pass ${pass}: Starting Counting Sort for the ${exp}'s place.` });

    // --- Counting Sort Subroutine for current digit (exp) ---
    const k = 10; // Digits 0-9
    let count = Array(k).fill(0);
    let output = Array(n).fill(null);

    // 1. Count Frequencies (Lines 17-19)
    steps.push({ array: [...currentArr], auxiliary: { exp, count: [...count] }, highlightLine: 17, description: `[Pass ${pass}] Counting frequency of the digit at the ${exp}'s place.` });
    for (let i = 0; i < n; i++) {
      const val = currentArr[i];
      const digit = Math.floor(val / exp) % 10;
      count[digit]++;
      steps.push({ array: [...currentArr], highlightIndices: [i], auxiliary: { exp, count: [...count], highlightCountIndex: digit }, highlightLine: 19, description: `[Pass ${pass}] Counting digit ${digit} of ${val}.` });
    }

    // 2. Cumulative Sum (Lines 22-23)
    steps.push({ array: [...currentArr], auxiliary: { exp, count: [...count] }, highlightLine: 22, description: `[Pass ${pass}] Calculating cumulative count for stability.` });
    for (let i = 1; i < k; i++) {
      count[i] = count[i] + count[i - 1];
      steps.push({ array: [...currentArr], auxiliary: { exp, count: [...count], highlightCountIndex: i }, highlightLine: 23, description: `[Pass ${pass}] Update count[${i}] = ${count[i]}.` });
    }

    // 3. Place elements (Lines 26-31) - Backward for stability
    steps.push({ array: [...currentArr], auxiliary: { exp, count: [...count] }, highlightLine: 26, description: `[Pass ${pass}] Placing elements into output array (reverse for stability).` });
    
    // Use a copy of count for placement visualization
    let placementCount = [...count];

    for (let i = n - 1; i >= 0; i--) {
      const value = currentArr[i];
      const digit = Math.floor(value / exp) % 10;
      const position = placementCount[digit] - 1;

      steps.push({ array: [...currentArr], highlightIndices: [i], auxiliary: { exp, count: [...placementCount], highlightCountIndex: digit }, highlightLine: 28, description: `[Pass ${pass}] Processing ${value}. Digit is ${digit}. Target output index ${position}.` });

      output[position] = value;
      steps.push({ array: [...currentArr], highlightIndices: [i], auxiliary: { exp, count: [...placementCount], output: [...output], highlightOutputIndex: position, highlightCountIndex: digit }, highlightLine: 30, description: `[Pass ${pass}] Place ${value} at output index ${position}.` });

      placementCount[digit]--;
      steps.push({ array: [...currentArr], auxiliary: { exp, count: [...placementCount], output: [...output], highlightCountIndex: digit }, highlightLine: 31, description: `[Pass ${pass}] Decrement count[${digit}].` });
    }

    // 4. Copy back (Lines 34-35)
    steps.push({ array: [...currentArr], auxiliary: { exp, count: [...placementCount], output: [...output] }, highlightLine: 34, description: `[Pass ${pass}] Copying partially sorted array back.` });
    for (let i = 0; i < n; i++) {
      currentArr[i] = output[i];
      steps.push({ array: [...currentArr], highlightIndices: [i], auxiliary: { exp, count: [...placementCount], output: [...output], highlightOutputIndex: i }, highlightLine: 35, description: `[Pass ${pass}] Copying element ${currentArr[i]} to index ${i}.` });
    }

    exp *= 10;
    pass++;
    steps.push({ array: [...currentArr], auxiliary: { exp }, highlightLine: 9, description: `Move to the next digit place (Exp = ${exp}).` });
  }

  // Final State
  steps.push({ array: [...currentArr], auxiliary: {}, highlightLine: 0, description: 'Radix Sort finished after ' + (pass - 1) + ' passes.' });
  return steps;
};

// --- MAIN REACT COMPONENT ---
const VisualizationApp = () => {
  const [algorithm, setAlgorithm] = useState('counting'); // 'counting', 'bucket', 'radix'
  const [initialArray, setInitialArray] = useState(INITIAL_ARRAY);
  const [array, setArray] = useState(INITIAL_ARRAY);
  // Input text will hold the comma-separated string
  const [inputArrayText, setInputArrayText] = useState(""); 
  const [inputError, setInputError] = useState("");

  const [speed, setSpeed] = useState(500); // milliseconds
  const [isSorting, setIsSorting] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [history, setHistory] = useState([]);

  // Use the history generating functions based on algorithm and initial array
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
    setInputError("");
    let newArr;

    if (algorithm === 'bucket') {
        // Bucket Sort allows decimals (0 <= x < 1)
        newArr = text
          .split(',')
          .map(s => parseFloat(s.trim()))
          .filter(n => !isNaN(n) && n >= 0 && n < 1);
        
        if (newArr.length === 0 && text.trim().length > 0) {
            setInputError("Bucket Sort requires decimal numbers in the range [0, 1). E.g., 0.1, 0.5, 0.99.");
        }
    } else {
        // Counting and Radix Sorts require non-negative integers
        newArr = text
          .split(',')
          .map(s => parseInt(s.trim()))
          .filter(n => !isNaN(n) && Number.isInteger(n) && n >= 0); 
        
        if (newArr.length === 0 && text.trim().length > 0) {
            setInputError("Counting/Radix Sorts require non-negative integers (0, 1, 100, etc.).");
        }
    }
    
    const finalArr = newArr.length > 0 ? newArr : INITIAL_ARRAY; 
    
    setInitialArray(finalArr);
    setArray(finalArr);
    // Format array back to string for input box
    setInputArrayText(finalArr.map(n => algorithm === 'bucket' ? n.toFixed(3) : n).join(', ')); 
    setCurrentStep(0);
    setIsSorting(false);
    setHistory([]);
  };
  
  // Update state when algorithm changes
  useEffect(() => {
    handleReset();
    // Suggest appropriate initial text for the selected algorithm
    if (algorithm === 'bucket') {
        setInputArrayText('0.7, 0.13, 0.9, 0.35, 0.6');
    } else if (algorithm === 'radix') {
        setInputArrayText('329, 457, 657, 839, 436, 720, 355');
    } else {
        setInputArrayText('5, 1, 9, 7, 1, 5, 2');
    }
  }, [algorithm]);


  // START button logic
  const handleStart = () => {
    if (isSorting || array.length === 0) return;
    const newHistory = generateHistory();
    if (newHistory.length > 0) {
        setHistory(newHistory);
        setCurrentStep(0);
        setIsSorting(true);
    }
  };

  // STEP navigation
  const handleNext = () => {
    if (!isSorting && currentStep < history.length - 1) {
        setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (!isSorting && currentStep > 0) {
        setCurrentStep(prev => prev - 1);
    }
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
    setInputError("");
  };

  // Helper to retrieve current step data
  const currentStepData = history.length > 0 ? history[currentStep] : null;
  const currentHighlightLine = currentStepData?.highlightLine || 0;
  const currentHighlightIndices = currentStepData?.highlightIndices || [];
  const currentAuxiliary = currentStepData?.auxiliary || {};

  const pseudocode = PSEUDOCODE[algorithm];
  
  // Component to display the Output Array (used by Counting/Radix)
  const OutputArray = ({ data, highlightIndex, isDecimal = false }) => (
    <div style={{marginTop: '20px', padding: '10px 0', borderTop: '1px solid #ccc'}}>
      <h4 style={{textAlign: 'center', margin: '0 0 10px 0'}}>Output Array</h4>
      <div style={styles.auxiliaryRow}>
        {data.map((value, index) => (
            <div key={`output-${index}`} style={styles.auxiliaryCell(highlightIndex === index)}>
                {value !== null ? (isDecimal ? value.toFixed(3) : value) : ' '}
                <span style={styles.auxLabel}>[{index}]</span>
            </div>
        ))}
      </div>
    </div>
  );

  // Helper to display auxiliary data
  const AuxiliaryDisplay = ({ data, algorithm }) => {
    if ((algorithm === 'counting' || algorithm === 'radix') && data.count) {
      const isRadix = algorithm === 'radix';
      const count = data.count;
      const highlightIndex = data.highlightCountIndex;
      const exp = data.exp || 1;
      
      // Determine the range label
      const maxVal = Math.max(...initialArray);
      let rangeLabel;
      let displayCount = count;
      
      if (isRadix) {
        rangeLabel = `Radix Pass: ${exp}'s Place (Digit)`;
      } else {
        rangeLabel = `Count Array (Index = Value)`;
        // For Counting Sort, only show up to maxVal index
        displayCount = count.slice(0, maxVal + 1); 
      }

      return (
        <div style={styles.auxiliaryViz}>
          <h4 style={{textAlign: 'center', margin: '0 0 10px 0'}}>{rangeLabel}</h4>
          <div style={styles.auxiliaryRow}>
            {/* Header Row (Index/Digit) */}
            {displayCount.map((_, index) => (
              <div key={`count-index-${index}`} style={styles.auxiliaryCell(false)}>
                {isRadix ? index : index}
                <span style={styles.auxLabel}>{isRadix ? 'Digit' : 'Index'}</span>
              </div>
            ))}
          </div>
          <div style={styles.auxiliaryRow}>
            {/* Value Row (Count/Cumulative) */}
            {displayCount.map((value, index) => (
              <div key={`count-value-${index}`} style={styles.auxiliaryCell(highlightIndex === index)}>
                {value}
                <span style={styles.auxLabel}>Count/Cum.</span>
              </div>
            ))}
          </div>
          {data.output && <OutputArray data={data.output} highlightIndex={data.highlightOutputIndex} />}
        </div>
      );
    }
    
    if (algorithm === 'bucket' && data.buckets) {
      const buckets = data.buckets;
      const highlightIndex = data.highlightBucket;
      return (
        <div style={styles.auxiliaryViz}>
          <h4 style={{textAlign: 'center', margin: '0 0 10px 0'}}>10 Buckets (Range [0, 1))</h4>
          <div style={styles.bucketContainer}>
            {buckets.map((bucket, index) => (
              <div 
                key={`bucket-${index}`} 
                style={styles.singleBucket(highlightIndex === index)}
              >
                <div style={{...styles.auxLabel, color: '#00b8a9', fontSize: '0.9rem', marginBottom: '5px'}}>Bucket {index}</div>
                <div style={{display: 'flex', flexDirection: 'column', gap: '2px', width: '100%', alignItems: 'center'}}>
                  {bucket.length > 0 ? bucket.map((val, idx) => (
                    <span key={`bval-${index}-${idx}`} style={styles.bucketValue}>{val.toFixed(3)}</span>
                  )) : (
                    <span style={{color: '#999', fontSize: '0.8rem'}}>Empty</span>
                  )}
                </div>
              </div>
            ))}
          </div>
          {/* Note: Bucket Sort doesn't typically use a separate 'output' array in the same way */}
        </div>
      );
    }
    return null;
  };
  

  return (
    <div style={styles.global}>
      <div style={styles.container}>
        <h1 style={styles.header}>Linear Time Sorting Visualization ({algorithm.charAt(0).toUpperCase() + algorithm.slice(1)} Sort)</h1>

        {/* Algorithm Selection Buttons */}
        <div style={styles.buttonGroup}>
          <button
            onClick={() => setAlgorithm('counting')}
            style={{ ...styles.button, ...(algorithm === 'counting' ? styles.algoButtonActive : styles.algoButtonInactive) }}
          >
            Counting Sort (Integers)
          </button>
          <button
            onClick={() => setAlgorithm('bucket')}
            style={{ ...styles.button, ...(algorithm === 'bucket' ? styles.algoButtonActive : styles.algoButtonInactive) }}
          >
            Bucket Sort (Decimals [0, 1))
          </button>
          <button
            onClick={() => setAlgorithm('radix')}
            style={{ ...styles.button, ...(algorithm === 'radix' ? styles.algoButtonActive : styles.algoButtonInactive) }}
          >
            Radix Sort (LSD Integers)
          </button>
        </div>

        {/* Input and Controls */}
        <div style={styles.inputControl}>
          <label style={{whiteSpace: 'nowrap'}}>
            Enter numbers (
            {algorithm === 'bucket' ? '0 <= x < 1, decimals allowed' : 'non-negative integers'}
            , comma-separated):
          </label>
          <input
            type="text"
            value={inputArrayText}
            onChange={(e) => setInputArrayText(e.target.value)}
            style={styles.input}
            disabled={isSorting}
          />
          {inputError && <div style={{color: 'red', flexBasis: '100%', padding: '5px 0', fontSize: '0.9rem'}}>{inputError}</div>}

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
            Start Auto-Sort
          </button>
          <button
            onClick={handlePrev}
            style={{ 
                ...styles.button, 
                ...styles.controlButton,
                ...(isSorting || currentStep === 0 || history.length === 0 ? styles.controlButtonDisabled : {})
            }}
            disabled={isSorting || currentStep === 0 || history.length === 0}
          >
            &lt; Prev Step
          </button>
          <button
            onClick={handleNext}
            style={{ 
                ...styles.button, 
                ...styles.controlButton,
                ...(isSorting || currentStep === history.length - 1 || history.length === 0 ? styles.controlButtonDisabled : {})
            }}
            disabled={isSorting || currentStep === history.length - 1 || history.length === 0}
          >
            Next Step &gt;
          </button>
          <button
            onClick={handleReset}
            style={{ ...styles.button, ...styles.controlButton }}
          >
            Reset
          </button>
          <button
            onClick={() => parseInput(algorithm === 'bucket' ? generateRandomDecimalArray().map(n => n.toFixed(3)).join(', ') : generateRandomIntArray().join(', '))}
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
          Step: **{currentStep}** / **{history.length > 0 ? history.length - 1 : 0}**
          {currentStepData && <div style={{marginTop: '5px', fontSize: '0.9rem', fontWeight: 'normal', color: '#666'}}>{currentStepData.description}</div>}
        </div>

        <h3 style={{textAlign: 'center'}}>Current Array</h3>
        <div style={styles.arrayViz}>
          {array.length > 0 ? array.map((value, index) => (
            <div
              key={index}
              style={styles.arrayBox(currentHighlightIndices.includes(index))}
            >
              {algorithm === 'bucket' ? value.toFixed(3) : value}
            </div>
          )) : (
            <div style={{color: '#888', padding: '10px'}}>
                Please Load or Generate an array to begin visualization. 
                {algorithm === 'bucket' ? ' (Use decimals between 0 and 1)' : ' (Use non-negative integers)'}
            </div>
          )}
        </div>

        {/* Auxiliary Visualization (Count/Bucket) */}
        <AuxiliaryDisplay data={currentAuxiliary} algorithm={algorithm} />

        {/* Pseudocode Section */}
        <h3 style={{marginTop: '40px', marginBottom: '10px'}}>Pseudocode: {algorithm.charAt(0).toUpperCase() + algorithm.slice(1)} Sort</h3>
        <div style={styles.pseudocodeSection}>
          {pseudocode.split('\n').map((line, index) => (
            <span
              key={index}
              // The +1 is to convert 0-based index to 1-based line number for highlighting
              style={styles.codeLine(index + 1 === currentHighlightLine)} 
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