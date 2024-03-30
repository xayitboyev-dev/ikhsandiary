module.exports = (ctx, next) => {
    if (!["supergroup", "channel", "group"].includes(ctx?.chat?.type)) next();
};