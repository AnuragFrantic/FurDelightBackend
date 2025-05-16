const mongoose = require('mongoose');
const { Schema } = mongoose;

const WishlistItemSchema = new Schema({
    item: {
        type: Schema.Types.ObjectId,
        required: true,
        refPath: 'items.item_type'
    },
    item_type: {
        type: String,
        required: true,
        enum: ['ProductVariant', 'User']
    },
    added_at: {
        type: Date,
        default: Date.now
    }
}, { _id: false });

const WishlistSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    items: [WishlistItemSchema],
    type: {
        type: String,
        enum: ['product', 'doctor', 'mixed'],
        default: 'mixed'
    },
    is_deleted: {
        type: Boolean,
        default: false
    },
    deleted_at: {
        type: Date
    },

    updated_by: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });

WishlistSchema.index({ user: 1, 'items.item': 1 }, { unique: true });

module.exports = mongoose.model('Wishlist', WishlistSchema);
