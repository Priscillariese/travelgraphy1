const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');



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


    // Rota da página de registro
 

    router.get('/register', (req, res) => {
  res.render('register');
});

    // Rota para lidar com o registro de usuários (POST)
    router.post('/register', async (req, res) => {
      try {
        // Obtenha os dados do formulário de registro
        const { username, email, password } = req.body;
        const salt = bcrypt.genSaltSync(12)
        const bcryptpassword = bcrypt.hashSync(password, salt)



        // Crie um novo usuário usando o modelo User
        const user = new User({ username, email, password:bcryptpassword });

        // Salve o usuário no banco de dados
        await user.save();

        // Redirecione para outra página após o registro bem-sucedido
        res.redirect('/signin');
      } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).send('Error registering user');
      }
    });

    // Rota da página de login
    router.get('/signin', (req, res) => {
      res.render('signin');
    });

    
    // Rota de autenticação (página de login)
    router.post('/signin', async (req, res) => {
      const { email, password } = req.body;

      try {
        // Verifique a autenticidade do usuário consultando o banco de dados
        const user = await User.findOne({ email });

        if (user) {
          // Verifique se a senha fornecida corresponde à senha armazenada no banco de dados
          const isPasswordValid = await bcrypt.compareSync(password, user.password);

          if (isPasswordValid) {
            // Autenticação bem-sucedida
            req.session.userId = user._id; // Armazene o ID do usuário na sessão
            res.redirect('/admin'); // Redirecione para a página de administração
          } else {
            // Senha incorreta
            res.render('signin', { errorMsg: 'Email or password is incorrect' });
          }
        } else {
          // Usuário não encontrado
          res.render('signin', { errorMsg: 'Email or password is incorrect' });
        }
      } catch (error) {
        console.error('Error authenticating user:', error);
        res.status(500).send('Error authenticating user');
      }
    });



   // Rota de logout
   router.get('/logout', (req, res) => {
    req.session.destroy((error) => {
      if (error) {
        console.error('Error logging out:', error);
        res.status(500).send('Error logging out');
      } else {
        res.redirect('/signin'); // Redirecione para a página de login após o logout
      }
    });
  });


module.exports = router;