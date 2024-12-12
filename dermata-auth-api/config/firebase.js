// config/firebase.js

const dotenv = require('dotenv').config(); // Memuat variabel lingkungan dari .env
const admin = require('firebase-admin');
const { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } = require('firebase/auth');
const mongoose = require('mongoose');
const serviceAccount = require('./serviceAccountKey.json'); // Pastikan path ini benar
const jwt = require('jsonwebtoken');

// Periksa apakah Firebase sudah diinisialisasi
if (admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
} else {
  console.log("Firebase sudah diinisialisasi.");
}

// Verifikasi Token (Middleware)

// Middleware untuk memverifikasi token
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ message: 'Token tidak ditemukan' });

  try {
    const decoded = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET_KEY);  // Pastikan token dipisahkan dengan benar
    req.user = decoded.user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token tidak valid' });
  }
};

// Koneksi MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB Connected');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

// Schema untuk pengguna di MongoDB
const userSchema = new mongoose.Schema({
  // firebaseUid: { type: String, required: true, unique: true },  // UID dari Firebase Auth
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fotoProfil: { type: String },  // URL gambar profil pengguna
  skintype: { type: String },    // Tipe kulit pengguna
  // createdAt: { type: Date, default: Date.now },
});

// Sebelum menyimpan password, hash password dengan bcrypt
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

// Metode untuk memeriksa apakah password cocok
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Model pengguna MongoDB
const User = mongoose.model('User', userSchema);

// Fungsi untuk SignUp menggunakan Firebase Authentication dan menyimpan data di MongoDB
const SignUp = async (email, password, username, fotoProfil, skintype) => {
  try {
    // 1. Sign up dengan Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(getAuth(), email, password);

    // 2. Ambil UID dari Firebase Auth
    // const firebaseUid = userCredential.user.uid;

    // 3. Simpan data pengguna di MongoDB
    const user = new User({
      username,
      email,
      password,
    });

    await user.save();
    return user;  // Kembalikan data pengguna yang baru dibuat
  } catch (err) {
    throw new Error(err.message);
  }
};

// Fungsi untuk SignIn menggunakan Firebase Authentication
const SignIn = async (email, password) => {
  try {
    // Sign in dengan Firebase Authentication
    const userCredential = await signInWithEmailAndPassword(getAuth(), email, password);

    // Ambil data pengguna dari Firebase atau MongoDB
    const firebaseUid = userCredential.user.uid;

    // Cari data pengguna di MongoDB berdasarkan UID Firebase
    const user = await User.findOne({ firebaseUid });

    if (!user) {
      throw new Error('Pengguna tidak ditemukan di database MongoDB');
    }

    // Kembalikan user (atau token) untuk sesi lanjut
    return user; 
  } catch (err) {
    throw new Error(err.message);
  }
};

// Fungsi untuk SignOut dari Firebase Authentication
const SignOut = async () => {
  try {
    await signOut(getAuth());
  } catch (err) {
    throw new Error('Error saat logout: ' + err.message);
  }
};

// Ekspor Firebase Admin untuk digunakan di tempat lain jika perlu
module.exports = { SignUp, SignIn, SignOut, admin }; // Ekspor fungsi dan objek