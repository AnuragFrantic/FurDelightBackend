const Wishlist = require('../models/Wishlist');


exports.addToWishlist = async (req, res) => {
    try {
        const userId = req.userId;
        const { itemId, type } = req.body;

        // Validate incoming type
        if (!['product', 'doctor'].includes(type)) {
            return res.status(400).json({ message: 'Invalid type. Must be product or doctor.' });
        }

        // Resolve item_type from type
        const item_type = type === 'product' ? 'Product' : 'User';

        // Check if wishlist already exists for user
        let wishlist = await Wishlist.findOne({ user: userId });

        if (!wishlist) {
            // If not, create new wishlist
            wishlist = new Wishlist({
                user: userId,
                items: [{
                    item: itemId,
                    item_type
                }],
                type,

            });

            await wishlist.save();
            return res.status(201).json({ message: 'Wishlist created and item added.', wishlist });
        }

        // Check if item already exists
        const exists = wishlist.items.some(i =>
            i.item.toString() === itemId && i.item_type === item_type
        );

        if (exists) {
            // Remove the item from the wishlist
            wishlist.items = wishlist.items.filter(i =>
                !(i.item.toString() === itemId && i.item_type === item_type)
            );

            // Recalculate wishlist type after removal
            const remainingTypes = new Set(wishlist.items.map(i => i.item_type));
            if (remainingTypes.size === 2) {
                wishlist.type = 'mixed';
            } else if (remainingTypes.has('Product')) {
                wishlist.type = 'product';
            } else if (remainingTypes.has('User')) {
                wishlist.type = 'doctor';
            } else {
                wishlist.type = 'mixed';
            }

            wishlist.updated_by = userId;
            await wishlist.save();

            return res.status(200).json({ message: 'Item removed from wishlist.', wishlist });
        }


        // Add new item to existing wishlist
        wishlist.items.push({ item: itemId, item_type });

        // Update wishlist type intelligently
        const existingTypes = new Set(wishlist.items.map(i => i.item_type));
        existingTypes.add(item_type); // include new item

        if (existingTypes.size === 2) {
            wishlist.type = 'mixed';
        } else if (existingTypes.has('Product')) {
            wishlist.type = 'product';
        } else if (existingTypes.has('User')) {
            wishlist.type = 'doctor';
        }

        wishlist.updated_by = userId;
        await wishlist.save();

        return res.status(200).json({ message: 'Item added to wishlist.', wishlist });

    } catch (error) {
        console.error('Error adding to wishlist:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};




// 🟡 Get All Wishlists (admin-level)
exports.getAllWishlists = async (req, res) => {
    try {
        const wishlists = await Wishlist.find({ is_deleted: false })
            .populate('user')
            .populate('items.item');

        res.status(200).json(wishlists);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching wishlists', error: err.message });
    }
};

// 🔵 Get Own Wishlist (all items)
exports.getMyWishlist = async (req, res) => {
    try {
        const userId = req.userId;

        const wishlist = await Wishlist.findOne({ user: userId, is_deleted: false })
            .populate('items.item');

        if (!wishlist) {
            return res.status(404).json({ message: 'No wishlist found' });
        }

        res.status(200).json(wishlist);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching wishlist', error: err.message });
    }
};

// 🟣 Get Own Doctor Wishlist
exports.getMyDoctorWishlist = async (req, res) => {
    try {
        const userId = req.userId;

        const wishlist = await Wishlist.findOne({ user: userId, is_deleted: false });

        if (!wishlist) {
            return res.status(404).json({ message: 'No wishlist found' });
        }

        const doctorItems = wishlist.items.filter(i => i.item_type === 'User');
        res.status(200).json(doctorItems);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching doctor wishlist', error: err.message });
    }
};

// 🔴 Delete Wishlist (Soft Delete)
exports.deleteWishlist = async (req, res) => {
    try {
        const userId = req.userId;

        const wishlist = await Wishlist.findOneAndUpdate(
            { user: userId },
            { is_deleted: true, deleted_at: new Date() },
            { new: true }
        );

        if (!wishlist) {
            return res.status(404).json({ message: 'No wishlist found' });
        }

        res.status(200).json({ message: 'Wishlist deleted successfully', wishlist });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting wishlist', error: err.message });
    }
};
