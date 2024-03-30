const { Scenes: { Stage } } = require('telegraf');

const stage = new Stage([
    require("../admin/scenes/main"),
    require("../admin/scenes/sendMessage"),
    require("../admin/scenes/sendTo"),
    require("../admin/scenes/newProduct"),
    require("./main"),
    require("./buy"),
], {
    default: "main"
});

module.exports = stage;