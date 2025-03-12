const Otp = require("../../modal/Otp");



exports.getAllOtp = async (req, res) => {
    try {
        const otpdata = await Otp.find();
        res.status(200).json({ success: true, data: otpdata, error: 0 });
    } catch (error) {
        res.status(500).json({ error: 1, message: "Internal Server Error", details: error.message, });
    }
};

exports.sendOtp = async (req, res) => {
    try {
        const { phone } = req.body;

        if (!phone) {
            return res.status(400).json({ error: 1, message: "Phone number is required!" });
        }

        // Generate OTP
        const otpCode = Math.floor(1000 + Math.random() * 9000);

        // Delete any existing OTP for this phone
        await Otp.deleteOne({ phone });

        // Create new OTP with expiration time
        const newOtp = new Otp({
            phone,
            otp: otpCode,
            expiresAt: new Date(Date.now() + 30 * 1000) // Set expiry to 30 seconds
        });

        await newOtp.save();



        res.status(200).json({ success: true, message: "OTP sent successfully!", phone, otp: otpCode, error: 0 });
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

        // Find OTP record
        const existingOtp = await Otp.findOne({ phone });

        if (!existingOtp) {
            return res.status(400).json({ error: 1, message: "OTP expired or not found!" });
        }

        // Check if OTP is expired
        if (Date.now() > existingOtp.expiresAt) {
            await Otp.deleteOne({ phone }); // Remove expired OTP
            return res.status(400).json({ error: 1, message: "OTP expired!" });
        }

        // Verify OTP
        if (existingOtp.otp !== otp) {
            return res.status(400).json({ error: 1, message: "Invalid OTP!" });
        }

        // Remove OTP after successful verification
        await Otp.deleteOne({ phone });

        res.status(200).json({ success: true, message: "OTP verified successfully!", error: 0 });
    } catch (error) {
        res.status(500).json({ error: 1, message: "Internal Server Error", details: error.message });
    }
};

