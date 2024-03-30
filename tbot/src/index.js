// configuration of dotenv
require("dotenv").config({ path: __dirname + "/config/.env" });

// connect mongodb database
require("./utils/database")();

// require modules
const { session } = require("telegraf");
const checkUser = require("./middlewares/checkUser");
const onStart = require("./handlers/onStart");
const stage = require("./scenes/index");
const bot = require("./core/bot");
const onOrderAction = require("./handlers/onOrderAction");

// on order action
bot.action(/^order_confirm_(.+)|order_cancel_(.+)$/, onOrderAction);

// use middlewares
bot.use(session());
bot.use(stage.start(onStart).command("admin", (ctx) => ctx.scene.enter("admin:main")).hears('❌ Cancel', (ctx) => ctx.scene.enter('admin:main')).hears('⏪ Go back', (ctx) => ctx.scene.enter('main')).middleware());
bot.use(checkUser);

// run bot
if (process.env.NODE_ENV === 'production') {
    require("./webhook");
} else {
    bot.launch();
    console.log("Bot started...");
};

process.on("unhandledRejection", (reason) => console.log("unhandledRejection:", reason));
process.on("uncaughtException", (reason) => console.log("uncaughtException:", reason));