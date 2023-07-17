const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


const userSchema = new mongoose.Schema({
  username: {
     type: String, 
     required: true 
    },

  email: { 
    type: String, 
    required: true
   },
  password: { 
    type: String, 
    required: true
   },
});

// Antes de salvar o usuário no banco de dados, faça o hash da senha usando o bcrypt
userSchema.pre('save', async function (next) {
  const user = this;
  if (!user.isModified('password')) return next();

  const hashedPassword = await bcrypt.hash(user.password, 10);
  user.password = hashedPassword;
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;