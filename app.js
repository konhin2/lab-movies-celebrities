// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require('dotenv/config');

// ℹ️ Connects to the database
require('./db');

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require('express');

// Handles the handlebars
// https://www.npmjs.com/package/hbs
const hbs = require('hbs');

const app = express();
// Genreración de la session
require('./config/session.config')(app)

// ℹ️ This function is getting exported from the config folder. It runs most middlewares
require('./config')(app);

// default value for title local
const projectName = 'lab-movies-celebrities';
const capitalized = string => string[0].toUpperCase() + string.slice(1).toLowerCase();

app.locals.title = `${capitalized(projectName)}- Generated with Ironlauncher`;
// Layout Middleware
app.use((req, res, next) => {
    res.locals.usuarioActual = req.session.usuarioActual
    next()
})
// 👇 Start handling routes here
const index = require('./routes/index');
app.use('/', index);

const celebrityRoutes = require('./routes/celebrities.routes');
app.use('/', celebrityRoutes);

const movieRoutes = require('./routes/movies.routes');
app.use('/', movieRoutes);

const authRouter = require('./routes/auth.routes');
app.use('/', authRouter);

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require('./error-handling')(app);

module.exports = app;
