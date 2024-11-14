require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes'); // Importa el archivo de rutas

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Asegúrate de que los formularios sean procesados
app.use(express.static(path.join(__dirname, 'views'))); // Si el archivo register.html está en 'public'

// Asegúrate de que la ruta '/register' sirva la página HTML de registro
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'register.html')); // Cambia 'public' si tu carpeta es diferente
});
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html')); // Cambia 'public' si tu carpeta es diferente
});

// make a get for this
app.get('create', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'create.html')); // Cambia 'public' si tu carpeta es diferente
} );

app.get('lobby/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'lobby.html')); // Cambia 'public' si tu carpeta es diferente
});



mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Could not connect to MongoDB', err));

// Usa el router para las rutas de autenticación
app.use('/auth', authRoutes);
app.use('/lobby', require('./routes/lobbyRoutes'));

// Puerto para escuchar
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
