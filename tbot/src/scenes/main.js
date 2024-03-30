const { Scenes: { BaseScene } } = require("telegraf");
const { main } = require("../keyboards/button");
const { oneProduct } = require("../keyboards/inline");
const Product = require("../models/Product");

// initializing the scene
const scene = new BaseScene("main");

// use handlers here
scene.enter((ctx) => {
    ctx.reply("🔝 Asosiy menyu", main);
});

scene.hears("🛍 Mahsulotlar", async (ctx) => {
    try {
        const products = await Product.aggregate([
            {
                $addFields: {
                    buysCount: { $size: '$buys' } // Add new field 'buysCount' with the length of the 'buys' array
                }
            },
            {
                $unset: 'buys' // Remove the 'buys' field from the documents
            }
        ]);

        if (!products.length) {
            return ctx.reply("📂 Hali mahsulotlar joylanmagan.");
        };

        products.forEach((product) => {
            ctx.replyWithPhoto(product.image, { ...oneProduct(product._id), caption: `🔖 <b>${product.name}</b>\n\n<b>Tavsif:</b> ${product.description}\n<b>Narxi:</b> ${product.price.toLocaleString('en-US', { style: 'currency', currency: 'UZS' }).slice(4, -3)} UZS\n<b>Sotib olishlar soni:</b> ${product.buysCount}`, parse_mode: "HTML" });
        });
    } catch (error) {
        ctx.reply(error.message);
    };
});

scene.hears("🛒 Haridlarim", async (ctx) => {
    try {
        const products = await Product.find({ buys: { $in: ctx.from.id } }).select("-buys");

        if (!products.length) {
            return ctx.reply("📂 Hali haridlaringiz mavjud emas.");
        };

        products.forEach((product) => {
            ctx.replyWithDocument(product.file, { caption: `🔖 <b>${product.name}</b>\n\n${product.description}`, parse_mode: "HTML" });
        });
    } catch (error) {
        ctx.reply(error.message);
    };
});

scene.hears("💌 Biz bilan aloqa", async (ctx) => {
    ctx.reply(`Har qanday savol, kelishuv yoki shikoyat uchun admin bilan bog'laning!\n\n🧑‍💻 ${process.env.ADMIN}`);
});

scene.action(/^buy_(.+)$/, (ctx) => {
    ctx.deleteMessage();
    ctx.scene.enter("buy", { id: ctx.match[1] });
});

scene.on("message", (ctx) => {
    ctx.reply("🔽 Kerakli bo'limni tanlang.", main);
});

module.exports = scene;