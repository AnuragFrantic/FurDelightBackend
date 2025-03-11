const { Schema, default: mongoose } = require('mongoose')

const ImageSchema = new mongoose.Schema({
    img: { type: String, required: true }
});
const schema = new Schema({
    title: { type: String },
    image: [ImageSchema],
    price: { type: String },
    rating: { type: Number },
    wishlist_status: { type: Boolean },
    quantity: { type: Number },
    description: { type: String },
    unit: { type: String },
    deleted_at: { type: Date },
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    updated_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }

}, { timestamps: true })



module.exports = mongoose.model("Product", schema);