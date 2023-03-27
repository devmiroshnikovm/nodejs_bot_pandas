import fetch from "node-fetch";

async function checkResponse(result) {
  if (result.ok) {
    return await result.text(); //json возвращает promise
  } else {
    throw new Error(`Ошибка: ${result.status}`);
  }
}

export async function requestGetDataFromServer(startData, endData) {
  // Define the POST request body
  const requestBody = {
    parameters: {
      P_FROM_DATE: startData,
      P_TO_DATE: endData,
      P_GROUP_ID: "",
      P_IS_OFFPLAN: "",
      P_IS_FREE_HOLD: "",
      P_AREA_ID: "",
      P_USAGE_ID: "",
      P_PROP_TYPE_ID: "",
      P_TAKE: "-1",
      P_SKIP: "",
      P_SORT: "TRANSACTION_NUMBER_ASC",
    },
    command: "transactions",
    labels: {
      TRANSACTION_NUMBER: "Transaction Number",
      INSTANCE_DATE: "Transaction Date",
      GROUP_EN: "Transaction Type",
      PROCEDURE_EN: "Transaction sub type",
      IS_OFFPLAN_EN: "Registration type",
      IS_FREE_HOLD_EN: "Is Free Hold?",
      USAGE_EN: "Usage",
      AREA_EN: "Area",
      PROP_TYPE_EN: "Property Type",
      PROP_SB_TYPE_EN: "Property Sub Type",
      TRANS_VALUE: "Amount",
      PROCEDURE_AREA: "Transaction Size (sq.m)",
      ACTUAL_AREA: "Property Size (sq.m)",
      ROOMS_EN: "Room(s)",
      PARKING: "Parking",
      NEAREST_METRO_EN: "Nearest Metro",
      NEAREST_MALL_EN: "Nearest Mall",
      NEAREST_LANDMARK_EN: "Nearest Landmark",
      TOTAL_BUYER: "No. of Buyer",
      TOTAL_SELLER: "No. of Seller",
      MASTER_PROJECT_EN: "Master Project",
      PROJECT_EN: "Project",
    },
  };

  console.log("start fetch");
  // Fetch the CSV data
  const result = await fetch(
    "https://gateway.dubailand.gov.ae/open-data/transactions/export/csv",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    }
  );
  return await checkResponse(result);
}
