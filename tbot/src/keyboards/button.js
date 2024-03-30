const { Markup } = require("telegraf");

exports.main = Markup.keyboard([
    ["🛍 Mahsulotlar", "🛒 Haridlarim"],
    ["💌 Biz bilan aloqa"]
]).resize();

exports.back = Markup.keyboard([
    ["⏪ Go back"]
]).resize();

exports.cancel = Markup.keyboard([
    ["❌ Cancel"]
]).resize();