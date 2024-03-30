const express = require('express');
const bot = require('./core/bot');
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Set webhook to /updates");
});

app.post("/updates", (req, res) => {
    bot.handleUpdate(req.body);
    res.send({ ok: true });
});

app.listen(normalizePort(process.env.PORT || 3000), () => {
    console.log("Webhook server listening on port " + process.env.PORT)
});

// port normalizer function
function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    };

    if (port >= 0) {
        // port number
        return port;
    };

    return false;
};