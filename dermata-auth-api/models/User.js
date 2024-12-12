const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],  // Pastikan username adalah field yang diperlukan
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
  },
  firebaseUid: {
    type: String,
    required: [true, 'firebaseUid is required'],
  },
});
// Gunakan `mongoose.models.User` untuk mencegah error "OverwriteModelError"
const User = mongoose.models.User || mongoose.model('User', userSchema);

module.exports = User;