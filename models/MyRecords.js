const mongoose = require("mongoose")



const MyRecordsSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    upcoming_vaccination: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UpcomingVaccination"
    },
    pet_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Pet"
    },
    vaccination_time: {
        type: String
    },
    vaccination_date: {
        type: Date
    }
}, { timestamps: true })


module.exports = mongoose.model("MyRecords", MyRecordsSchema);
