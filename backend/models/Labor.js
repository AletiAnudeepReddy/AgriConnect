const mongoose = require('mongoose');

const laborerSchema = new mongoose.Schema({
    fullname: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    skills: { type: String, enum: ['plowing', 'harvesting', 'sowing', 'watering', 'fertilizing'], required: true },
    experience: { type: Number, default: 0 },
    location: { type: String },
    createdAt: { type: Date, default: Date.now }
});

const Laborer = mongoose.model('Laborer', laborerSchema);
module.exports = Laborer;
