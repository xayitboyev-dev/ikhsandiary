const { Markup } = require("telegraf");

exports.oneProduct = (id) => Markup.inlineKeyboard([
    Markup.button.callback("🗑 Mahsulotni o'chirish", "delete_product_" + id)
]);