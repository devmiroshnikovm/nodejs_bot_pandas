import { spawn } from "child_process";

export async function getTransactionsBYyearsCommertialHottest() {
  return new Promise((resolve, reject) => {
    const python = spawn(
      "/Users/miroshnikovm/Desktop/pandas/myenv/bin/python3",
      [
        "./python_modules/transactions_by_years_resedential_all_years_hottest_month.py",
      ]
    );

    let output = "";

    python.stdout.on("data", (data) => {
      console.log(`Python stdout: ${data}`);
      output += data.toString(); // Collect the data from the Python script
    });

    python.stderr.on("data", (data) => {
      console.error(`Python stderr: ${data}`);
    });

    python.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(`Python script exited with code ${code}`));
      } else {
        resolve(output); // Pass the collected data to the resolve function
      }
    });
  });
}
