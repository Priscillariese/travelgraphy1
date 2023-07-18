
const requireAuth = (req, res, next) => {
  if (req.session.userId) {
    // O usuário está autenticado, permita o acesso à rota de administração
    next();
  } else {
    // O usuário não está autenticado, redirecione para a página de login
    res.redirect('/signin');
  }
  };
  
  module.exports = { requireAuth };