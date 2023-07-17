require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const registerRouter = require('./routes/register');
const Trip = require('./models/trip');

const app = express();
const MONGODB_URI = 'mongodb://localhost:27017/travelgraphy';

// Configurações do servidor
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/register', registerRouter);

// Função de verificação de autenticidade do usuário
const authenticateUser = (email, password) => {
  // Aqui você pode implementar a lógica de autenticação adequada
  // Exemplo simplificado de autenticação
  if (email === 'admin@example.com' && password === 'password') {
    return true; // Autenticação bem-sucedida
  }

  return false; // Autenticação falhou
};

// Conectar ao banco de dados
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to the database');

    // Configuração das rotas
    app.get('/', (req, res) => {
      res.render('home');
    });
    
    // Rota da página de registro
    app.get('/register', (req, res) => {
      res.render('register');
    });
    
    // Rota da página de login
    app.get('/signin', (req, res) => {
      res.render('signin');
    });

    // Rota de autenticação (página de login)
    app.post('/signin', (req, res) => {
      const { email, password } = req.body;

      // Verifique a autenticidade do usuário usando a lógica de autenticação adequada
      const isAuthenticated = authenticateUser(email, password);

      if (isAuthenticated) {
        // Autenticação bem-sucedida
        res.redirect('/admin'); // Redirecione para a página de administração
      } 
    
    });

    // Rota da página de administração
    app.get('/admin', (req, res) => {
      const trips = [
        {
          destination: 'Trip 1',
          date: '2023-07-12',
          comment: 'This is trip 1',
          image: 'trip1.jpg'
        },
        {
          destination: 'Trip 2',
          date: '2023-07-13',
          comment: 'This is trip 2',
          image: 'trip2.jpg'
        }
      ];
    
      // Renderize a página de administração e passe os dados das trips como variável
      res.render('admin', { trips });
    });
    

    app.get('/admin', (req, res) => {
      Trip.find()
        .then((trips) => {
          res.render('admin', { trips: trips });
        })
        .catch((error) => {
          console.error('Error retrieving trips:', error);
          res.status(500).send('Error retrieving trips');
        });
    });
    

    app.post('/trips', (req, res) => {
      const { destination, dates, itinerary } = req.body;
    
      const trip = new Trip({ destination, dates, itinerary });
      trip.save()
        .then(() => {
          res.redirect('/');
        })
        .catch((error) => {
          console.error('Error creating the trip:', error);
          res.status(500).send('Error creating the trip');
        });
    });

    // Iniciar o servidor
    app.listen(3000, () => {
      console.log("Server started on port 3000");
    });
  })
  .catch((error) => {
    console.error('Error connecting to the database:', error);
  });
