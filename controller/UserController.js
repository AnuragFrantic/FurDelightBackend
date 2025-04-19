const User = require("../models/Register");


exports.createUser = async (req, res) => {
    try {
        const { username } = req.body;


        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: 1, message: "Username already exists!" });
        }


        const userData = { ...req.body };

        if (req.files) {
            if (req.files.image) {
                userData.image = req.files.image[0].path;
            }
            if (req.files.graduation_certificate) {
                userData.graduation_certificate = req.files.graduation_certificate[0].path;
            }
            if (req.files.post_graduation_certificate) {
                userData.post_graduation_certificate = req.files.post_graduation_certificate[0].path;
            }
            if (req.files.mci_certificate) {
                userData.mci_certificate = req.files.mci_certificate[0].path;
            }
        }


        const newUser = new User(userData);

        console.log(newUser)
        await newUser.save();

        res.status(201).json({ success: true, message: "User created successfully!", data: newUser, error: 0 });
    } catch (error) {
        res.status(500).json({ error: 1, message: "Internal Server Error", details: error.message, error: 1 });
    }
};


exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json({ success: true, data: users, error: 0 });
    } catch (error) {
        res.status(500).json({ error: 1, message: "Internal Server Error", details: error.message, });
    }
};


exports.getUserById = async (req, res) => {
    try {
        const userid = req.userId
        const user = await User.findById(userid);
        if (!user) {
            return res.status(404).json({ error: 1, message: "User not found" });
        }
        res.status(200).json({ success: true, data: user, error: 0 });
    } catch (error) {
        res.status(500).json({ error: 1, message: "Internal Server Error", details: error.message });
    }
};


exports.updateUser = async (req, res) => {
    try {
        const { username } = req.body;


        if (username) {
            const existingUser = await User.findOne({ username, _id: { $ne: req.params.id } });
            if (existingUser) {
                return res.status(400).json({ error: 1, message: "Username already exists!" });
            }
        }


        const updateData = { ...req.body };

        if (req.files) {
            if (req.files.image) {
                updateData.image = req.files.image[0].path;
            }
            if (req.files.graduation_certificate) {
                updateData.graduation_certificate = req.files.graduation_certificate[0].path;
            }
            if (req.files.post_graduation_certificate) {
                updateData.post_graduation_certificate = req.files.post_graduation_certificate[0].path;
            }
            if (req.files.mci_certificate) {
                updateData.mci_certificate = req.files.mci_certificate[0].path;
            }
        }

        const updatedUser = await User.findByIdAndUpdate(req.params.id, updateData, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ error: 1, message: "User not found" });
        }

        res.status(200).json({ success: true, message: "User updated successfully!", data: updatedUser, erro: 0 });
    } catch (error) {
        res.status(500).json({ error: 1, message: "Internal Server Error", details: error.message });
    }
};


exports.deleteUser = async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);

        if (!deletedUser) {
            return res.status(404).json({ error: 1, message: "User not found" });
        }

        res.status(200).json({ success: true, message: "User deleted successfully!", error: 0 });
    } catch (error) {
        res.status(500).json({ error: 1, message: "Internal Server Error", details: error.message });
    }
};
