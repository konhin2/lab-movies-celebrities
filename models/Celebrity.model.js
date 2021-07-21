//  Add your code here
// 1. IMPORTACIONES
const mongoose = require('mongoose')
const Schema = mongoose.Schema

// 2. SCHEMA
const celebritySchema = new Schema({
    name: String,
    occupation: String,
    catchPhrase: String,
}, {
    timestamps: true // Generar el momento en el que se creo el documento
})

// 3. MODELO
const Celebrity = mongoose.model('Celebrities', celebritySchema)

// 4. EXPORTACION
module.exports = Celebrity