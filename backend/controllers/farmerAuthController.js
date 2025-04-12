const Farmer = require('../models/Farmer');
const bcrypt = require('bcrypt');

// Register Farmer
exports.registerFarmer = async (req, res) => {
    try {
        const { fullname, email, phone, password, farm_location, farm_size } = req.body;

        console.log("📝 Incoming Register Request:", req.body);

        if (!fullname || !email || !phone || !password || !farm_location || !farm_size) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const existingEmail = await Farmer.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newFarmer = new Farmer({
            fullname,
            email,
            phone,
            password: hashedPassword,
            farm_location,
            farm_size: Number(farm_size)
        });

        console.log("📦 Saving Farmer:", newFarmer);

        await newFarmer.save();

        console.log("✅ Farmer Saved Successfully");

        res.status(201).json({ message: 'Farmer registered successfully' });

    } catch (error) {
        console.error("🔥 Registration Error:", error);

        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: 'Validation Error', error: error.message });
        }

        if (error.code === 11000) {
            const duplicateKey = Object.keys(error.keyPattern)[0];
            return res.status(400).json({ message: `Duplicate ${duplicateKey} already exists.` });
        }

        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// Login Farmer
exports.loginFarmer = async (req, res) => {
    try {
        const { email, password } = req.body;

        console.log("🔐 Incoming Login Request:", req.body);

        const farmer = await Farmer.findOne({ email });
        if (!farmer) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, farmer.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        res.status(200).json({ 
            message: 'Login successful', 
            fullname: farmer.fullname, 
            _id: farmer._id 
        });
    } catch (error) {
        console.error("🔥 Login Error:", error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
