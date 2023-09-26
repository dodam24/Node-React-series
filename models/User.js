const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10
const jwt = require('jsonwebtoken');


const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxlength: 50
  },
  email: {
    type: String,
    trim: true,
    unique: 1
  },
  password: {
    type: String,
    minlength: 5
  },
  lastname: {
    type: String,
    maxlength: 50
  },
  role: {
    type: Number,
    default: 0
  },
  image: String,
  token: {
    type: String
  },
  tokenExp: {
    type: Number
  }
})

userSchema.pre('save', function(next) {   // User 정보를 저장하기 전에 실행
  var user = this;

  if(user.isModified('password')) {
    // 비밀번호를 암호화 시킨다.
    bcrypt.genSalt(saltRounds, function(err, salt) {
      if(err) return next(err)

      bcrypt.hash(user.password, salt, function(err, hash) {
        if(err) return next(err)
        user.password = hash
        next()
      })
    })
  } else {
      next()
  }
})


userSchema.methods.comparePassword = function(plainPassword) {
  return new Promise((resolve, reject) => {
    // plainPassword: 1234567     암호화된 비밀번호: $2b$10$Wh4gN/9GN/Gk9uRZ0kdMNelvVegK9P9RAiPftJLmbBJc90eFYpUoC
    bcrypt.compare(plainPassword, this.password, (err, isMatch) => {
      if(err) return reject(err);
      resolve(isMatch);
    })
  })
}

userSchema.methods.generateToken = function() {
  return new Promise((resolve, reject) => {
    const user = this;
    
    // jsonwebtoken을 이용해서 token을 생성하기
    const token = jwt.sign(user._id.toHexString(), 'secretToken');
    // user._id + 'secretToken' = token
    // -> 
    // 'secretToken' -> user._id

    user.token = token;
    
    user.save()
      .then((user) => {
        resolve(user);
      })
      .catch((err) => {
        reject(err);
      })
  })
}


const User = mongoose.model('User', userSchema)

module.exports = { User }