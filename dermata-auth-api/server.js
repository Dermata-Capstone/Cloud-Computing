const express = require('express');
const bodyParser = require('express').json();
const apiRoutes = require('./routes/apiRoutes');
const dotenv = require('dotenv').config();
const admin = require('firebase-admin'); // Menggunakan Firebase Admin SDK
const connectDB = require('./config/db'); // Mengimpor fungsi connectDB
const User = require('./models/User'); // Model MongoDB untuk User
const homeRoutes = require('./routes/homeRoutes'); // Mengimpor routing halaman home
const profileRoutes = require('./routes/profileRoutes');

const app = express();

// Menggunakan middleware untuk parsing JSON pada request body
app.use(express.json());
app.use(homeRoutes); // Menambahkan route
app.use('/home', homeRoutes);
app.use('/profile', apiRoutes);


// Middleware untuk parsing request body
app.use(express.json()); // Untuk request JSON
app.use(express.urlencoded({ extended: true })); // Untuk request URL-encoded

// Menghubungkan ke MongoDB
connectDB();

// Endpoint untuk registrasi user dengan Firebase
app.post('/SignUp', async (req, res) => {
  const { email, password } = req.body;  // Mengambil email dan password dari body request
  
  try {
    // Mencoba membuat pengguna baru di Firebase Authentication menggunakan email dan password
    const user = await admin.auth().createUser({
      email: email,   // Email pengguna
      password: password,  // Password pengguna
    });

    // Setelah berhasil mendaftar di Firebase, kita juga menyimpan informasi pengguna ke MongoDB
    const newUser = new User({
      name: req.body.username,  // Mengambil nama pengguna dari body request
      email: email,         // Email yang didaftarkan
      password: password,   // Password yang diberikan (disarankan untuk mengenkripsi sebelum disimpan)
    });

    // Menyimpan data pengguna ke MongoDB menggunakan Mongoose
    await newUser.save();  // Menyimpan data ke database MongoDB
    
    // Mengirimkan respons sukses kepada klien
    res.status(201).send({ message: 'User registered successfully', user: user.uid });

  } catch (error) {
    // Menangani kesalahan, jika ada masalah saat pendaftaran
    res.status(400).send({ message: error.message });
  }
});

// Endpoint untuk login user dengan Firebase
app.post('/SignUp', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Membuat user di Firebase
    const user = await admin.auth().createUser({
      email: email,
      password: password,
    });

    // Menyimpan user ke MongoDB, termasuk username
    const newUser = new User({
      username: username,  // Pastikan username ada di request body
      email: email,
      firebaseUid: user.uid,  // Firebase UID dari Firebase
    });

    await newUser.save(); // Menyimpan data ke MongoDB
    res.status(201).send({ message: 'User registered successfully', user: user.uid });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

// Endpoint untuk ganti password dengan Firebase
app.post('/change-password', async (req, res) => {
  const { idToken, newPassword } = req.body;

  try {
    if (typeof idToken !== 'string') {
      throw new Error('Invalid ID token');
    }

    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;

    await admin.auth().updateUser(uid, { password: newPassword });
    res.status(200).send({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(400).send({ message: 'Error updating password', error: error.message });
  }
});

// Endpoint untuk menambahkan user baru ke MongoDB
app.post('/users', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const newUser = new User({
      username,
      email,
      password,  // Jangan lupa untuk mengenkripsi password sebelum menyimpannya ke MongoDB!
    });

    await newUser.save(); // Menyimpan data ke MongoDB
    res.status(201).send({ message: 'User created successfully', user: newUser });
  } catch (error) {
    res.status(400).send({ message: 'Error creating user', error: error.message });
  }
});

// server.js
app.use((req, res, next) => {
  console.log(`Menerima permintaan: ${req.method} ${req.url}`);
  next();
});

// Menjalankan server pada port yang ditentukan
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});