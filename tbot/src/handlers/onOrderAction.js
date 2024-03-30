const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");
const bot = require("../core/bot");

module.exports = async (ctx) => {
    const data = ctx.match[0];
    const id = ctx.match[1] || ctx.match[2];

    try {
        // confirm the order
        if (data.startsWith("order_confirm_")) {
            // update the order
            const order = await Order.findByIdAndUpdate(id, { status: "confirmed" }).populate("product");

            // get user
            const user = await User.findOne({ uid: order.user });

            // send the product to the user
            bot.telegram.sendDocument(order.user, order.product.file, { disable_notification: true, caption: `<b>🔖 Mahsulot:</b> ${order.product.name}\n\n✅ To'lovingiz tasdiqlandi va mahsulot taqdim etildi.`, parse_mode: "HTML" });

            // update this message
            ctx.editMessageCaption(`🔖 <b>Mahsulot:</b> ${order.product.name}\n💵 <b>Narxi:</b> ${order.product.price.toLocaleString('en-US', { style: 'currency', currency: 'UZS' }).slice(4, -3)} UZS\n👤 Haridor: <a href="tg://user?id=${order.user}">${user.first_name}</a>\n\n✅ #tasdiqlangan`, { parse_mode: "HTML" });

            ctx.answerCbQuery("Tasdiqlandi ✅");

            await Product.findByIdAndUpdate(order.product._id, { $push: { buys: order.user } });
        };

        // cancel the order
        if (data.startsWith("order_cancel_")) {
            // update the order
            const order = await Order.findByIdAndUpdate(id, { status: "cancelled" }).populate("product");

            // get user
            const user = await User.findOne({ uid: order.user });

            // send message to the user
            await bot.telegram.sendMessage(order.user, "❌ To'lovingiz tasdiqlanmadi va buyurtma bekor qilindi!");

            // update caption
            await ctx.editMessageCaption(`🔖 <b>Mahsulot:</b> ${order.product.name}\n💵 <b>Narxi:</b> ${order.product.price.toLocaleString('en-US', { style: 'currency', currency: 'UZS' }).slice(4, -3)} UZS\n👤 Haridor: <a href="tg://user?id=${order.user}">${user.first_name}</a>\n\n❌ #bekorqilingan`, { parse_mode: "HTML" });

            ctx.answerCbQuery("Bekor qilindi ❌");
        };
    } catch (error) {
        ctx.answerCbQuery(error.message);
    };
};