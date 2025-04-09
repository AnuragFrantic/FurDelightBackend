
const Brand = require('../models/Brands');

exports.createBrand = async (req, res) => {
    try {
        const brand = new Brand(req.body);
        if (req.file) {
            brand.image = req.file.path
        }
        await brand.save();
        res.status(201).json({
            success: true,
            message: "Brand created successfully",
            data: brand,
            error: 0
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            error: 1,
            message: "Failed to create brand",
            error: err.message,
        });
    }
};


exports.getallBrand = async (req, res) => {
    try {
        const brand = await Brand.find()
        res.status(201).json({
            success: true,
            message: "Brand fetch successfully",
            data: brand,
            error: 0
        });
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Internal server error.', error: err.message, error: 1 });
    }
}


exports.updateBrand = async (req, res) => {
    try {
        const { id } = await req.params
        let updateData = req.body

        if (req.file) {
            updateData.image = req.file.path;
        }
        const bannerdata = await Brand.findByIdAndUpdate(id, updateData, { new: true })
        if (!bannerdata) {
            return res.status(404).json({ error: 1, message: "Brand not found!" });
        }
        res.status(200).json({ success: true, message: "Brand updated successfully!", data: bannerdata, error: 0 });
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: 1, message: "Internal Server Error", details: err.message });
    }
}



exports.deleteBrand = async (req, res) => {
    try {
        const { id } = req.params
        const branddata = await Brand.findByIdAndDelete(id)
        if (!branddata) {
            return res.status(404).json({ error: 1, message: "Brand not found" })
        }
        res.status(200).json({ success: true, message: "Brand deleted successfully!", data: branddata, error: 0 });
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: 1, message: "Internal Server Error", details: err.message });
    }

}