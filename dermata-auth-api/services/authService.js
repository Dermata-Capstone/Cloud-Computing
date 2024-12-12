// services/authService.js
const admin = require('../config/db');

const register = async (email, password) => {
  try {
    const userRecord = await admin.auth().createUser({
      email: email,
      password: password,
    });
    return {
      message: 'User registered successfully',
      userId: userRecord.uid,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

const login = async (email, password) => {
  try {
    // Firebase Admin SDK tidak memiliki fungsi login, karena itu login biasa dilakukan melalui client-side
    // Anda harus memvalidasi token ID yang diberikan oleh Firebase Authentication (Client-side)
    return {
      message: 'Login is handled client-side. Please use Firebase Authentication SDK.',
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  register,
  login,
};
