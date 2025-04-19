const CategoryModal = require('../models/Categories')


exports.CreateCategory = async (req, res) => {
    try {
        let data = new CategoryModal(req.body);

        if (req.file) {
            data.image = req.file.path;
        }


        await data.save(); // Don't forget to save it!

        res.status(201).json({
            success: true,
            message: "Category created successfully",
            data: data,
            error: 0
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            error: 1,
            message: "Failed to create Category",
            error: err.message,
        });
    }
}



exports.getAllCategory = async (req, res) => {
    try {
        const filter = { deleted_at: null };
        let data = await CategoryModal.find(filter)
        res.status(200).json({
            success: true,
            message: "Category fetch successfully",
            data: data,
            error: 0
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            error: 1,
            message: "Failed to Fetch Category",
            error: err.message,
        });
    }
}


exports.updateCategory = async (req, res) => {
    try {
        const { id } = await req.params
        let updateData = req.body
        if (req.file) {
            updateData.image = req.file.path;
        }
        const categorydata = await CategoryModal.findByIdAndUpdate(id, updateData, { new: true })
        if (!categorydata) {
            return res.status(404).json({ error: 1, message: "Category not found!" });
        }
        res.status(200).json({ success: true, message: "Category updated successfully!", data: categorydata, error: 0 });
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: 1, message: "Internal Server Error", details: err.message });
    }
}

exports.deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        const categorydata = await CategoryModal.findByIdAndUpdate(
            id,
            { deleted_at: new Date() },
            { new: true }
        );

        if (!categorydata) {
            return res.status(404).json({ error: 1, message: "Category not found" });
        }

        res.status(200).json({
            success: true,
            message: "Category soft-deleted successfully!",
            data: categorydata,
            error: 0
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 1, message: "Internal Server Error", details: err.message });
    }
};

