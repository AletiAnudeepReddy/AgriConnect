const Laborer = require('../models/Labor');
const bcrypt = require('bcrypt');

// Register Laborer
exports.registerLaborer = async (req, res) => {
    try {
        const { fullname, phone, password, skills, experience, location } = req.body;

        const existingLaborer = await Laborer.findOne({ phone });
        if (existingLaborer) return res.status(400).json({ message: 'Phone number already registered' });

        const hashedPassword = await bcrypt.hash(password, 10);

        const newLaborer = new Laborer({
            fullname,
            phone,
            password: hashedPassword,
            skills,
            experience,
            location
        });

        await newLaborer.save();
        res.status(201).json({ message: 'Laborer registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};

// Login Laborer (No token generation)
exports.loginLaborer = async (req, res) => {
    try {
        const { phone, password } = req.body;

        const laborer = await Laborer.findOne({ phone });
        if (!laborer) return res.status(400).json({ message: 'Invalid phone number or password' });

        const isMatch = await bcrypt.compare(password, laborer.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid phone number or password' });

        res.status(200).json({ message: 'Login successful',
            fullname: laborer.fullname,
            skills: laborer.skills,
            experience: laborer.experience,
            location: laborer.location });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};
