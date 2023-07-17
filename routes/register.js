const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.post('/', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Verifique se o usuário já está registrado com o mesmo email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send('Email already registered');
    }

    // Crie um novo usuário usando o modelo e salve-o no banco de dados
    const newUser = new User({ username, email, password });
    await newUser.save();

    // Redirecionar para a página de login após o registro bem-sucedido
    res.redirect('/signin');
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
