const passport = require('passport')
const JwtStrategy = require('passport-jwt').Strategy
const { ExtractJwt } = require('passport-jwt')
const LocalStrategy = require('passport-local').Strategy
const GooglePlusTokenStrategy = require('passport-google-plus-token')
const { JWT_SECRET } = require('./configuration/index')
const User = require('./models/user')

// JSON WEB TOKEN STRATEGY
passport.use(new JwtStrategy({
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: JWT_SECRET

}, async (payload, done) => {
  try {
    // Find the user from token
    const user = await User.findById(payload.sub)

    // if user doesm't exists, handle it
    if (!user) {
      return done(null, false)
    }

    // Else, return the user
    done(null, user)

  } catch(error) {
    done(error, false)
  }  
}))

// GOOGLE OAUTH STRATEGY
passport.use('googleToken', new GooglePlusTokenStrategy({
  clientID: '906449625052-vmu5huk0brfke9v7d5qnqt4msd950kq0.apps.googleusercontent.com',
  clientSecret: '53cQumqNBtu34MpkQ-KWyzJq'
}, async (accessToken, refreshToken, profile, done) => {
  try {
    console.log('accessToken', accessToken)
    console.log('refreshToken', refreshToken)
    console.log('profile', profile)

    // Check wether this current user exists in our DB
    const existingUser = await User.findOne({ "google.id": profile.id })
    if (existingUser) {
      return done(null, existingUser)
    }

    // If new account
    const newUser = User({
      method: 'google',
      google: {
        id: profile.id,
        email: profile.emails[0].value
      }
    })

    await newUser.save()
    done(null, newUser)

  } catch(error) {
    done(error, false, error.message)
  }
}))

// LOCAL STRATEGY
passport.use(new LocalStrategy({
  usernameField: 'email',

}, async (email, password, done) => {
  try {
      // Find the user given the email
      const user = await User.findOne({ "local.email": email })

      // If not, handle it
      if (!user)
        return done(null, false)

      // Check if the password is correct
       const isMatch = await user.isValidPassword(password)

      // If not, handle it
      if (!isMatch) {
        return done(null, false)
      }

      // Otherwise, return the user
      done(null, user)
  } catch(error) {
    done(error, false)
  }
}))
