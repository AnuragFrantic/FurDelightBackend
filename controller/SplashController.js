const SplashScreen = require("../modal/SplashScreen");

// Create a new splash screen with optional image upload
exports.createSplashScreen = async (req, res) => {
    try {
        const { title, description, position } = req.body;
        let image = req.file ? req.file.path : null; // Check if file exists

        const splash = new SplashScreen({ title, description, image });
        await splash.save();

        res.status(201).json({ success: true, message: "Splash screen created successfully!", data: splash, error: 0 });
    } catch (error) {
        res.status(500).json({ error: 1, message: "Internal Server Error", details: error.message });
    }
};


exports.getAllSplash = async (req, res) => {
    try {
        let sortOrder = 1;


        if (req.query.sort === "desc") {
            sortOrder = -1;
        }


        const data = await SplashScreen.find().sort({ position: sortOrder });

        res.status(200).json({ success: true, data, error: 0 });
    } catch (error) {
        res.status(500).json({ error: 1, message: "Internal Server Error", details: error.message });
    }
};


// Update splash screen with image handling
exports.updateSplashScreen = async (req, res) => {
    try {
        const { title, description, position } = req.body;
        let updateData = { title, description, position };


        if (req.file) {
            updateData.image = req.file.path;
        }

        const updatedSplash = await SplashScreen.findByIdAndUpdate(req.params.id, updateData, { new: true });

        if (!updatedSplash) {
            return res.status(404).json({ error: 1, message: "Splash screen not found!" });
        }

        res.status(200).json({ success: true, message: "Splash screen updated successfully!", data: updatedSplash, error: 0 });
    } catch (error) {
        res.status(500).json({ error: 1, message: "Internal Server Error", details: error.message });
    }
};


exports.deleteSplash = async (req, res) => {
    try {
        const { id } = req.params
        const spalshdata = await SplashScreen.findByIdAndDelete(id)
        if (!spalshdata) {
            return res.status(404).json({ error: 1, message: "Splash not found" })
        }
        res.status(200).json({ success: true, message: "Splash deleted successfully!", data: spalshdata, error: 0 });
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: 1, message: "Internal Server Error", details: err.message });
    }

}