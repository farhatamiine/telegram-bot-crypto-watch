// ESM syntax is supported.
import { Markup, Telegraf } from "telegraf";
import axios from "axios";
var scheduler = require("node-schedule");

import dotenv from "dotenv";

dotenv.config();

let choosenCoin = null;

const bot = new Telegraf(process.env.telegram_token);

bot.start((ctx) => {
  choosenCoin = null;
  bot.telegram.sendMessage(ctx.chat.id, `Welcome to <b>Crypto Info</b>!!`, {
    parse_mode: "HTML",
  });
  bot.telegram.sendMessage(ctx.chat.id, `Type <b>/help</b>  for more Info?`, {
    parse_mode: "HTML",
  });
});

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
    `Send <b>/coin</b> to receive a message with a list of availables coins`,
    {
      parse_mode: "HTML",
    }
  );
  bot.telegram.sendMessage(
    ctx.chat.id,
    `Send <b>/timer</b> to set a timer for 1min frame for selected coin`,
    {
      parse_mode: "HTML",
    }
  );
  bot.telegram.sendMessage(ctx.chat.id, `Send <b>/quit</b> to stop the bot`, {
    parse_mode: "HTML",
  });
});

//! Run Coin command
bot.hears("/coin", (ctx) => {
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
        ],
        [
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

//! Get Crypto info once

bot.hears("Shiba", (ctx) => {
  choosenCoin = "Shiba";
  console.log(choosenCoin);
  axios
    .get(
      `https://api.coingecko.com/api/v3/coins/shiba-inu?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`
    )
    .then(function (response) {
      const name = response.data.name;

      const price = response.data.market_data.current_price.usd;

      bot.telegram.sendMessage(ctx.chat.id, `${name} is on <b>${price}$</b>`, {
        parse_mode: "HTML",
      });
    })
    .catch(function (error) {
      console.log("error");
    })
    .then(function () {});
});

bot.hears("Bitcoin", (ctx) => {
  choosenCoin = "BitCoin";
  console.log(choosenCoin);
  axios
    .get(
      `https://api.coingecko.com/api/v3/coins/bitcoin?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`
    )
    .then(function (response) {
      const name = response.data.name;

      const price = response.data.market_data.current_price.usd;

      bot.telegram.sendMessage(ctx.chat.id, `${name} is on <b>${price}$</b>`, {
        parse_mode: "HTML",
      });
    })
    .catch(function (error) {
      console.log("error");
    })
    .then(function () {});
});

bot.hears("Saitama-inu", (ctx) => {
  choosenCoin = "Saitama-inu";
  console.log(choosenCoin);
  axios
    .get(
      `https://api.coingecko.com/api/v3/coins/saitama-inu?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`
    )
    .then(function (response) {
      const name = response.data.name;

      const price = response.data.market_data.current_price.usd;

      bot.telegram.sendMessage(
        ctx.chat.id,
        `${name} is on <b>${Number(price).toFixed(15)}$</b>`,
        {
          parse_mode: "HTML",
        }
      );
    })
    .catch(function (error) {
      console.log("error");
    })
    .then(function () {});
});

bot.hears("decentraland", (ctx) => {
  choosenCoin = "decentraland";
  console.log(choosenCoin);
  axios
    .get(
      `https://api.coingecko.com/api/v3/coins/decentraland?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`
    )
    .then(function (response) {
      const name = response.data.name;

      const price = response.data.market_data.current_price.usd;

      bot.telegram.sendMessage(ctx.chat.id, `${name} is on <b>${price}$</b>`, {
        parse_mode: "HTML",
      });
    })
    .catch(function (error) {
      console.log("error");
    })
    .then(function () {});
});

//! Run timer command
bot.hears("/timer", (ctx) => {
  if (choosenCoin == null) {
    console.log("choosenCoin is null");
    bot.telegram.sendMessage(ctx.chat.id, `Please choose a coin first`, {
      parse_mode: "HTML",
    });
    let coinMessage = `Choose coin to track ?`;
    ctx.deleteMessage();
    bot.telegram.sendMessage(ctx.chat.id, coinMessage, {
      reply_markup: {
        keyboard: [
          [
            {
              text: "ShibaInu",
              callback_data: "ShibaInu",
            },
            {
              text: "BitCoin",
              callback_data: "BitCoin",
            },
          ],
          [
            {
              text: "SaitamaInu",
              callback_data: "SaitamaInu",
            },
            {
              text: "Decentraland",
              callback_data: "Decentraland",
            },
          ],
        ],
      },
    });
  } else {
    if (scheduler.scheduledJobs["timer"]) {
      scheduler.scheduledJobs["timer"].cancel();
    }
    ctx.reply(`Getting update on ${getCoinsId(choosenCoin)}`);
    scheduler.scheduleJob("timer", "*/1 * * * *", () => {
      axios
        .get(
          `https://api.coingecko.com/api/v3/coins/${getCoinsId(
            choosenCoin
          )}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`
        )
        .then(function (response) {
          const name = response.data.name;

          const price = response.data.market_data.current_price.usd;

          bot.telegram.sendMessage(
            ctx.chat.id,
            `${name} is on <b>${Number(price).toFixed(15)}$</b>`,
            {
              parse_mode: "HTML",
            }
          );
        })
        .catch(function (error) {
          console.log("error");
        })
        .then(function () {});
    });
  }
});

//! Get Crypto info with a timer
bot.hears("ShibaInu", (ctx) => {
  if (scheduler.scheduledJobs["timer"]) {
    scheduler.scheduledJobs["timer"].cancel();
  }
  ctx.reply("Getting update on ShibaInu");
  scheduler.scheduleJob("timer", "*/1 * * * *", () => {
    axios
      .get(
        `https://api.coingecko.com/api/v3/coins/shiba-inu?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`
      )
      .then(function (response) {
        const name = response.data.name;

        const price = response.data.market_data.current_price.usd;

        bot.telegram.sendMessage(
          ctx.chat.id,
          `${name} is on <b>${Number(price).toFixed(15)}$</b>`,
          {
            parse_mode: "HTML",
          }
        );
      })
      .catch(function (error) {
        console.log("error");
      })
      .then(function () {});
  });
});

bot.hears("BitCoin", (ctx) => {
  if (scheduler.scheduledJobs["timer"]) {
    scheduler.scheduledJobs["timer"].cancel();
  }
  ctx.reply("Getting update on BitCoin");
  scheduler.scheduleJob("timer", "*/1 * * * *", () => {
    axios
      .get(
        `https://api.coingecko.com/api/v3/coins/bitcoin?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`
      )
      .then(function (response) {
        const name = response.data.name;

        const price = response.data.market_data.current_price.usd;

        bot.telegram.sendMessage(
          ctx.chat.id,
          `${name} is on <b>${Number(price).toFixed(15)}$</b>`,
          {
            parse_mode: "HTML",
          }
        );
      })
      .catch(function (error) {
        console.log("error");
      })
      .then(function () {});
  });
});

bot.hears("Decentraland", (ctx) => {
  if (scheduler.scheduledJobs["timer"]) {
    scheduler.scheduledJobs["timer"].cancel();
  }
  ctx.reply("Getting update on Decentraland");
  scheduler.scheduleJob("timer", "*/1 * * * *", () => {
    axios
      .get(
        `https://api.coingecko.com/api/v3/coins/decentraland?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`
      )
      .then(function (response) {
        const name = response.data.name;

        const price = response.data.market_data.current_price.usd;

        bot.telegram.sendMessage(
          ctx.chat.id,
          `${name} is on <b>${Number(price).toFixed(15)}$</b>`,
          {
            parse_mode: "HTML",
          }
        );
      })
      .catch(function (error) {
        console.log("error");
      })
      .then(function () {});
  });
});

bot.hears("SaitamaInu", (ctx) => {
  if (scheduler.scheduledJobs["timer"]) {
    scheduler.scheduledJobs["timer"].cancel();
  }
  ctx.reply("Getting update on SaitamaInu");
  scheduler.scheduleJob("timer", "*/1 * * * *", () => {
    axios
      .get(
        `https://api.coingecko.com/api/v3/coins/saitama-inu?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`
      )
      .then(function (response) {
        const name = response.data.name;

        const price = response.data.market_data.current_price.usd;

        bot.telegram.sendMessage(
          ctx.chat.id,
          `${name} is on <b>${Number(price).toFixed(15)}$</b>`,
          {
            parse_mode: "HTML",
          }
        );
      })
      .catch(function (error) {
        console.log("error");
      })
      .then(function () {});
  });
});

//! Quit bot
bot.hears("/quit", (ctx) => {
  choosenCoin = null; //! Reset choosen coin
  ctx.reply("⛔ Ending the Job ");
  if (scheduler.scheduledJobs["timer"]) {
    scheduler.scheduledJobs["timer"].cancel();
    ctx.reply("⛔  the Job End ");
  }
});

function getCoinsId(coinName) {
  switch (coinName.toLowerCase()) {
    case "shiba":
      return "shiba-inu";
    case "bitcoin":
      return "bitcoin";
    case "decentraland":
      return "decentraland";
    case "saitama-inu":
      return "saitama-inu";
    default:
      return null;
  }
}

bot.launch();
