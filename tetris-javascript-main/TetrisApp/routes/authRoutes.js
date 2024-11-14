// routes/authroutes.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Ruta para registrar un nuevo usuario
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log('Received ∫:', req.body); // Verifica lo que llega

    if (!username || !password) {
      return res.status(400).send('Username and password are required');
    }

    // Verificar si ya existe un usuario con el mismo nombre de usuario
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).send('Username already taken');
    }

    // Crear un nuevo usuario
    const user = new User({
      username,
      password: password,
    });

    // Guardar el usuario en la base de datos
    await user.save();

    res.status(201).send('User registered successfully');
  } catch (error) {
    res.status(400).send('Error registering user: ' + error.message);
  }
});

// Ruta para iniciar sesión y obtener un token de autenticación
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    const isMatch = await bcrypt.compare(password, user.password);

    if (!user || ! isMatch) {
      return res.status(400).send('Invalid credentials');
    }
    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Ruta protegida de ejemplo
router.get('/protected', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).send('Access denied');

  try {
    const verified = jwt.verify(token, process.env.SECRET_KEY);
    req.user = verified;
    res.send('Protected route accessed');
  } catch (error) {
    res.status(400).send('Invalid token');
  }
});

module.exports = router;
