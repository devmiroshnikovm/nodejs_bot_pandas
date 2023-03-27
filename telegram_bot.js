import TelegramBot from "node-telegram-bot-api";
import fs from "fs";
import path from "path";

import { getTransactionsBYyearsCommertial } from "./js/getTransactionsBYyearsCommertial.js";
import { getTransactionsBYyearsResidential } from "./js/getTransactionsBYyearsResidential.js";
import { requestGetDataFromServer } from "./js/requestGetDataFromServer.js";
import { getTransactionsBySubTypesFromDifferent } from "./js/getTransactionsBySubTypesFromDifferent.js";
import { getTransactionsBYyearsCommertialHottest } from "./js/getTransactionsBYyearsCommertialHottest.js";
import { getTransactionsTopDifferenceCron } from "./js/getTransactionsTopDifferenceCron.js";

import { calculateDifference } from "./js/utils.js";

// Add these imports at the top
import cron from "node-cron";
import { format } from "date-fns";

import { config as dotenvConfig } from "dotenv";
dotenvConfig();

const token = process.env.TELEGRAM_TOKEN;
const startData = "01/01/2023";

async function dailyUpdate() {
  console.log("start cron");

  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const todayFormatted = format(today, "yyyy-M-d");
  const formattedTodayForRequest = format(today, "MM/dd/yyyy");
  const yesterdayFormatted = format(yesterday, "yyyy-M-d");

  const todayFile = `Transactions_short_${todayFormatted}.csv`;
  const yesterdayFile = `Transactions_short_${yesterdayFormatted}.csv`;

  try {
    // Fetch today's transactions and save them to todayFile
    const csvData = await requestGetDataFromServer(
      startData,
      formattedTodayForRequest
    );

    await fs.promises.writeFile(todayFile, csvData);

    // Calculate the difference between yesterday's and today's transactions
    const hasDifference = await calculateDifference(yesterdayFile, todayFile);

    const chatId = "-943404921";

    if (hasDifference) {
      const response = await getTransactionsTopDifferenceCron();

      bot.sendMessage(chatId, "Top 3 projects:\n" + response);

      await fs.promises.unlink(yesterdayFile);
      console.log(`Removed ${yesterdayFile}`);
    } else {
      bot.sendMessage(
        chatId,
        "there is no changes in dates, from  " + today + " to " + yesterday
      );
    }
  } catch (error) {
    console.error("Error during daily update:", error);
  }
}

// cron.schedule("* * * * *", dailyUpdate); every minute
cron.schedule("0 9 * * *", dailyUpdate); // daily at 12-00 moscow time

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/get_commertial/, async (msg) => {
  const chatId = msg.chat.id;

  try {
    await getTransactionsBYyearsCommertial();
    const imagePath = path.join(
      process.cwd(),
      "transactions_by_years_commertial.png"
    );
    const imageStream = fs.createReadStream(imagePath);
    bot.sendPhoto(chatId, imageStream);
  } catch (error) {
    console.error(error);
    bot.sendMessage(
      chatId,
      "An error occurred while processing the data. Please try again."
    );
  }
});

bot.onText(/\/get_residential/, async (msg) => {
  const chatId = msg.chat.id;

  try {
    await getTransactionsBYyearsResidential();
    const imagePath = path.join(
      process.cwd(),
      "transactions_by_years_residential.png"
    );
    const imageStream = fs.createReadStream(imagePath);
    bot.sendPhoto(chatId, imageStream);
  } catch (error) {
    console.error(error);
    bot.sendMessage(
      chatId,
      "An error occurred while processing the data. Please try again."
    );
  }
});

bot.onText(/\/get_subtypes/, async (msg) => {
  const chatId = msg.chat.id;

  try {
    const response = await getTransactionsBySubTypesFromDifferent();
    await sendMessageWithTyping(chatId, response);
  } catch (error) {
    console.error(error);
    bot.sendMessage(
      chatId,
      "An error occurred while processing the data. Please try again."
    );
  }
});

bot.onText(/\/get_hottest/, async (msg) => {
  const chatId = msg.chat.id;

  try {
    const response = await getTransactionsBYyearsCommertialHottest();
    await sendMessageWithTyping(chatId, response);
  } catch (error) {
    console.error(error);
    bot.sendMessage(
      chatId,
      "An error occurred while processing the data. Please try again."
    );
  }
});

bot.onText(/\/get_difference/, async (msg) => {
  const chatId = msg.chat.id;

  try {
    const response = await getTransactionsTopDifferenceCron();
    await sendMessageWithTyping(chatId, response);
  } catch (error) {
    console.error(error);
    bot.sendMessage(
      chatId,
      "An error occurred while processing the data. Please try again."
    );
  }
});

const sendMessageWithTyping = async (chatId, text) => {
  if (!text || text.trim() === "") {
    console.error("Empty message text");
    return;
  }

  // Format the text with HTML tags
  const formattedText = `<pre>${text}</pre>`;

  await bot.sendChatAction(chatId, "typing");
  // Adjust the delay according to the length of the text
  const delay = 3000;
  await new Promise((resolve) => setTimeout(resolve, delay));
  bot.sendMessage(chatId, formattedText, { parse_mode: "HTML" });
};
