import { spawn } from "child_process";

export async function getTransactionsBYyearsCommertial() {
  return new Promise((resolve, reject) => {
    const python = spawn(
      "/Users/miroshnikovm/Desktop/pandas/myenv/bin/python3",
      ["./python_modules/transactions_by_years_resedential.py"]
    );
    python.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(`Python script exited with code ${code}`));
      } else {
        resolve();
      }
    });
  });
}
