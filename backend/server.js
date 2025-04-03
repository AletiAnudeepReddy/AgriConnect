require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');


const farmerAuthRoutes = require('./routes/farmerauthroutes');  // Farmer Auth Routes
const laborerAuthRoutes = require('./routes/laborerauthroute'); // Laborer Auth Routes
//const farmerRoutes = require('./routes/farmerRoutes');  // Farmer Operations
//const laborerRoutes = require('./routes/laborerRoutes'); // Laborer Operations
const protectedRoutes = require('./routes/protectedroute'); // Auth-Protected Routes

// Initialize Express App
const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Ensure request bodies are parsed correctly

// Database Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB connected successfully"))
.catch(err => console.error("❌ MongoDB connection error:", err));

// Routes
app.use('/api/auth/farmers', farmerAuthRoutes); // Authentication for Farmers
app.use('/api/auth/laborers', laborerAuthRoutes); // Authentication for Laborers
//app.use('/api/farmers', farmerRoutes); // Farmer-Specific Routes
//app.use('/api/laborers', laborerRoutes); // Laborer-Specific Routes
app.use('/protected', protectedRoutes); // Protected Routes (Requires Auth)

// Default Route
app.get('/', (req, res) => {
    res.send("🌾 Welcome to AgriConnect API!");
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
