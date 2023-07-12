const express = require('express');
const router = express.Router();

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/", (req, res) => {
  const title = "Travelgraphy"; // Defina o valor adequado para o título
  res.render("layout", { title });
});

module.exports = router;
