const { Scenes: { BaseScene } } = require("telegraf");
const { back } = require("../keyboards/button");
const { oneOrder } = require("../keyboards/inline");
const Product = require("../models/Product");
const Order = require("../models/Order");

// initializing the scene
const scene = new BaseScene("buy");

// use handlers here
scene.enter(async (ctx) => {
    try {
        const product = await Product.findById(ctx.scene.state.id);
        ctx.scene.state.product = product;

        ctx.replyWithPhoto(product.image, { ...back, caption: `🔖 <b>Mahsulot:</b> ${product.name}\n💵 <b>Narxi:</b> ${product.price.toLocaleString('en-US', { style: 'currency', currency: 'UZS' }).slice(4, -3)} UZS\n\n❓ Mahsulotni harid qilish uchun quyida keltirilgan karta raqamiga to'lov qilib, chekni ushbu botga yuborishingiz kerak.\n\n<code>${process.env.BANK_CARD}</code>\n<i>${process.env.BANK_CARD_NAME}</i>`, parse_mode: "HTML" });
    } catch (error) {
        ctx.reply(error.message);
        ctx.scene.enter("main");
    };
});

scene.on("photo", async (ctx) => {
    try {
        const { product } = ctx.scene.state;
        const photoId = ctx.message.photo[ctx.message.photo.length - 1].file_id;

        // create order
        const order = await Order.create({ user: ctx.from.id, product: ctx.scene.state.id });

        ctx.telegram.sendPhoto(process.env.ORDERS_CHANNEL, photoId, { ...oneOrder(order._id), caption: `🔖 <b>Mahsulot:</b> ${product.name}\n💵 <b>Narxi:</b> ${product.price.toLocaleString('en-US', { style: 'currency', currency: 'UZS' }).slice(4, -3)} UZS\n👤 Haridor: <a href="tg://user?id=${ctx.from.id}">${ctx.from.first_name}</a>\n\n#kutilmoqda 🕐`, parse_mode: "HTML" });

        ctx.reply("✅ Chek yuborildi. Menejerlar uni bir necha soatda tekshirishadi, To'lovingiz tasdiqlansa mahsulot taqdim etiladi!");

        ctx.scene.enter("main");
    } catch (error) {
        ctx.reply(error.message);
    };
});

scene.on("message", (ctx) => {
    ctx.reply("❗️ Iltimos chekni skrinshot qilib yuboring.");
});

module.exports = scene;