const jwt = require("jsonwebtoken");
const Otp = require("../../models/Otp");
const User = require("../../models/Register");

// Get all OTPs
exports.getAllOtp = async (req, res) => {
    try {
        const otpdata = await Otp.find();
        res.status(200).json({ success: true, data: otpdata, error: 0 });
    } catch (error) {
        res.status(500).json({ error: 1, message: "Internal Server Error", details: error.message });
    }
};

// Send OTP
exports.sendOtp = async (req, res) => {
    try {
        const { phone } = req.body;

        if (!phone) {
            return res.status(400).json({ error: 1, message: "Phone number is required!" });
        }

        const otpCode = Math.floor(1000 + Math.random() * 9000);
        await Otp.deleteOne({ phone });

        const newOtp = new Otp({
            phone,
            otp: otpCode,
            expiresAt: new Date(Date.now() + 30 * 1000) // 30 seconds
        });

        await newOtp.save();

        res.status(200).json({
            success: true,
            message: "OTP sent successfully!",
            phone,
            otp: otpCode, // ❗️For testing; remove in production!
            error: 0
        });
    } catch (error) {
        res.status(500).json({ error: 1, message: "Internal Server Error", details: error.message });
    }
};


exports.verifyOtp = async (req, res) => {
    try {
        const { phone, otp } = req.body;

        if (!phone || !otp) {
            return res.status(400).json({ error: 1, message: "Phone and OTP are required!" });
        }

        const existingOtp = await Otp.findOne({ phone });

        if (!existingOtp) {
            return res.status(400).json({ error: 1, message: "OTP expired or not found!" });
        }

        if (Date.now() > existingOtp.expiresAt) {
            await Otp.deleteOne({ phone });
            return res.status(400).json({ error: 1, message: "OTP expired!" });
        }

        if (existingOtp.otp !== otp) {
            return res.status(400).json({ error: 1, message: "Invalid OTP!" });
        }

        await Otp.deleteOne({ phone });

        // ✅ Find or create the user
        let user = await User.findOne({ phone }).populate("user_type");
        if (!user) {
            user = (await User.create({ phone }));
        }

        // ✅ Generate JWT with _id
        const token = jwt.sign(
            { _id: user._id, phone: user.phone },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(200).json({
            success: true,
            message: "OTP verified successfully!",
            token,
            user,
            error: 0
        });

    } catch (error) {
        res.status(500).json({ error: 1, message: "Internal Server Error", details: error.message });
    }
};




exports.loginWithEmailPassword = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 1, message: "Email and password are required!" });
        }

        const user = await User.findOne({ email }).populate("user_type");

        if (!user) {
            return res.status(401).json({ error: 1, message: "Invalid email or password!" });
        }

        if (user.password !== password) {
            return res.status(401).json({ error: 1, message: "Invalid email or password!" });
        }

        const token = jwt.sign(
            { _id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.status(200).json({
            success: true,
            message: "Login successful!",
            token,
            user,
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
