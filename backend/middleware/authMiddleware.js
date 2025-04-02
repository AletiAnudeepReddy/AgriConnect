const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');


dotenv.config(); // Load environment variables

const authenticateUser = (req, res, next) => {
    const token = req.header('Authorization'); // Token from request headers

    if (!token) {
        return res.status(401).json({ message: 'Access Denied. No Token Provided.' });
    }

    try {
        const verified = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
        req.user = verified; // Attach user details to request object
        next(); // Proceed to next middleware or route handler
    } catch (error) {
        res.status(403).json({ message: 'Invalid or Expired Token' });
    }
};

module.exports = authenticateUser;
