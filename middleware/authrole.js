const jasonwebtoken = require('jsonwebtoken')
const userModel = require('../models/users')

const authRole = (roles)=>{
    return (req, res, next)=>{
        // console.log(req.showUserData.role)
        if(!roles.includes(req.showUserData.role)){
           return next(res.redirect('/dashboard'))
        }
        next()
    }
}

module.exports = authRole;
