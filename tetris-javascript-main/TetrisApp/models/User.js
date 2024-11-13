const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Definir el esquema para el usuario
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

// Middleware para cifrar la contraseña antes de guardarla
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next(); // Si la contraseña no ha sido modificada, se salta el cifrado
  try {
    const salt = await bcrypt.genSalt(10);  // Generar el salt para cifrado
    this.password = await bcrypt.hash(this.password, salt);  // Cifrar la contraseña
    next();  // Continuar con el proceso de guardar el usuario
  } catch (error) {
    next(error);  // En caso de error, pasamos el error al siguiente middleware
  }
});


// Exportar el modelo de usuario
module.exports = mongoose.model('User', userSchema);
