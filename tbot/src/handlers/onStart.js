const { main } = require("../keyboards/button");
const newUser = require("../utils/newUser");

module.exports = async (ctx) => {
    ctx.scene.leave();
    ctx.reply("👋 Assalamu alaykum, botga xush kelibsiz.", main);
    newUser(ctx);
};