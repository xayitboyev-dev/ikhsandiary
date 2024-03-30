const { Markup } = require("telegraf");

exports.oneProduct = (id) => Markup.inlineKeyboard([
    Markup.button.callback("🛒 Harid qilish", "buy_" + id),
]);

exports.oneOrder = (id) => Markup.inlineKeyboard([
    Markup.button.callback("✅ Tasdiqlash", "order_confirm_" + id),
    Markup.button.callback("❌ Bekor qilish", "order_cancel_" + id),
]);