let mongoose = require('mongoose')

const userScema = new mongoose.Schema({
    username: String,
    password: String
})

const User = mongoose.model('User', userScema)

module.exports = User