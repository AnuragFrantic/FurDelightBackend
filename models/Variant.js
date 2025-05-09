const mongoose = require("mongoose")


const VariantSchema = new mongoose.Schema({
    name: {
        type: String
    },
}, { timestamps: true })


module.exports = mongoose.model("Variant", VariantSchema);