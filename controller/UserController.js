const User = require("../models/Register");
const UserType = require("../models/Usertype")
const DefaultPermissions = require("../models/DefaultPermission")





const mongoose = require("mongoose");


const clearAllPettypes = async () => {
    try {
        const result = await User.deleteMany({
            username: { $nin: ["admin01", "doctor01"] }
        });
        console.log(`✅ Cleared ${result.deletedCount} pettypes successfully!`);
    } catch (err) {
        console.error("❌ Failed to clear pettypes:", err.message);
    }
};



// clearAllPettypes();


exports.createUser = async (req, res) => {
    try {
        const { email, user_type, phone } = req.body;


        const existingUser = await User.findOne({
            $or: [{ email }, { phone }]
        });

        if (existingUser) {
            let message = 'Username or Email already exists!';
            if (existingUser.email === email && existingUser.phone === phone) {
                message = 'Username and Email already exist!';
            } else if (existingUser.email === email) {
                message = 'Email already exists!';
            } else if (existingUser.phone === phone) {
                message = 'Phone already exists!';
            }

            return res.status(400).json({ error: 1, message });
        }


        const userData = { ...req.body };






        const userTypeData = await UserType.findById(user_type);
        if (!userTypeData) {
            return res.status(400).json({ error: 1, message: "Invalid user_type ID!" });
        }


        // After checking if userTypeData exists
        const defaultPermissions = await DefaultPermissions.findOne({ user_type });

        if (defaultPermissions && Array.isArray(defaultPermissions.roles)) {
            userData.roles = defaultPermissions.roles.map(role => ({
                type: role.type,
                value: role.value
            }));
        }



        // Set verification to false if user type name is "Doctor"
        if (userTypeData.title.toLowerCase() === "doctor") {
            userData.verification = false;
        }

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


        await newUser.save();

        res.status(201).json({ success: true, message: "User created successfully!", data: newUser, error: 0 });
    } catch (error) {
        res.status(500).json({ error: 1, message: "Internal Server Error", details: error.message, error: 1 });
    }
};




exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-roles');
        res.status(200).json({ success: true, data: users, error: 0 });
    } catch (error) {
        res.status(500).json({ error: 1, message: "Internal Server Error", details: error.message, });
    }
};

// profile
exports.getProfile = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId).select('-roles'); // Exclude 'roles' field

        if (!user) {
            return res.status(404).json({ error: 1, message: "User not found" });
        }

        res.status(200).json({
            success: true,
            data: user,
            error: 0
        });
    } catch (error) {
        res.status(500).json({
            error: 1,
            message: "Internal Server Error",
            details: error.message
        });
    }
};


exports.getUserById = async (req, res) => {
    try {
        const userId = req.params.id;


        if (!userId) {
            return res.status(400).json({
                success: false,
                error: 1,
                message: "User ID not provided in params or token."
            });
        }

        const user = await User.findById(userId).populate("user_type roles.type");

        if (!user) {
            return res.status(404).json({
                success: false,
                error: 1,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            data: user,
            error: 0
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: 1,
            message: "Internal Server Error",
            details: error.message
        });
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

        res.status(200).json({ success: true, message: "User updated successfully!", data: updatedUser, error: 0 });
    } catch (error) {
        res.status(500).json({ error: 1, message: "Internal Server Error", details: error.message });
    }
};


// exports.deleteUser = async (req, res) => {
//     try {
//         const deletedUser = await User.findByIdAndDelete(req.params.id);

//         if (!deletedUser) {
//             return res.status(404).json({ error: 1, message: "User not found" });
//         }

//         res.status(200).json({ success: true, message: "User deleted successfully!", error: 0 });
//     } catch (error) {
//         res.status(500).json({ error: 1, message: "Internal Server Error", details: error.message });
//     }
// };


exports.deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 1, message: "User not found" });
        }

        const timestamp = Date.now();

        const updatedFields = {
            deleted_at: new Date(),
            username: user.username ? `deleted_${timestamp}_${user.username}` : undefined,
            email: user.email ? `deleted_${timestamp}_${user.email}` : undefined
        };

        // Only set fields that exist to avoid setting undefined
        Object.keys(updatedFields).forEach(key => {
            if (updatedFields[key] === undefined) delete updatedFields[key];
        });

        const deletedUser = await User.findByIdAndUpdate(
            userId,
            updatedFields,
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: "User soft deleted. Username and email are now available.",
            error: 0
        });
    } catch (error) {
        res.status(500).json({ error: 1, message: "Internal Server Error", details: error.message });
    }
};


