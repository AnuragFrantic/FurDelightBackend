const ShippingAddress = require("../models/ShippingAddress");

exports.addShippingAddress = async (req, res) => {
    try {
        const userId = req.userId;
        const { address, active } = req.body;

        // If this new address is marked as active, deactivate all others for this user
        if (active) {
            await ShippingAddress.updateMany(
                { user: userId },
                { $set: { active: false } }
            );
        }

        const newAddress = await ShippingAddress.create({
            address,
            user: userId,
            active: !!active // ensure it's boolean
        });

        return res.status(201).json({
            success: true,
            message: "Shipping address added successfully",
            data: newAddress,
            error: 0
        });
    } catch (error) {
        console.error("Error adding shipping address:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to add shipping address",
            error: 1,
            details: error.message
        });
    }
};




exports.setActiveShippingAddress = async (req, res) => {
    try {
        const userId = req.userId;
        const { addressId } = req.params;

        // Deactivate all other addresses
        await ShippingAddress.updateMany(
            { user: userId },
            { $set: { active: false } }
        );

        // Activate selected address
        const updatedAddress = await ShippingAddress.findByIdAndUpdate(
            addressId,
            { active: true },
            { new: true }
        );

        if (!updatedAddress) {
            return res.status(404).json({ success: false, message: "Address not found", error: 1 });
        }

        return res.status(200).json({
            success: true,
            message: "Address marked as active",
            data: updatedAddress,
            error: 0
        });
    } catch (error) {
        console.error("Error updating address:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to update address",
            error: 1,
            details: error.message
        });
    }
};


// Get all addresses for the user
exports.getUserShippingAddresses = async (req, res) => {
    try {
        const userId = req.userId;
        const addresses = await ShippingAddress.find({ user: userId });
        res.status(200).json({ success: true, data: addresses, error: 0 });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch addresses", error: 1 });
    }
};

// Get only the active address for the user
exports.getActiveShippingAddress = async (req, res) => {
    try {
        const userId = req.userId;
        const activeAddress = await ShippingAddress.findOne({ user: userId, active: true });
        res.status(200).json({ success: true, data: activeAddress, error: 0 });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch active address", error: 1 });
    }
};

