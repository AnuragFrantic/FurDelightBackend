const mongoose = require("mongoose")


const SplashSchema = new mongoose.Schema({
    title: {
        type: String
    },
    position: {
        type: Number
    },
    description: {
        type: String
    },
    image: {
        type: String
    }
}, { timestamps: true })


module.exports = mongoose.model("SplashScreen", SplashSchema)