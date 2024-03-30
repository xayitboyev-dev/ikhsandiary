const { Markup } = require('telegraf');

exports.main = Markup.keyboard([
    ["📤 Xabar tarqatish", "📊 Statistika"],
    ["🛍 Mahsulotlar", "🆕 Yangi mahsulot"],
    ["👤 Userga xabar", "🏠 Client"]
]).resize();