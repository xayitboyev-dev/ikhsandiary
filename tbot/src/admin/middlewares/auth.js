const User = require('../../models/User');

module.exports = async (ctx, next) => {
    try {
        const user = await User.findOne({ uid: ctx.from.id });

        if (user.role === "ADMIN") next();
        else await ctx.scene.enter("main");
    } catch (error) {
        console.log(error);
    };
};