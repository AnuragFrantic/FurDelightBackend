const jwt = require("jsonwebtoken");
const Otp = require("../../models/Otp");
const User = require("../../models/Register");
const { default: mongoose } = require("mongoose");

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
        const normalizedPhone = phone.toString().trim();

        const existingUser = await User.findOne({ phone: normalizedPhone, deleted_at: null });
        const isOld = !!existingUser;



        if (existingUser && existingUser.verification === false) {
            return res.status(403).json({
                error: 1,
                message: "Admin will verify your account. Please wait before logging into the doctor app."
            });
        }

        // Generate and save OTP
        const otpCode = Math.floor(1000 + Math.random() * 9000);

        await Otp.deleteOne({ phone: normalizedPhone });

        const newOtp = new Otp({
            phone: normalizedPhone,
            otp: otpCode,
            expiresAt: new Date(Date.now() + 30 * 1000) // 30 seconds
        });

        await newOtp.save();







        res.status(200).json({
            success: true,
            message: "OTP sent successfully!",

            phone: normalizedPhone,
            otp: otpCode,
            isOld,

            error: 0
        });
    } catch (error) {
        console.error("sendOtp Error:", error);
        res.status(500).json({
            error: 1,
            message: "Internal Server Error",
            details: error.message
        });
    }
};


exports.verifyOtp = async (req, res) => {
    try {
        let { phone, otp, user_type } = req.body;

        // Normalize phone and OTP
        phone = phone?.toString().trim();
        otp = otp?.toString().trim();



        const username = phone;

        if (!phone || !otp) {
            return res.status(400).json({ error: 1, message: "Phone and OTP are required!" });
        }



        // 🔍 Validate OTP
        const existingOtp = await Otp.findOne({ phone });

        if (!existingOtp) {
            return res.status(200).json({ error: 1, message: "OTP expired or not found!" });
        }

        if (Date.now() > existingOtp.expiresAt) {
            await Otp.deleteOne({ phone });
            return res.status(200).json({ error: 1, message: "OTP expired!" });
        }

        if (existingOtp.otp !== otp) {
            return res.status(200).json({ error: 1, message: "Invalid OTP!" });
        }

        // ✅ OTP valid, delete it
        await Otp.deleteOne({ phone });

        // 🔍 Find or create user
        let user = await User.findOne({ phone, deleted_at: null }).populate("user_type");
        let isOld = true;





        if (!user) {

            try {
                // in this if user is new then he is creating here with user_type 
                user = await User.create({ phone, user_type, username });
                isOld = false;
            } catch (saveError) {
                console.error("Error while creating user:", saveError);
                return res.status(500).json({
                    error: 1,
                    message: "Failed to create user",
                    details: saveError.message,
                });
            }
        }

        // 🔐 Generate JWT token
        const token = jwt.sign(
            {
                _id: user._id,
                phone: user.phone,
                user_type: user?.user_type,
            },
            process.env.JWT_SECRET
        );

        return res.status(200).json({
            success: true,
            message: "OTP verified successfully!",
            token,
            user,
            isOld,
            error: 0,
        });

    } catch (error) {
        console.error("Verify OTP Error:", error);
        return res.status(500).json({
            error: 1,
            message: "Internal Server Error",
            details: error.message,
        });
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
