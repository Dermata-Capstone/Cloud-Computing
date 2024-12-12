// config/db.js
const mongoose = require('mongoose');
require('dotenv').config();  // Mengambil variabel dari file .env

// Ambil URL koneksi dari environment variable
const mongoURI = process.env.MONGO_URI;

// Fungsi untuk menghubungkan ke MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI); // Hapus opsi yang deprecated
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Keluar jika koneksi gagal
  }
};

module.exports = connectDB; // Mengekspor fungsi connectDB