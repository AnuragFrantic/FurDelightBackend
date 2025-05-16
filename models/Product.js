const { Schema, default: mongoose } = require('mongoose');
const slugify = require('slugify'); // Import slugify

const ImageSchema = new mongoose.Schema({
    img: { type: String, required: true }
});

const schema = new Schema({
    title: { type: String, required: true },
    url: { type: String, unique: true },
    image: [ImageSchema],

    hide: { type: Boolean },
    stock_status: { type: String, enum: ['in_stock', 'out_of_stock', 'pre_order'], default: 'in_stock' },
    sku: { type: String, unique: true, required: true },
    description: { type: String },
    short_description: { type: String },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    shop_by_category: { type: mongoose.Schema.Types.ObjectId, ref: 'ShopByCategory' },
    brand: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand' },

    // color_variants: [{ type: String  }],
    // size_variants: [{ type: String }],
    // materials: [{ type: String }],
    warranty: { type: String },
    rating: {
        type: Number,
        default: 0,
    }, // Average rating of the product
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


// 🧠 Auto-generate unique slug from title before saving
schema.pre('save', async function (next) {
    if (this.isModified('title') || !this.url) {
        let baseSlug = slugify(this.title, { lower: true, strict: true });
        let slug = baseSlug;
        let count = 1;

        // Check for uniqueness
        while (await mongoose.models.Product.findOne({ url: slug })) {
            slug = `${baseSlug}-${count++}`;
        }

        this.url = slug;
    }
    next();
});

module.exports = mongoose.model("Product", schema);
