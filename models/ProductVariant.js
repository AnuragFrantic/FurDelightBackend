const mongoose = require("mongoose");


const ImageSchema = new mongoose.Schema({
    img: { type: String, required: true }
});

const ProductVariantSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    url: { type: String, unique: true },
    name: {
        type: String
    },
    image: [ImageSchema],
    // variants: [{
    //     type: {
    //         type: String, // e.g., 'Color', 'Size', 'Material'
    //         // enum: ['Color', 'Size', 'Material'],
    //         required: true
    //     },
    //     name: {
    //         type: String,
    //         required: true
    //     }
    // }],
    size: {
        type: String
    },
    color: {
        type: String
    },
    material: {
        type: String
    },
    mrp: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        default: 0
    },
    rating: { type: Number, default: 0 },
    stock: {
        type: Number,
        required: true,
        default: 0
    },
    stock_status: {
        type: String,
        enum: ["in_stock", "out_of_stock", "pre_order"],
        default: "in_stock"
    },
    wishlist: {
        type: Boolean,
        default: false
    },
    hide: {
        type: Boolean
    },
    unit: { type: mongoose.Schema.Types.ObjectId, ref: 'Unit' },
    unit_value: { type: String },

    sku: {
        type: String,
        required: true,
        unique: true
    },
    deleted_at: {
        type: Date
    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    updated_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, { timestamps: true });

module.exports = mongoose.model("ProductVariant", ProductVariantSchema);
