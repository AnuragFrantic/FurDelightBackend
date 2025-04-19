const ShopModal = require("../models/shop_by_category")



exports.createShop = async (req, res) => {
    try {
        const data = new ShopModal(req.body)
        if (req.file) {
            data.image = req.file.path
        }
        await data.save()

        res.status(201).json({
            success: true,
            message: "Shop by Category created successfully!",
            data: data,
            error: 0
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            error: 1,
            message: "Failed to create Shop by Category",
            error: err.message,
        });
    }
}

exports.getAllShopCategory = async (req, res) => {
    try {
        const filter = { deleted_at: null }
        const data = await ShopModal.find(filter)
        res.status(200).json({
            success: true,
            message: "Shop by Category fetch successfully!",
            data: data,
            error: 0
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            error: 1,
            message: "Failed to create Shop by Category",
            error: err.message,
        });
    }
}


exports.updateShopCategory = async (req, res) => {
    try {
        const { id } = await req.params
        let updateData = req.body
        if (req.file) {
            updateData.image = req.file.path;
        }
        const categorydata = await ShopModal.findByIdAndUpdate(id, updateData, { new: true })
        if (!categorydata) {
            return res.status(404).json({ error: 1, message: "Category not found!" });
        }
        res.status(200).json({ success: true, message: "Category updated successfully!", data: categorydata, error: 0 });
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: 1, message: "Internal Server Error", details: err.message });
    }
}

exports.deleteShopCategory = async (req, res) => {
    try {
        const { id } = req.params;

        const categorydata = await ShopModal.findByIdAndUpdate(
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