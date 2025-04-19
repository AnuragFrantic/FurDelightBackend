const PetFoodModal = require('../models/PetFood')


exports.CreatePetFood = async (req, res) => {
    try {
        let data = new PetFoodModal(req.body);

        if (req.file) {
            data.image = req.file.path;
        }


        await data.save(); // Don't forget to save it!

        res.status(201).json({
            success: true,
            message: "Pet Food created successfully",
            data: data,
            error: 0
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            error: 1,
            message: "Failed to create Pet Food",
            error: err.message,
        });
    }
}



exports.getAllPetFood = async (req, res) => {
    try {
        const petTypeName = req.query.pet_type;
        const petfoodtypename = req.query.petfood_type;

        const filter = { deleted_at: null };

        let query = PetFoodModal.find(filter)
            .populate({
                path: 'pet_type',
                match: petTypeName ? { name: petTypeName } : {},
            })
            .populate({
                path: 'pet_food_type',
                match: petfoodtypename ? { name: petfoodtypename } : {},
            });

        let data = await query;

        // Filter out entries where populate match failed
        if (petTypeName) {
            data = data.filter(item => item.pet_type !== null);
        }
        if (petfoodtypename) {
            data = data.filter(item => item.pet_food_type !== null);
        }

        res.status(200).json({
            success: true,
            message: "Pet Food fetched successfully",
            data,
            error: 0,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            error: 1,
            message: "Failed to fetch Pet Food",
            error: err.message,
        });
    }
};












exports.updatePetFood = async (req, res) => {
    try {
        const { id } = await req.params
        let updateData = req.body
        if (req.file) {
            updateData.image = req.file.path;
        }
        const petfooddata = await PetFoodModal.findByIdAndUpdate(id, updateData, { new: true })
        if (!petfooddata) {
            return res.status(404).json({ error: 1, message: "Pet Food not found!" });
        }
        res.status(200).json({ success: true, message: "Pet Food updated successfully!", data: petfooddata, error: 0 });
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: 1, message: "Internal Server Error", details: err.message });
    }
}

exports.deletePetFood = async (req, res) => {
    try {
        const { id } = req.params;

        const petFooddata = await PetFoodModal.findByIdAndUpdate(
            id,
            { deleted_at: new Date() },
            { new: true }
        );

        if (!petFooddata) {
            return res.status(404).json({ error: 1, message: "Pet Food not found" });
        }

        res.status(200).json({
            success: true,
            message: "Pet Food soft-deleted successfully!",
            data: petFooddata,
            error: 0
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 1, message: "Internal Server Error", details: err.message });
    }
};

