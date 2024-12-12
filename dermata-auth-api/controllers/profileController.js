const multer = require('multer');
const path = require('path');
const User = require('../models/User');

// Konfigurasi Multer untuk upload foto profil
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}${path.extname(file.originalname)}`);
  },
});
const upload = multer({ storage });

// Fungsi untuk mengambil profil pengguna
const getProfile = async (req, res) => {
  const { userId } = req;
  try {
    const user = await User.findOne({ firebaseUid: userId });
    if (!user) {
      return res.status(404).json({ status: 'FAILED', message: 'User not found' });
    }
    res.status(200).json({
      status: 'SUCCESS',
      data: {
        username: user.username,
        email: user.email,
        fotoProfil: user.fotoProfil,
      },
    });
  } catch (err) {
    res.status(400).json({ status: 'FAILED', message: err.message });
  }
};

// Fungsi untuk memperbarui profil pengguna
const updateProfile = async (req, res) => {
  const { userId } = req;
  const { username } = req.body;

  try {
    const user = await User.findOne({ firebaseUid: userId });
    if (!user) {
      return res.status(404).json({ status: 'FAILED', message: 'User not found' });
    }

    // Perbarui username dan skintype
    user.username = username;

    // Tangani upload foto profil jika ada
    if (req.file) {
      user.fotoProfil = req.file.filename;
    }

    // Simpan perubahan
    await user.save();

    res.status(200).json({ status: 'SUCCESS', message: 'Profile updated' });
  } catch (err) {
    res.status(400).json({ status: 'FAILED', message: err.message });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  upload,
};