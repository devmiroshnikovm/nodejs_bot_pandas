import { calculateDifference } from "./js/utils.js";

(async () => {
  const result = await calculateDifference(
    "Transactions_short_2023-3-25.csv",
    "Transactions_short_2023-3-26.csv"
  );
  console.log(result);
})();
