const jwt = require('jsonwebtoken');
require('dotenv').config();

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Extract the token from the Authorization header
  
    if (!token) {
      return res.status(401).json({ error: 'Access token is missing' });
    }
  
    // Verify the token using your chosen JWT library
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ error: 'Invalid token' });
      }
  
      // Attach the user object to the request for future use
      req.user = user;
  
      // Token is valid, proceed to the next middleware or route handler
      next();
    });

}

module.exports = authenticateToken