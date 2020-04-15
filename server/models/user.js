const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const Schema = mongoose.Schema

// create a schema
const userSchema = new Schema({
  method: {
    type: String,
    enum: ['local', 'google', 'facebook']
  },
  local: {
    email: {
        type: String,
        lowercase: true
    },
    password: {
        type: String
    }
  },
  google: {
    id: {
      type: String,
    },
    email: {
      type: String,
      lowercase: true
    }
  },
  facebook: {
    id: {
      type: String,
    },
    email: {
      type: String,
      lowercase: true
    }
  }
})

userSchema.pre('save', async function(next) {
  try {
    if (this.method !== 'local') {
      next()
    }

    // Generate a salt
    const salt = await bcrypt.genSalt(10)
    // Generate a password hash (salt + hash)
    const passwordHashed = await bcrypt.hash(this.local.password, salt)
    // Re-assign hashed version over original, plain text password
    this.local.password = passwordHashed
    next()
  } catch(error) {
    next(error)
  }
})

userSchema.methods.isValidPassword = async function(newPassword) {
  try {
     return await bcrypt.compare(newPassword, this.local.password) 
  } catch (error) {
    // we cant use next becuase we dont have access to it
    throw new Error(error)
  }
}
// create model
const User = mongoose.model('user', userSchema)

// Export the model
module.exports = User;
