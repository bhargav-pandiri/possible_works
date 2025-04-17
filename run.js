const fs = require('fs');

// Function to read the JSON file and process it
function readFileAndProcessJSON(filePath) {
    // Read the file asynchronously
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error("Error reading the file:", err);
            return;
        }

        try {
            // Parse the JSON data
            const jsonString = JSON.parse(data);

            // Process each test case
            jsonString.forEach((testCase, index) => {
                const points = getDecodedPoints(testCase);
                const secret = lagrangeInterpolationAtZero(points);
                console.log(${secret});
            });
        } catch (e) {
            console.error("Invalid JSON in file. Please provide a valid JSON file.");
        }
    });
}

// Decode points from the input JSON
function getDecodedPoints(data) {
    const k = data.keys.k;
    const points = [];

    // Iterate over all keys in the data
    for (let key in data) {
        if (key === "keys") continue;

        const x = parseInt(key); // The key is the x-coordinate
        const base = parseInt(data[key].base); // The base for decoding
        const value = data[key].value; // The encoded y value

        // Decode the y value using the provided base
        const y = BigInt(parseInt(value, base)); // Convert the encoded value to base 10

        points.push({ x, y });
    }

    points.sort((a, b) => a.x - b.x); // Sort points by x-coordinate
    return points.slice(0, k); // Return the first 'k' points
}

// Lagrange interpolation at x = 0
function lagrangeInterpolationAtZero(points) {
    let result = 0n;

    // Iterate through the points to perform the interpolation
    for (let i = 0; i < points.length; i++) {
        let xi = BigInt(points[i].x);
        let yi = points[i].y;

        let numerator = 1n;
        let denominator = 1n;

        for (let j = 0; j < points.length; j++) {
            if (i !== j) {
                let xj = BigInt(points[j].x);
                numerator *= -xj;
                denominator *= (xi - xj);
            }
        }

        result += yi * (numerator / denominator); // Add the result of the current term to the total result
    }

    return result; // Return the final result of the interpolation at x = 0
}

// Replace 'your-file-path.json' with the actual path to the JSON file you want to upload and process
const filePath = 'test.json';

// Call the function to read and process the JSON file
readFileAndProcessJSON(filePath);
