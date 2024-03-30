const mongoose = require('mongoose');

module.exports = async function () {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to database!');
    } catch (error) {
        console.log(error.message);
        process.exit(1);
    };
};