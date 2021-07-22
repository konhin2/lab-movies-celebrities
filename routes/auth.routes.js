const router = require("express").Router();
const bcryptjs = require('bcryptjs')
const mongoose = require("mongoose")
const User = require("./../models/User.model");

const { isLoggedIn, isLoggedOut } = require("./../middleware/route-guard")

// Get - Display the signup for
router.get('/signup', isLoggedOut, (req, res) => {
  res.render('auth/signup')
})

// Post - Process form data
router.post('/signup', (req, res) => {
  // console.log("El formulario envio esto", req.body)

  // Extraccion de valores de una variable
  const {
    username,
    email,
    password
  } = req.body

  if (!username || !email || !password) {
    return res.render('auth/signup', {
      msg: "Todos los campos son obligatorios"
    })
  }

  // Verificar que el password es fuerte, combinación dificil

  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  // Si el password no cumple con las especificaciones
  if (!regex.test(password)) {
    return res.status(500).render('auth/signup', {
      msg: "El password debe tener 6 caracteres minimo, y debe contener al menos un número, una minúscla y una mayuscula"
    })
  }


  // Encriptación
  bcryptjs
    .genSalt(10)
    .then(salt => bcryptjs.hash(password, salt))
    .then(hashedPassword => {
      // console.log('Password encriptado', hashedPassword)
      return User.create({
        username,
        email,
        passwordHash: hashedPassword
      })
    })
    .then(usuarioCreado => {
      console.log('El usuario que creamos fue: ', usuarioCreado)
      res.redirect('/userprofile')
    })
    .catch(error => {
      // validacion del email valido
      if (error instanceof mongoose.Error.ValidationError) {
        res.status(500).render('auth/signup', {
          msg: 'Usa un email valido'
        });
      // Validacion del username
      } else if(error.code === 11000) {
        res.status(500).render('auth/signup', {
          msg: 'El usuario y el correo ya existen. Intenta uno nuevo.'
        })
      }
    })
})


// GET Profile page for current user
// Si estoy loggeado, puedo entrar a mi perfil
// Si no estoy loggeado enviame a la página de login
router.get('/userprofile', isLoggedIn, (req, res) => {
  res.render("users/user-profile", {
    user: req.session.usuarioActual
  })
})

// GET - Mostrar el formulario LOGIN

router.get('/login', (req, res) => {
  res.render('auth/login')
})

// Proceso de autenticación
// Verificar que el usuario y contraseña es el mismo que se registro
router.post('/login', (req, res) => {

  console.log(req.session)

  const { email, password } = req.body
  // Validar email y password
  if (!email || !password) {
    return res.render('auth/login', {
      msg: "Por favor ingresa email y password"
    })
  }

  User.findOne({email})
    .then(usuarioEncontrado => {
      
      // 1. Si el usuario no esiste en base de datos
      if (!usuarioEncontrado) {
        return res.render('auth/login', {
          msg: "El email no fue encontrado"
        })
      }
      const autenticacionVerificada = bcryptjs.compareSync(password, usuarioEncontrado.passwordHash)
      // 2. Si el usuario se equvoco de contraseña
      if (!autenticacionVerificada) {
        return res.render('auth/login', {
          msg: "La contraseña es incorrecta"
        })
      }
      // 3. Si el usuraio coincide con la contraseña en la base de datos
      // Vamos a crear en nuestro objeto Session una propiedad que se llame usuario actual

      req.session.usuarioActual = usuarioEncontrado
      
      return res.redirect('/userprofile')
    })
    .catch((e) => console.log(e))
})

// POST - Logout
router.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.log(err)
    }
    res.redirect('/')
  })
})

module.exports = router