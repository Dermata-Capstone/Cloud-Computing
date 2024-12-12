// middlewares/verifyToken.js
const admin = require('../config/firebase');

const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split('Bearer ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Token is required' });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken; // Menyimpan informasi user di request
    next(); // Lanjutkan ke route berikutnya
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

module.exports = verifyToken;
