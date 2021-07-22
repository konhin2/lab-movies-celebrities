const Celebrity = require("../models/Celebrity.model")
const Movie = require("../models/Movie.model")
// starter code in both routes/celebrities.routes.js and routes/movies.routes.js
const router = require("express").Router();
const { isLoggedIn, isLoggedOut } = require("./../middleware/route-guard")
// all your routes here
router.get('/movies/create', isLoggedIn, (req, res, next) => {
    // Iteration #6: Adding New Movies
    Celebrity.find({})
        .then((celibridadesEncontradas) => {
            console.log(celibridadesEncontradas)
            res.render('movies/new-movie', {
                celebrities: celibridadesEncontradas
            })
        })
        .catch((err) => console.log(err))
})
router.post('/movies/create', (req, res, next) => {
    // Iteration #6: Adding New Movies
    const {title, genre, plot, cast}= req.body
    Movie.create({title, genre, plot, cast})
        .then(() => {
            res.redirect('/movies')
        })
        .catch((err) => {
            console.log(err)
            res.render('movies/new-movie')
        })
})
router.get('/movies', isLoggedIn, (req, res, next) => {
    // Iteration #7: Listing Our Movies
    Movie.find({})
        .then((movies) => {
            // console.log(movies)
            res.render('movies/movies', {
                movies
            })
        })
        .catch(err => next(err))
})
router.get("/movies/:id", isLoggedIn, (req, res, next) => {
    const {id} = req.params
    Movie.findById(id)
        .populate('cast')
        .then(singleMovie => {
            console.log(singleMovie)
            res.render("movies/movie-details", singleMovie)
        })
        .catch(e => console.log(e))
})
router.post('/movies/:id/delete', (req, res) => {
    const { id } = req.params
    Movie.findByIdAndRemove(id)
        .then(() => res.redirect("/movies"))
        .catch((err) => console.log(err))
})
router.get('/movies/:id/edit', isLoggedIn, (req, res) => {
    const { id } = req.params
    Movie.findById(id)
        .polulate('cast')
        .then((foundMovie) => {
            console.log("Pelicula encontrada", foundMovie)
            res.render('movies/edit-movie', {
                movie: foundMovie
            })
        })
        .catch((err) => console.log(err))
})
router.post('/movies/:id/edit', (req, res) => {
    // Parametros de la URL
    const { id } = req.params
    // Datos del formulario
    const { title, genre, plot, cast } = req.body

    Movie.findByIdAndUpdate(id, { title, genre, plot, cast }, {new: true})
        .then(() => {
            res.redirect(`/movies`)
        })
        .catch((err) => console.log(err))
})
module.exports = router;
