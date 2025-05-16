const Cart = require('../models/Cart'); // Adjust path as needed
const ShippingAddress = require('../models/ShippingAddress');

// Add or update cart item
exports.addToCart = async (req, res) => {
    try {
        const userId = req.userId

        const { variant_id, quantity } = req.body;

        if (!userId || !variant_id || !quantity) {
            return res.status(400).json({ error: 'Missing required fields', error: 1 });
        }

        // Find if cart item exists for user and variant
        let cartItem = await Cart.findOne({ user: userId, variant_id });

        if (cartItem) {
            // Update quantity by adding new quantity
            cartItem.quantity += quantity;
            await cartItem.save();
            return res.status(200).json({ message: 'Cart updated', cartItem, error: 0 });
        } else {
            // Create new cart item
            cartItem = new Cart({ user: userId, variant_id, quantity });
            await cartItem.save();
            return res.status(201).json({ message: 'Added to cart', cartItem, error: 0 });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error', error: 1 });
    }
};

// Get cart items for a user
// exports.getCartItems = async (req, res) => {
//     try {
//         const userId = req.userId

//         const cartItems = await Cart.find({ user: userId })
//             .populate('variant_id') // populate variant details if needed
//             .exec();

//         res.status(200).json({ data: cartItems, error: 0, message: "Cart Fetch Successfully" });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ error: 'Server error', error: 1 });
//     }
// };

exports.getCartItems = async (req, res) => {
    try {
        const userId = req.userId;

        const cartItems = await Cart.find({ user: userId })
            .populate('variant_id') // Make sure variant_id has price
            .exec();

        let totalQuantity = 0;
        let totalPrice = 0;
        let totalMrp = 0;

        const shippingAddress = await ShippingAddress.findOne({
            user: userId,
            active: true
        });

        cartItems.forEach(item => {
            totalQuantity += item.quantity;
            if (item.variant_id && item.variant_id.price) {
                totalPrice += item.quantity * item.variant_id.price;
            }
            if (item.variant_id && item.variant_id.mrp) {
                totalMrp += item.quantity * item.variant_id.mrp;
            }
        });

        res.status(200).json({
            data: cartItems,
            payment_detail: {
                totalQuantity,
                totalPrice,
                totalMrp,
                shipping: 150,
                payable: totalPrice + 150,
                discount: 0
            },
            shipping_address: shippingAddress || null,
            error: 0,
            message: "Cart fetched successfully"
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: 1,
            message: 'Server error',
            details: err.message
        });
    }
};




// Remove item from cart
exports.removeCartItem = async (req, res) => {
    try {
        const { cartItemId } = req.params;

        await Cart.findByIdAndDelete(cartItemId);

        res.status(200).json({ message: 'Item removed from cart', error: 0 });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error', error: 1 });
    }
};

// Update quantity explicitly


exports.updateCartItemQuantity = async (req, res) => {
    try {
        const { cartItemId } = req.params;
        const { quantity } = req.body;

        const cartItem = await Cart.findById(cartItemId);
        if (!cartItem) {
            return res.status(404).json({ message: 'Cart item not found', error: 1 });
        }

        if (!quantity || quantity < 1) {
            await Cart.findByIdAndDelete(cartItemId);
            return res.status(200).json({ message: 'Item removed from cart due to zero quantity', error: 0 });
        }

        cartItem.quantity = quantity;
        await cartItem.save();

        res.status(200).json({ message: 'Quantity updated', cartItem, error: 0 });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error', error: 1 });
    }
};




