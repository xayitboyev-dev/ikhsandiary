const { Scenes: { BaseScene } } = require('telegraf');
const scene = new BaseScene('admin:main');
const { main } = require('../keyboards/button');
const { oneProduct } = require('../keyboards/inline');
const auth = require("../middlewares/auth");
const User = require("../../models/User");
const Product = require("../../models/Product");

scene.enter(auth, (ctx) => {
    ctx.reply('🔝 Admin paneldasiz', main);
});

scene.hears("📤 Xabar tarqatish", (ctx) => {
    ctx.scene.enter('admin:sendMessage', { type: "all" });
});

scene.hears("👤 Userga xabar", (ctx) => {
    ctx.scene.enter('admin:sendTo');
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

scene.hears("🆕 Yangi mahsulot", (ctx) => {
    ctx.scene.enter('admin:newproduct');
});

scene.hears("📊 Statistika", async (ctx) => {
    const activeUsers = await User.count({ isActive: true });
    const nonActiveUsers = await User.count({ isActive: null || false });

    ctx.replyWithHTML(`📊 Statistika\n\nActive userlar: <b>${activeUsers}</b>\nNonActive userlar: <b>${nonActiveUsers}</b>\nBarchasi: <b>${activeUsers + nonActiveUsers}</b>`);
});

scene.hears("🏠 Client", (ctx) => ctx.scene.enter("main"));

scene.action(/^delete_product_(.+)$/, async (ctx) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(ctx.match[1]);

        if (deletedProduct) {
            ctx.answerCbQuery("✅ Mahsulot o'chirildi.", { show_alert: true });
            ctx.deleteMessage();
        } else {
            throw new Error("❗️ Product not found.");
        };
    } catch (error) {
        ctx.answerCbQuery(error.message, { show_alert: true });
    };
});

module.exports = scene;