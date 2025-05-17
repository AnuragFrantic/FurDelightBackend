const Orders = require('../models/Orders');
const Cart = require('../models/Cart');
const Razorpay = require('razorpay');
const crypto = require('crypto');
require('dotenv').config();

const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create a new order (with Razorpay or COD)
exports.createOrder = async (req, res) => {
    try {
        const userId = req.userId;
        const {
            shipping_address,
            shipping_charge = 0,
            payment_type,
            promo_discount = 0,
        } = req.body;

        if (!payment_type) {
            return res
                .status(400)
                .json({ error: 1, message: 'Payment type is required' });
        }

        // Fetch cart items
        const cartItems = await Cart.find({ user: userId }).populate('variant_id');
        if (!cartItems.length) {
            return res
                .status(400)
                .json({ error: 1, message: 'Cart is empty' });
        }

        // Calculate total_amount
        let total_amount = 0;
        cartItems.forEach((item) => {
            total_amount += item.quantity * (item.variant_id.price || 0);
        });
        const net_payable_amount = total_amount - promo_discount + shipping_charge;

        // Prepare payment_request and order_status
        let payment_request = null;
        let order_status = '';
        let payment_status = 'Pending';

        if (payment_type === 'Online') {
            // Razorpay expects amount in paise
            const razorpayOrder = await razorpayInstance.orders.create({
                amount: net_payable_amount,
                currency: 'INR',
                receipt: `receipt_order_${Date.now()}`,
            });
            payment_request = razorpayOrder;
            order_status = 'PendingPayment';
        } else {
            // COD
            order_status = 'Created';
            payment_status = 'Pending'; // payment on delivery
        }

        // Create order document
        const newOrder = new Orders({
            user: userId,
            total_amount,
            net_payable_amount,
            promo_discount,
            shipping_address,
            shipping_charge,
            payment_type,
            payment_request,
            payment_status,
            order_status,
            order_placed: false,
        });
        await newOrder.save();

        // Clear the cart
        // await Cart.deleteMany({ user: userId });

        return res.status(201).json({
            error: 0,
            message: 'Order created successfully',
            data: newOrder,
        });
    } catch (err) {
        console.error(err);
        return res
            .status(500)
            .json({ error: 1, message: 'Server error', details: err.message });
    }
};

// Razorpay payment verification
exports.completeOnlinePayment = async (req, res) => {
    try {
        const { order_id, razorpay_payment_id, razorpay_signature } = req.body;

        const order = await Orders.findOne({ 'payment_request.id': order_id });

        if (!order) {
            return res.status(404).json({ error: 1, message: "Order not found" });
        }

        order.payment_status = "Completed";
        order.order_status = "Confirmed";
        order.order_placed = true;
        order.payment_response = {
            razorpay_payment_id,
            razorpay_signature
        };

        await order.save();

        res.status(200).json({ error: 0, message: "Payment successful", data: order });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 1, message: "Payment verification failed", details: err.message });
    }
};

// Confirm COD payment (mark as paid when cash collected)
exports.confirmCODPayment = async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await Orders.findById(orderId);

        if (!order) {
            return res.status(404).json({ error: 1, message: 'Order not found' });
        }
        if (order.payment_type !== 'COD') {
            return res.status(400).json({ error: 1, message: 'Not a COD order' });
        }

        order.payment_status = 'Completed';
        order.order_status = 'Confirmed';
        order.order_placed = true;
        await order.save();

        return res
            .status(200)
            .json({ error: 0, message: 'COD payment confirmed', data: order });
    } catch (err) {
        console.error(err);
        return res
            .status(500)
            .json({ error: 1, message: 'Failed to confirm COD payment', details: err.message });
    }
};

// Get orders for logged-in user
exports.getUserOrders = async (req, res) => {
    try {
        const userId = req.userId;
        const orders = await Orders.find({ user: userId, deleted_at: null })
            .sort({ createdAt: -1 })
            .populate('shipping_address');
        return res.status(200).json({ error: 0, message: 'Orders fetched', data: orders });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 1, message: 'Server error', details: err.message });
    }
};

// Soft delete order
exports.deleteOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        await Orders.findByIdAndUpdate(orderId, { deleted_at: new Date() });
        return res.status(200).json({ error: 0, message: 'Order deleted' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 1, message: 'Server error', details: err.message });
    }
};

// Admin: Update payment or order status
exports.updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { payment_status, order_status, order_placed } = req.body;

        const updated = await Orders.findByIdAndUpdate(
            orderId,
            {
                ...(payment_status && { payment_status }),
                ...(order_status && { order_status }),
                ...(order_placed !== undefined && { order_placed }),
            },
            { new: true }
        );
        return res
            .status(200)
            .json({ error: 0, message: 'Order status updated', data: updated });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 1, message: 'Server error', details: err.message });
    }
};
