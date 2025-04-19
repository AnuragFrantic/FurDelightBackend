
const BannerModal = require('../models/Banner')



exports.createBanner = async (req, res) => {
    try {
        const bannerdata = BannerModal(req.body)
        if (req.file) {
            bannerdata.image = req.file.path
        }
        await bannerdata.save();
        res.status(201).json({ message: 'Banner created successfully.', data: bannerdata, error: 0 });
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Internal server error.', error: err.message, error: 1 });
    }
}


exports.getallbanner = async (req, res) => {
    try {
        const bannerdata = await BannerModal.find()
        res.status(200).json({ message: 'Banner Fetch successfully.', data: bannerdata, error: 0 });
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Internal server error.', error: err.message, error: 1 });
    }
}

exports.updatebanner = async (req, res) => {
    try {
        const { id } = await req.params

        let updateData = req.body

        if (req.file) {
            updateData.image = req.file.path;
        }
        const bannerdata = await BannerModal.findByIdAndUpdate(id, updateData, { new: true })
        if (!bannerdata) {
            return res.status(404).json({ error: 1, message: "Banner not found!" });
        }
        res.status(200).json({ success: true, message: "Banner updated successfully!", data: bannerdata, error: 0 });
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: 1, message: "Internal Server Error", details: err.message });
    }
}


exports.deleteBanner = async (req, res) => {
    try {
        const { id } = req.params
        const bannerdata = await BannerModal.findByIdAndDelete(id)
        if (!bannerdata) {
            return res.status(404).json({ error: 1, message: "Banner not found" })
        }
        res.status(200).json({ success: true, message: "Banner deleted successfully!", data: bannerdata, error: 0 });
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: 1, message: "Internal Server Error", details: err.message });
    }

}

