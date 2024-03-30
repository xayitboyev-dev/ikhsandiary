const { model, Schema } = require('mongoose');

const userSchema = new Schema({
    first_name: {
        type: String,
    },
    last_name: {
        type: String,
    },
    username: {
        type: String,
    },
    phone: {
        type: Number,
    },
    uid: {
        type: Number,
        unique: true
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    role: {
        type: String,
        default: 'USER'
    }
});

module.exports = model('user', userSchema);