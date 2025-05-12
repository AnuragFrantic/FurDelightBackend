const mongoose = require("mongoose")

const UpcomingVaccination = new mongoose.Schema({
    name: {
        type: String,
    },
    time: {
        type: String,
    },
    date: {
        type: Date
    },
    age: {
        type: String
    },




}, { timestamps: true })



module.exports = mongoose.model('UpcomingVaccination', UpcomingVaccination)