const JWT = require('jsonwebtoken')
const User = require('../models/user')
const { JWT_SECRET } = require('../configuration/index')

signToken = user => {
    return JWT.sign({
        iss: 'Kocktailmall',        // (Optional) set the name to decode with token
        sub: user.id,            // the subject to convert it to token we use ID
        iat: new Date().getTime(),  // (Optional) current time, time created this token
        exp: new Date().setDate(new Date().getDate() + 1)   // current time + 1 day
    }, 
        JWT_SECRET    // special string add to token
    )
}

module.exports = {
  signUp: async (req, res, next) => {
      // Email & Password
      const {email, password} = req.value.body

      // check if the email exists
      const foundUser = await User.findOne({ "local.email": email})
      if (foundUser) { 
          return res.status(403).send({error: 'Email is already exists!'})
      }
      // create new user
      const newUser = new User({
        method: 'local',
        local: {
          email: email,
          password: password
        }
      })
      await newUser.save()

      
      // response with token
      const token = signToken(newUser)

      res.status(200).json({ token: token })
  },

  signIn: async (req, res, next) => {
    // Generate token
    const token = signToken(req.user)
    res.status(200).json({ token })
  },

  googleOAuth: async (req, res, next) => {
    // Generate token
    console.log('req.user', req.user)

    const token = signToken(req.user)
    res.status(200).json({ token })
  },

  facebookOAuth: async (req, res, next) => {
    // Generate token
    console.log('req.user', req.user)

    const token = signToken(req.user)
    res.status(200).json({ token })
  },

  secret: async (req, res, next) => {
       console.log('I managed to get here!')
       res.json({ secret: "resource"})
  },
}
