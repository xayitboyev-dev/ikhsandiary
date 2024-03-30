const User = require('../models/User');
const updateUser = require("./updateUser");

module.exports = async function (ctx) {
    try {
        await User.create({ first_name: ctx.from.first_name, last_name: ctx.from.last_name, username: ctx.from.username, phone: ctx.from.phone, uid: ctx.from.id });
        console.log(ctx.from.id, 'saved');
    } catch (error) {
        if (error.code == 11000) updateUser(ctx.from.id, { ...ctx.from, uid: ctx.from.id });
        else console.log(error);
    };
};