const bcrypt = require('bcryptjs');
const { signUp } = require('../config/firebase'); // Impor fungsi Firebase untuk signup
const User = require('../models/User');  // Impor model pengguna Anda

// Fungsi untuk menangani pendaftaran pengguna
const registerUser = async (req, res) => {
  const { username, email, password,} = req.body;

  try {
    // Enkripsi password menggunakan bcryptjs
    const salt = await bcrypt.genSalt(10); // Membuat salt dengan tingkat kesulitan 10
    const hashedPassword = await bcrypt.hash(password, salt); // Enkripsi password

    // Buat pengguna baru
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      dateOfBirth
    });

    // Simpan pengguna baru ke MongoDB
    await newUser.save();

    res.status(201).json({
      status: 'SUCCESS',
      message: 'User registered successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'FAILED',
      message: 'An error occurred while registering the user'
    });
  }
};

module.exports = { registerUser };
