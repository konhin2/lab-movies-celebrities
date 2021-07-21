const Celebrity = require("../models/Celebrity.model");

// starter code in both routes/celebrities.routes.js and routes/movies.routes.js
const router = require("express").Router();

// all your routes here
router.get('/celebrities/create', (req, res, next) => {
    // Iteration #3: Adding New Celebrities
    res.render('celebrities/new-celebrity')
})

router.post('/celebrities/create', (req, res, next) => {
    // Iteration #3: Adding New Celebrities
    const {
        name,
        occupation,
        catchPhrase
    } = req.body
    Celebrity.create({
            name,
            occupation,
            catchPhrase
        })
        .then(() => {
            res.redirect('/celebrities')
        })
        .catch((err) => {
            console.log(err)
            res.render('celebrities/new-celebrity')
        })
})

router.get('/celebrities', (req, res, next) => {
    // Iteration #4: Listing Our Celebrities
    Celebrity.find({})
        .then((celebrity) => {
            res.render('celebrities/celebrities', {
                celebrity
            })
        })
        .catch(err => next(err))
})

module.exports = router;