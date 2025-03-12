const { Schema, default: mongoose } = require('mongoose');

const ImageSchema = new mongoose.Schema({
    img: { type: String, required: true }
});

const schema = new Schema({
    title: { type: String, required: true },
    url: { type: String, unique: true },
    images: [ImageSchema],
    price: { type: Number, required: true },
    discount_price: { type: Number },

    rating: { type: Number, default: 0 },

    // quantity: { type: Number, default: 1 },
    stock: { type: Number, required: true },
    stock_status: { type: String, enum: ['in_stock', 'out_of_stock', 'pre_order'], default: 'in_stock' },
    sku: { type: String, unique: true, required: true },
    description: { type: String },
    short_description: { type: String },
    unit: { type: String },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    brand: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand' },
    weight: { type: Number },
    color_variants: [{ type: String }],
    size_variants: [{ type: String }],
    materials: [{ type: String }],
    warranty: { type: String },
    return_policy: { type: String },

    deleted_at: { type: Date },
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    updated_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });

module.exports = mongoose.model("Product", schema);
