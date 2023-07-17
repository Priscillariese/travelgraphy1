const express = require('express');
const router = express.Router();
const User = require('../models/user');




// Importe o modelo de usuário
const User = require('../models/user');

// Rota para exibir a página de registro de usuários
router.get('/register', (req, res) => {
  res.render('register');
});

// Rota para lidar com o registro de usuários (POST)
router.post('/register', async (req, res) => {
  try {
    // Obtenha os dados do formulário de registro
    const { username, email, password } = req.body;

    // Crie um novo usuário usando o modelo User
    const user = new User({ username, email, password });

    // Salve o usuário no banco de dados
    await user.save();

    // Redirecione para outra página após o registro bem-sucedido
    res.redirect('/signin');
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).send('Error registering user');
  }
});

module.exports = router;
