const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        Required: true
    },
    email: {
        type: String,
        Required: true
    },
    password: {
        type: String,
        Required: true
    },
    role: {
        type: String,
        default:'user'
    },
},{timestamps:true})

const userModel = mongoose.model('admissionPortalUsers', userSchema)
module.exports = userModel
