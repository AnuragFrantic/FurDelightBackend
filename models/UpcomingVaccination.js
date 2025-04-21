const mongoose = require("mongoose")

const UpcomingVaccination = new mongoose.Schema({
    name: {
        type: String,
    },
    time : {
        type: String,
    },
    date : {
        type: Date
    },


})



module.exports = mongoose.model('UpcomingVaccination', UpcomingVaccination)