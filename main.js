// ESM syntax is supported.
import { Telegraf } from "telegraf";
import axios from "axios";
var scheduler = require("node-schedule");

import dotenv from "dotenv";

dotenv.config();

var dailyJob = scheduler.scheduleJob("0 15 0 * * *", function () {
  console.log("this will run everyday at 12:15 AM");
});

const bot = new Telegraf(process.env.telegram_token);

bot.start((ctx) => ctx.reply("Welcome"));

bot.help((ctx) => {
  bot.telegram.sendMessage(
    ctx.chat.id,
    `Send <b>/help</b> to receive a greeting`,
    {
      parse_mode: "HTML",
    }
  );
  bot.telegram.sendMessage(
    ctx.chat.id,
    `Send   <b>Coin</b> to receive a message with a list of availables coins`,
    {
      parse_mode: "HTML",
    }
  );
  bot.telegram.sendMessage(ctx.chat.id, `Send <b>Quit</b> to stop the bot`, {
    parse_mode: "HTML",
  });
});

bot.hears("Coin", (ctx) => {
  console.log(ctx.from);
  let coinMessage = `great, here are coin to choose from ?`;
  ctx.deleteMessage();
  bot.telegram.sendMessage(ctx.chat.id, coinMessage, {
    reply_markup: {
      keyboard: [
        [
          {
            text: "Shiba",
            callback_data: "Shiba",
          },
          {
            text: "Bitcoin",
            callback_data: "Bitcoin",
          },
          {
            text: "Saitama-inu",
            callback_data: "Saitama",
          },
          {
            text: "decentraland",
            callback_data: "decentraland",
          },
        ],
      ],
    },
  });
});

bot.hears("Shiba", (ctx) => {
  axios
    .get(
      `https://api.coingecko.com/api/v3/coins/shiba-inu?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`
    )
    .then(function (response) {
      const name = response.data.name;
      console.log(name);
      const price = response.data.market_data.current_price.usd;
      console.log(price);
      bot.telegram.sendMessage(ctx.chat.id, `${name} is on <b>${price}$</b>`, {
        parse_mode: "HTML",
      });
    })
    .catch(function (error) {
      console.log(error);
    })
    .then(function () {});
});

bot.hears("Bitcoin", (ctx) => {
  axios
    .get(
      `https://api.coingecko.com/api/v3/coins/bitcoin?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`
    )
    .then(function (response) {
      const name = response.data.name;
      console.log(name);
      const price = response.data.market_data.current_price.usd;
      console.log(price);
      bot.telegram.sendMessage(ctx.chat.id, `${name} is on <b>${price}$</b>`, {
        parse_mode: "HTML",
      });
    })
    .catch(function (error) {
      console.log(error);
    })
    .then(function () {});
});

bot.hears("Saitama-inu", (ctx) => {
  axios
    .get(
      `https://api.coingecko.com/api/v3/coins/saitama-inu?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`
    )
    .then(function (response) {
      const name = response.data.name;
      console.log(name);
      const price = response.data.market_data.current_price.usd;
      console.log(price);
      bot.telegram.sendMessage(
        ctx.chat.id,
        `${name} is on <b>${Number(price).toFixed(15)}$</b>`,
        {
          parse_mode: "HTML",
        }
      );
    })
    .catch(function (error) {
      console.log(error);
    })
    .then(function () {});
});

bot.hears("decentraland", (ctx) => {
  axios
    .get(
      `https://api.coingecko.com/api/v3/coins/decentraland?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`
    )
    .then(function (response) {
      const name = response.data.name;
      console.log(name);
      const price = response.data.market_data.current_price.usd;
      console.log(price);
      bot.telegram.sendMessage(ctx.chat.id, `${name} is on <b>${price}$</b>`, {
        parse_mode: "HTML",
      });
    })
    .catch(function (error) {
      console.log(error);
    })
    .then(function () {});
});

bot.hears("Timer", (ctx) => {
  ctx.reply("⏳ Getting data");
  scheduler.scheduleJob("timer", "*/1 * * * *", () => {
    axios
      .get(
        `https://api.coingecko.com/api/v3/coins/saitama-inu?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`
      )
      .then(function (response) {
        const name = response.data.name;
        console.log(name);
        const price = response.data.market_data.current_price.usd;
        console.log(price);
        bot.telegram.sendMessage(
          ctx.chat.id,
          `${name} is on <b>${Number(price).toFixed(15)}$</b>`,
          {
            parse_mode: "HTML",
          }
        );
      })
      .catch(function (error) {
        console.log(error);
      })
      .then(function () {});
  });
});

bot.hears("Quit", (ctx) => {
  ctx.reply("⛔ Ending the Job ");
  if (scheduler) {
    scheduler.scheduledJobs["timer"].cancel();
    ctx.reply("⛔  the Job End ");
  }
});

bot.launch();
