const jwt = require('jsonwebtoken');
require('dotenv').config();

const validateToken = (req, res, next) => {
  const { authorization } = req.headers;
  try {
    if (!authorization) return res.status(401).json({ message: 'Token not found' });
    const validate = jwt.verify(authorization, process.env.JWT_SECRET);
    if (!validate) return res.status(401).json({ message: 'Expired or invalid token' });
    req.body.userId = validate.userid;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Expired or invalid token' });
  }
};

module.exports = validateToken;