const router = require('express').Router()
const Trip = require("../models/Trip.model")


// Esta rota renderizará o arquivo new-trip.ejs para permitir que os usuários criem
// uma nova viagem no banco de dados
router.get("/create", (req, res) => {
    res.render("trip/new-trip.ejs")
})


// Esta rota receberá a solicitação POST do arquivo new-trip.ejs
// e criará um novo documento de viagem no banco de dados
router.post("/create", async (req, res) => {
    try{
        const newTr = req.body
        await Trip.create({...newTr})
        res.redirect("/trips")
    }
    catch (error) {
        console.log("Houve um erro ao criar a viagem.")
        res.render("trips/new-trips.ejs")
    }
})

// Esta rota renderizará o arquivo trips.ejs para exibir todas as viagens no banco de dados
router.get("/", async (req, res) =>{
    try{
        const allTrs = await Trip.find()
        res.render("trips/trips", {allTrs})
    }
    catch (error) {
        console.log(error)
        res.redirect("/")
    }
})

module.exports = router
