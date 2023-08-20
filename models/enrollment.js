const mongoose = require('mongoose')

const enrollSchema = new mongoose.Schema({
    user_id: {
        type: String,
        Required: true
    },
    name: {
        type: String,
        Required: true
    },
    email: {
        type: String,
        Required: true,
        unique:true,
    },
    phone: {
        type: String,
        Required: true
    },
    address: {
        type: String,
        Required: true
    },
    gender: {
        type: String,
        Required: true
    },
    collage: {
        type: String,
        Required: true
    },
    courses: {
        type: String,
        Required: true
    },
    branch: {
        type: String,
        Required: true
    },
    status: {
        type: String,
        default:"Pending"
    },
    comment:{
        type: String,
        default:"Wait"
    },

},{timestamps:true})

// collection
const enrollmentModel = mongoose.model('enrollmentData', enrollSchema)
module.exports = enrollmentModel
