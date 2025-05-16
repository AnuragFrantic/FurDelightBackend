const Wishlist = require('../models/Wishlist');

// Add or remove an item (ProductVariant or User doctor) to the user's wishlist
exports.addToWishlist = async (req, res) => {
    try {
        const userId = req.userId;
        const { itemId, type } = req.body;

        // Validate incoming type
        if (!['product', 'doctor'].includes(type)) {
            return res.status(400).json({ success: false, message: 'Invalid type. Must be "product" or "doctor".' });
        }

        // Resolve item_type for refPath
        const item_type = type === 'product' ? 'ProductVariant' : 'User';

        // Find or create the wishlist document for this user
        let wishlist = await Wishlist.findOne({ user: userId });
        if (!wishlist) {
            wishlist = new Wishlist({ user: userId, items: [], type });
        }

        // Check if the item already exists in the wishlist
        const exists = wishlist.items.some(i =>
            i.item.toString() === itemId && i.item_type === item_type
        );

        if (exists) {
            // Remove it
            wishlist.items = wishlist.items.filter(i =>
                !(i.item.toString() === itemId && i.item_type === item_type)
            );
        } else {
            // Add it
            wishlist.items.push({ item: itemId, item_type });
        }

        // Recalculate wishlist "type" field (product, doctor, mixed)
        const typesSet = new Set(wishlist.items.map(i => i.item_type));
        if (typesSet.size === 2) {
            wishlist.type = 'mixed';
        } else if (typesSet.has('ProductVariant')) {
            wishlist.type = 'product';
        } else if (typesSet.has('User')) {
            wishlist.type = 'doctor';
        } else {
            wishlist.type = 'mixed';
        }

        wishlist.updated_by = userId;
        await wishlist.save();

        const message = exists ? 'Item removed from wishlist.' : 'Item added to wishlist.';
        return res.status(exists ? 200 : 201).json({ success: true, message, wishlist, error: 0 });
    } catch (error) {
        console.error('Error adding/removing wishlist item:', error);
        return res.status(500).json({ success: false, message: 'Server error', error: 1 });
    }
};

// Admin: Get all wishlists
exports.getAllWishlists = async (req, res) => {
    try {
        const wishlists = await Wishlist.find({ is_deleted: false })
            .populate('user')
            .populate('items.item');

        return res.status(200).json({ success: true, data: wishlists, error: 0 });
    } catch (err) {
        console.error('Error fetching all wishlists:', err);
        return res.status(500).json({ success: false, message: 'Error fetching wishlists', error: 1 });
    }
};

// User: Get own wishlist (all items)
// exports.getMyWishlist = async (req, res) => {
//     try {
//         const userId = req.userId;
//         const wishlist = await Wishlist.findOne({ user: userId, is_deleted: false })
//             .populate('items.item')

//         if (!wishlist) {
//             return res.status(404).json({ success: false, message: 'No wishlist found', error: 1 });
//         }

//         return res.status(200).json({ success: true, data: wishlist, error: 0 });
//     } catch (err) {
//         console.error('Error fetching user wishlist:', err);
//         return res.status(500).json({ success: false, message: 'Error fetching wishlist', error: 1 });
//     }
// };

exports.getMyWishlist = async (req, res) => {
    try {
        const userId = req.userId;

        const wishlist = await Wishlist.findOne({ user: userId, is_deleted: false })
            .populate('items.item');

        if (!wishlist) {
            return res.status(201).json({ success: false, message: 'No wishlist found', error: 1, data: [] });
        }



        // Deep copy and remove `wishlist` key from populated items
        const wishlistData = wishlist.toObject();
        wishlistData.items = wishlistData.items.map(entry => {
            if (entry.item && entry.item.wishlist !== undefined) {
                const { wishlist, ...cleanedItem } = entry.item;
                return {
                    ...entry,
                    item: cleanedItem
                };
            }
            return entry;
        });



        return res.status(200).json({ success: true, data: wishlistData, error: 0 });
    } catch (err) {
        console.error('Error fetching user wishlist:', err);
        return res.status(500).json({ success: false, message: 'Error fetching wishlist', error: 1 });
    }
};




// User: Get only doctor items from own wishlist
exports.getMyDoctorWishlist = async (req, res) => {
    try {
        const userId = req.userId;
        const wishlist = await Wishlist.findOne({ user: userId, is_deleted: false })
            .populate('items.item');

        if (!wishlist) {
            return res.status(404).json({ success: false, message: 'No wishlist found', error: 1 });
        }

        const doctorItems = wishlist.items.filter(i => i.item_type === 'User');
        return res.status(200).json({ success: true, data: doctorItems, error: 0 });
    } catch (err) {
        console.error('Error fetching doctor wishlist:', err);
        return res.status(500).json({ success: false, message: 'Error fetching doctor wishlist', error: 1 });
    }
};

// Soft-delete entire wishlist for a user
exports.deleteWishlist = async (req, res) => {
    try {
        const userId = req.userId;
        const wishlist = await Wishlist.findOneAndUpdate(
            { user: userId, is_deleted: false },
            { is_deleted: true, deleted_at: new Date() },
            { new: true }
        );

        if (!wishlist) {
            return res.status(404).json({ success: false, message: 'No wishlist found', error: 1 });
        }

        return res.status(200).json({ success: true, message: 'Wishlist deleted successfully', wishlist, error: 0 });
    } catch (err) {
        console.error('Error deleting wishlist:', err);
        return res.status(500).json({ success: false, message: 'Error deleting wishlist', error: 1 });
    }
};