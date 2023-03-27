import fs from "fs";
import csvParser from "csv-parser";
import { createObjectCsvWriter as createCsvWriter } from "csv-writer";
import crypto from "crypto";
import { performance } from "perf_hooks";

async function readFile(file) {
  console.log(`Reading file: ${file}`);
  return new Promise((resolve, reject) => {
    const rows = [];

    const stream = fs
      .createReadStream(file)
      .pipe(csvParser())
      .on("data", (row) => {
        rows.push(row);
        //console.log(`Row added from ${file}:`, row); // Add this line
      })
      .on("end", () => {
        console.log(`Finished reading file: ${file}`);
        stream.destroy(); // Close the stream
        resolve(rows);
      })
      .on("error", (error) => {
        stream.destroy(); // Close the stream in case of an error
        reject(error);
      });
  });
}

async function getFileHash(filePath) {
  const fileBuffer = await fs.promises.readFile(filePath);
  const hash = crypto.createHash("sha256");
  hash.update(fileBuffer);
  return hash.digest("hex");
}

export async function calculateDifference(existingFile, currentFile) {
  console.log("start calculateDifference");
  try {
    const startTime = performance.now();

    const existingFileHash = await getFileHash(existingFile);
    const currentFileHash = await getFileHash(currentFile);

    if (existingFileHash === currentFileHash) {
      console.log("No difference found");
      return false;
    }

    console.log("hashes changed");
    const existingRows = await readFile(existingFile);
    const currentRows = await readFile(currentFile);

    console.log("Filtering differences...");
    const startFilteringTime = performance.now();

    const existingRowsSet = new Set(
      existingRows.map((row) => JSON.stringify(row))
    );

    const differenceRows = currentRows.filter((currentRow) => {
      return !existingRowsSet.has(JSON.stringify(currentRow));
    });

    console.log(
      `Filtering completed in ${(
        performance.now() - startFilteringTime
      ).toFixed(2)} ms`
    );

    if (differenceRows.length === 0) {
      console.log("No difference found");
      return false;
    }

    const outputFile = "difference.csv";
    const header = Object.keys(currentRows[0]).map((key) => ({
      id: key,
      title: key,
    }));

    const csvWriter = createCsvWriter({ path: outputFile, header });

    await csvWriter.writeRecords(differenceRows);
    console.log(`Difference saved to ${outputFile}`);
    console.log(
      `Total time elapsed: ${(performance.now() - startTime).toFixed(2)} ms`
    );
    return true;
  } catch (error) {
    console.error("Error calculating difference:", error);
  }
}
