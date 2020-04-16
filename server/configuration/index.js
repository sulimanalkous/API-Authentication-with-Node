module.exports = {
  JWT_SECRET: 'kocktailmallauthentication',
  oauth: {
    google: {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_SECRET
    },
    facebook: {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_SECRET
    },
  }
}
