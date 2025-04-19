const PetActivityModal = require('../models/PetActivity')


exports.createPetActivity = async (req, res) => {
    try {
        const data = new PetActivityModal(req.body)

        if (req.file) {
            data.image = req.file.path
        }

        await data.save()
        res.status(201).json({
            success: true,
            message: "Pet Activity created successfully!",
            data: data,
            error: 0,
        });
    } catch (err) {
        console.log(err)
    }
}

exports.getAllActivity = async (req, res) => {
    try {

        const filter = { deleted_at: null }
        const data = await PetActivityModal.find(filter)

        res.status(200).json({
            success: true,
            message: "Pet Activity created successfully!",
            data: data,
            error: 0,
        });
    } catch (err) {
        console.log(err)
    }
}

exports.updatePetActivity = async (req, res) => {
    try {
        const { id } = await req.params
        let updateData = req.body
        if (req.file) {
            updateData.image = req.file.path;
        }
        const petfoodactivity = await PetActivityModal.findByIdAndUpdate(id, updateData, { new: true })
        if (!petfoodactivity) {
            return res.status(404).json({ error: 1, message: "Pet Activity not found!" });
        }
        res.status(200).json({ success: true, message: "Pet Activity updated successfully!", data: petfoodactivity, error: 0 });
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: 1, message: "Internal Server Error", details: err.message });
    }
}



exports.deletePetActivity = async (req, res) => {
    try {
        const data = await PetActivityModal.findById(req.params.id);

        if (!data || data.deleted_at) {
            return res.status(404).json({ error: 1, message: "Pet data not found!" });
        }

        data.deleted_at = new Date();
        await data.save();

        res.status(200).json({
            success: true,
            message: "Pet Activity deleted successfully!",
            error: 0,
        });
    } catch (err) {
        res.status(500).json({
            error: 1,
            message: "Internal Server Error",
            details: err.message,
        });
    }
};

