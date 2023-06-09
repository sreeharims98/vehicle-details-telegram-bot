const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");
require("dotenv").config();

// replace the value below with the Telegram token you receive from @BotFather
const token = process.env.TELEGRAM_TOKEN;

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });

// Matches "/help"
bot.onText(/\/help/, (msg, match) => {
  const chatId = msg.chat.id;
  bot.sendMessage(
    chatId,
    `Example:
     /find kl01a1111`
  );
});

// Matches "/find"
bot.onText(/\/find (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const resp = match[1]; // the captured "whatever"

  getVehicleDetailsApi(resp, chatId);
  // send back the matched "whatever" to the chat
});

async function getVehicleDetailsApi(resp, chatId) {
  const options = {
    method: "POST",
    url: "https://vehicle-rc-information.p.rapidapi.com/",
    headers: {
      "content-type": "application/json",
      "X-RapidAPI-Key": process.env.RAPID_API_KEY,
      "X-RapidAPI-Host": "vehicle-rc-information.p.rapidapi.com",
    },
    data: {
      VehicleNumber: resp,
    },
  };

  try {
    const response = await axios.request(options);
    const res = response.data.result;
    const details = `
    <b>Registration Number</b> : ${res.registration_number}
    <b>Owner Name</b> : ${res.owner_name}
    <b>Mobile number</b> : ${res.owner_mobile_no}
    <b>Current Address</b> : ${res.current_address}
    <b>Permanent Address</b> : ${res.permanent_address}
    <b>Father Name</b> : ${res.father_name}
    <b>Registered Place</b> : ${res.registered_place}
    <b>Manufacturer</b> : ${res.manufacturer}
    <b>Manufacturer Model</b> : ${res.manufacturer_model}
    <b>Registration Date</b> : ${res.registration_date}
    <b>Colour</b> : ${res.colour}
    <b>Fuel Type</b> : ${res.fuel_type}
    <b>Engine Number</b> : ${res.engine_number}
    <b>Chassis Number</b> : ${res.chassis_number}
    <b>Seating Capacity</b> : ${res.seating_capacity}
    <b>Norms Type</b> : ${res.norms_type}
    <b>Insurance Name</b> : ${res.insurance_name}
    <b>MV Tax upto</b> : ${res.mv_tax_upto}  
    <b>Fitness upto</b> : ${res.fitness_upto}
    <b>PUC valid upto</b> : ${res.puc_valid_upto}
    `;

    bot.sendMessage(chatId, details, { parse_mode: "HTML" });
  } catch (error) {
    console.error(error);
    bot.sendMessage(chatId, "Something went wrong");
  }
}
