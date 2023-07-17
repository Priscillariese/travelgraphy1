
require('dotenv').config()
require('./db')

const session = require('express-session');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const User = require('./models/user');
const Post = require('./models/Post.model');
const postRoutes = require('./routes/posts.routes');
const bcrypt = require('bcryptjs');


const express = require('express')

const app = express();
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 60000 * 60 * 24 * 7//
    }
  })
);



require('./config')(app)


const capitalize = require('./utils/capitalize')
const projectName = 'travelgraphy'

app.locals.appTitle = `${capitalize(projectName)} `

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/posts', postRoutes);


// Middleware para definir a propriedade currentUser
app.use((req, res, next) => {
  // Verifique se o usuário está autenticado
  if (req.session.currentUser) {
    // Defina a propriedade currentUser na sessão
    res.locals.currentUser = req.session.currentUser;
  } else {
    // Se o usuário não estiver autenticado, defina a propriedade como null
    res.locals.currentUser = null;
  }
  next();
});



    // Rota da página inicial
    app.get('/', (req, res) => {
      res.render('home');
    });


    // Rota da página about us
    app.get('/aboutUs', (req, res) => {
      res.render('aboutUs');
    });


    // Rota da página de registro
    app.get('/register', (req, res) => {
      res.render('register');
    });


    // Rota para lidar com o registro de usuários (POST)
    app.post('/register', async (req, res) => {
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

    // Rota da página de login
    app.get('/signin', (req, res) => {
      res.render('signin');
    });

    app.get('/home', (req, res) => {
      // Lógica para renderizar a página home aqui
      res.render('home'); // Substitua "home" pelo nome correto do arquivo da página home
    });
    
    // Rota de autenticação (página de login)
    app.post('/signin', async (req, res) => {
      const { email, password } = req.body;

      try {
        // Verifique a autenticidade do usuário consultando o banco de dados
        const user = await User.findOne({ email });

        if (user) {
          // Verifique se a senha fornecida corresponde à senha armazenada no banco de dados
          const isPasswordValid = await user.comparePassword(password);

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

   

// postRoutes middleware
const postRoutesMiddleware = (req, res, next) => {
  // código do middleware específico para as rotas de posts
  next(); // chamar next() para passar a execução para o próximo middleware ou rota
};

// Utilização do middleware postRoutes para rotas relacionadas aos posts
app.use('/posts', postRoutes);


 // Middleware de autenticação

    const requireAuth = (req, res, next) => {
      if (req.session.userId) {
        // O usuário está autenticado, permita o acesso à rota de administração
        next();
      } else {
        // O usuário não está autenticado, redirecione para a página de login
        res.redirect('/signin');
      }
    };


    app.get('/admin', requireAuth, async (req, res) => {
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


   // Rota de logout
app.get('/logout', (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      console.error('Error logging out:', error);
      res.status(500).send('Error logging out');
    } else {
      res.redirect('/signin'); // Redirecione para a página de login após o logout
    }
  });
});


    // Rota para exibir todos os usuários
    app.get('/users', async (req, res) => {
      try {
        const users = await User.find();
        res.render('users', { users });
      } catch (error) {
        console.error('Error retrieving users:', error);
        res.status(500).send('Error retrieving users');
      }
    });

    // Rota para criar um novo usuário
    app.post('/users', async (req, res) => {
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

// Middleware para definir a variável currentUser
app.use((req, res, next) => {
  res.locals.currentUser = req.user || null;
  next();
});

// Rota para a página "posts.ejs"
app.get('/posts', (req, res) => {
  // Verifique se o usuário está autenticado
  if (req.isAuthenticated()) {
    const userId = req.user.id; 

    // Recupere os posts do usuário autenticado com base no ID no banco de dados
    Post.find({ userId: userId })
      .then(posts => {
        
        res.render('posts', { posts: posts, currentUser: req.user });
      })
      .catch(err => {
        
      });
  } else {
    
    res.redirect('/signin'); 
  }
});


// Rota para criar um novo post
app.get('/new-post', (req, res) => {
  res.render('new-post');
});

app.post('/new-post', async (req, res) => {
  try {
    const { location, description, comment, image } = req.body;
    const post = new Post ({ location, description,  comment, image });

    await post.save();
    res.redirect('/posts');
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).send('Error creating post');
  }
});













require('./error-handling')(app)

module.exports = app
