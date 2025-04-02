const Farmer = require('../models/Farmer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Register Farmer
exports.registerFarmer = async (req, res) => {
    try {
        const { fullname, email, phone, password, farm_location, farm_size } = req.body;

        const existingFarmer = await Farmer.findOne({ email });
        if (existingFarmer) return res.status(400).json({ message: 'Email already registered' });

        const hashedPassword = await bcrypt.hash(password, 10);

        const newFarmer = new Farmer({
            fullname,
            email,
            phone,
            password: hashedPassword,
            farm_location,
            farm_size
        });

        await newFarmer.save();
        res.status(201).json({ message: 'Farmer registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};

// Login Farmer
exports.loginFarmer = async (req, res) => {
    try {
        const { email, password } = req.body;

        const farmer = await Farmer.findOne({ email });
        if (!farmer) return res.status(400).json({ message: 'Invalid email or password' });

        const isMatch = await bcrypt.compare(password, farmer.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

        const token = jwt.sign({ id: farmer._id, role: 'farmer' }, 'your_secret_key', { expiresIn: '1d' });

        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};
