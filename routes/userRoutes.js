const express = require('express');
const router = express.Router();
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

router.get('/home', (req, res) => {
  // Lógica para renderizar a página home aqui
  res.render('home'); // Substitua "home" pelo nome correto do arquivo da página home
});


router.get('/admin', async (req, res) => {
  try {
    // Lógica para obter o nome do usuário a partir do ID armazenado na sessão
    const userId = req.session.userId;
    const user = await User.findById(userId);
    const username = user.username;

    // Renderize a página de administração e passe o nome do usuário como variável
    res.render('admin', { username });
  } catch (error) {
    console.error('Error retrieving user:', error);
    res.status(500).send('Error retrieving user');
  }
});

    // Rota para exibir todos os usuários
    router.get('/users', async (req, res) => {
      try {
        const users = await User.find();
        res.render('users', { users });
      } catch (error) {
        console.error('Error retrieving users:', error);
        res.status(500).send('Error retrieving users');
      }
    });

    // Rota para criar um novo usuário
   router.post('/users', async (req, res) => {
      try {
        const { username, email, password } = req.body;
        const user = new User({ username, email, password });
        await user.save();
        res.redirect('/users');
      } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).send('Error creating user');
      }
    });



module.exports = router;
