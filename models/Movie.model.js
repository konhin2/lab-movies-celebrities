// 1. IMPORTACIONES
const mongoose = require('mongoose')
const Schema = mongoose.Schema

// 2. SCHEMA
const movieSchema = new Schema({
    title: String,
    genre: String,
    plot: String,
    cast: [{type: Schema.Types.ObjectId, ref : "Celebrity"}]
}, {
    timestamps: true // Generar el momento en el que se creo el documento
})

// 3. MODELO
const Movie = mongoose.model('Movies', movieSchema)

// 4. EXPORTACION
module.exports = Movie