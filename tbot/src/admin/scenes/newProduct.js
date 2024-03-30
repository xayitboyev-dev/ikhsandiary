const { Scenes: { WizardScene } } = require('telegraf');
const Product = require("../../models/Product");
const { cancel } = require("../../keyboards/button");

const steps = [
    (ctx) => {
        ctx.reply("Nom kiriting.", cancel);
        ctx.wizard.next();
    },
    (ctx) => {
        if (ctx.message?.text) {
            ctx.reply("Tavsif kiriting.");
            ctx.scene.state.name = ctx.message.text;
            ctx.wizard.next();
        } else {
            ctx.reply("❗️ Iltimos nomni faqat harflarda kiriting.");
        };
    },
    (ctx) => {
        if (ctx.message?.text) {
            ctx.reply("Narx kiriting.");
            ctx.scene.state.description = ctx.message.text;
            ctx.wizard.next();
        } else {
            ctx.reply("❗️ Iltimos tavsifni faqat harflarda kiriting.");
        };
    },
    (ctx) => {
        if (ctx.message?.text && parseInt(ctx.message.text)) {
            ctx.reply("Rasm yuboring.");
            ctx.scene.state.price = parseInt(ctx.message.text);
            ctx.wizard.next();
        } else {
            ctx.reply("❗️ Iltimos narxni faqat sonlarda kiriting.");
        };
    },
    (ctx) => {
        if (ctx.message?.photo && ctx.message.photo.length > 0) {
            ctx.reply("File yuboring.");
            ctx.scene.state.image = ctx.message.photo[ctx.message.photo.length - 1].file_id;
            ctx.wizard.next();
        } else {
            ctx.reply('❗️ Iltimos faqat rasm yuboring.');
        };
    },
    async (ctx) => {
        if (ctx.message?.document?.file_id) {
            ctx.scene.state.file = ctx.message.document.file_id;

            // save the new product on the database!
            try {
                await Product.create(ctx.scene.state);

                ctx.reply("✅ Mahsulot joylandi.");
                ctx.scene.enter("admin:main");
            } catch (error) {
                ctx.reply(error.message);
            };
        } else {
            ctx.reply('❗️ Iltimos faqat file yuboring.');
        };
    }
];

const scene = new WizardScene('admin:newproduct', ...steps);

module.exports = scene;