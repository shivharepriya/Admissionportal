
const jasonwebtoken = require('jsonwebtoken')
const userModel = require('../models/users')

const checkUserAuth = async(req,res,next)=>{
    // console.log('not authorized user')
    const {token} = req.cookies;
    if(!token){
        req.flash('error', 'Unauthorized User! Please Login')
        return res.redirect('/')
    }else{
        const verify_token = jasonwebtoken.verify(token, process.env.JWT_SECRET_KEY)
        // console.log(verify_token)
        const userData = await userModel.findOne({_id:verify_token.userId})
        // console.log(userData)
        req.showUserData = userData
        // console.log(req.showUserData._id)
        next();
    }
}

module.exports = checkUserAuth