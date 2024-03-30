const { model, Schema } = require('mongoose');

const productSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    file: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    buys: [
        {
            type: Number,
            ref: "user"
        }
    ]
});

module.exports = model('product', productSchema);