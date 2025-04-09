const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const schema = new Schema({
    name: { type: String, required: true },
    image: {
        type: String
    },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    deleted_at: { type: Date, default: null },
});

schema.index({ name: 1 }, { unique: true })
const Modules = mongoose.model("Modules", schema);

module.exports = Modules;
