const mongoose = require("mongoose")


const SlotList = new mongoose.Schema({
    start_time: {
        type: String
    },
    end_time: {
        type: String
    },
    slot: {
        type: String
    }
}, { timestamps: true })


module.exports = mongoose.model('SlotList', SlotList)