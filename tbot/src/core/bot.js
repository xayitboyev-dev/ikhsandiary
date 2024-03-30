const { Telegraf } = require("telegraf");

// bot constructor
const bot = new Telegraf(process.env.BOT_TOKEN);

module.exports = bot;