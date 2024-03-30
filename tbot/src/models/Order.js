const { model, Schema } = require('mongoose');

const productSchema = new Schema({
    user: {
        type: Number,
        ref: "user"
    },
    product: {
        type: Schema.Types.ObjectId,
        ref: "product",
        
    },
    status: {
        type: String,
        enum: ["pending", "cancelled", "confirmed"],
        default: "pending"
    }
}, { timestamps: true });

module.exports = model('order', productSchema);