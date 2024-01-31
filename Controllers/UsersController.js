const userModel = require('../models/users')
const enrollmentModel = require('../models/enrollment')
const bcrypt = require("bcrypt")
const jsonwebtoken = require('jsonwebtoken')



class UsersController {

    static usersRegister = async (req, res) => {
        res.render('front/register', { message: req.flash('error') })
    }

    static submitregisterForm = async (req, res) => {
        // console.log(req.body)
        const { name, email, password, confirm_password } = req.body
        const users = await userModel.findOne({ email: email })
        if (users) {
            req.flash('error', 'User Already Exist')
            return res.redirect('/registerform')
        } else {
            if (name && email && password && confirm_password) {
                if (password === confirm_password) {
                    try {
                        const hashpassword = await bcrypt.hash(password, 10)
                        const result = await userModel({
                            name: name,
                            email: email,
                            password: hashpassword,
                        })

                        await result.save()
                        req.flash('success', 'Registeration Successfull, Please Login!')
                        return res.redirect('/')
                    } catch (err) {
                        console.log(err)
                    }
                } else {
                    req.flash('error', 'Password does not Match the Confirm Password')
                    return res.redirect('/registerform')
                }
            } else {
                req.flash('error', 'All Fields are Required!')
                return res.redirect('/registerform')
            }
        }
    }

    static login = async (req, res) => {
        res.render('front/login', { message: req.flash('success'), error: req.flash('error') })
    }

    static verify_login = async (req, res) => {
        try {
            const { email, password } = req.body
            // console.log(password) is this filed or schema password
            if (email && password) {
                const user = await userModel.findOne({ email: email })
                // console.log(user.password) is this field or schema password
                if (user != null) {
                    const isMatched = await bcrypt.compare(password, user.password)
                    if ((user.email === email) && isMatched) {
                        // // verify token
                        // const token = jsonwebtoken.sign({ userId: user._id }, process.env.JWT_SECRET_KEY);
                        // res.cookie('token', token)
                        // // console.log(token)
                        // res.redirect('/dashboard')

                        if (user.role == 'user') {
                            //verifytoken
                            const token = jsonwebtoken.sign({ userId: user._id }, process.env.JWT_SECRET_KEY);
                            // console.log(token)
                            res.cookie('token', token)
                            res.redirect('/dashboard')  
                        }
                        if (user.role == 'admin') {
                            //verifytoken
                            const token = jsonwebtoken.sign({ userId: user._id }, process.env.JWT_SECRET_KEY);
                            // console.log(token)
                            res.cookie('token', token)
                            res.redirect('/admin/dashboard')
                        }

                    } else {
                        req.flash('error', 'Email or Password is not Valid')
                        return res.redirect('/')
                    }
                } else {
                    req.flash('error', 'You are not a Register User')
                    return res.redirect('/')
                }
            } else {
                req.flash('error', 'All Fields are Required!')
                return res.redirect('/')
            }
        } catch (err) {
            console.log(err)
        }
    }

    static dashboard = async (req, res) => {
        try {
            const { _id, name, email } = req.showUserData
            const btech = await enrollmentModel.findOne({ user_id: _id, courses: 'B-Tech' })
            const Mtech = await enrollmentModel.findOne({ user_id: _id, courses: 'M-Tech' })
            const MCA = await enrollmentModel.findOne({ user_id: _id, courses: 'MCA' })
            res.render('front/dashboard', { username: name, useremail: email, id: _id, b: btech, M: Mtech, mca: MCA ,error: req.flash('error') } )

        } catch (err) {
            console.log(err)
        }
    }

    static about = async (req, res) => {
        res.render('front/about')
    }

    static contact = async (req, res) => {
        res.render('front/contact')
    }

    static logout = async (req, res) => {
        try {
            res.clearCookie('token')
            res.redirect('/')
        } catch (err) {
            console.log(err)
        }
    }

    static courseRegister = async (req, res) => {
        // console.log(req.body)
        const { user_id, name, email, phone, address, gender, collage, courses, branch } = req.body
        try {
            const enroll = await enrollmentModel({
                user_id: user_id,
                name: name,
                email: email,
                phone: phone,
                address: address,
                gender: gender,
                collage: collage,
                courses: courses,
                branch: branch,
            })

            await enroll.save()
            req.flash('success', 'Congratulations! For Successfully Enroll in ' + courses)
            return res.redirect('/coursedisplay')

        } catch (err) {
            console.log(err)
        }
    }

    static courseDisplay = async (req, res) => {
        try {
            const { _id } = req.showUserData
            const displayCourse = await enrollmentModel.find({ user_id: _id })
            // console.log(_id )
            res.render('front/coursedisplay', { CD: displayCourse, message: req.flash('success') })
        } catch (error) {
            console.log(error)
        }
    }

    static courseView = async (req, res) => {
        try {
            // const {_id}= req.showUserData
            // const viewdetails = await enrollmentModel.find({user_id:_id})
            const view = await enrollmentModel.findById(req.params.id)
            // console.log(view);
            // res.render('front/courseview', {data:view, id:_id} )
            res.render('front/courseview', { data: view })
        } catch (error) {
            console.log(error)
        }
    }

    static updateCourse = async (req, res) => {
        // console.log(req.body)
        // console.log(req.params.id)
        try {
            // const{_id}=req.showUserData
            const update = await enrollmentModel.findByIdAndUpdate(req.params.id, {
                name: req.body.name,
                email: req.body.email,
                phone: req.body.phone,
                address: req.body.address,
                gender: req.body.gender,
                collage: req.body.collage,
                courses: req.body.courses,
                branch: req.body.branch,
            })
            // console.log(update)
            await update.save()
            res.redirect('/coursedisplay')
        } catch (err) {
            console.log(err)
        }
    }

    static updatePassword = async (req, res) => {
        try {
            const { email, oldpassword, password, changepassword } = req.body
            // console.log(oldpassword, changepassword, email)
            if (email && oldpassword && password && changepassword) {
                const passwordUpdate = await userModel.findOne({ email: email })
                // console.log(passwordUpdate.password)
                const isMatched = await bcrypt.compare(oldpassword, passwordUpdate.password)
                // console.log(isMatched);
                if (!isMatched) {
                    req.flash( "error", "Old password is incorrect")
                    return res.redirect('/dashboard')
                } else {
                    if (password !== changepassword) {
                        req.flash( "error", "password does not match" )
                        return res.redirect('/dashboard')
                    }
                    else {
                        const hashpassword = await bcrypt.hash(changepassword, 10)
                        const newPassword = await userModel.findByIdAndUpdate(req.params.id, {
                            password: hashpassword
                        })
                        await newPassword.save()
                        req.flash('success', 'Password Updated Successfully!')
                        return res.redirect('/')
                    }
                }
            }
        } catch (error) {
            console.log(error)
        }
    }

    static callbackGoogle = async (req, res) => {
        // console.log(req.user.displayName, emails)
        try {
            const checkUser = await userModel.findOne({ email: req.user.emails[0].value })
            if (checkUser) {
                if (checkUser.role == 'user') {
                    const token = jsonwebtoken.sign({ userId: checkUser._id }, process.env.JWT_SECRET_KEY);
                    res.cookie('token', token)
                    res.redirect('/dashboard')
                }
            } else {
                const user = await userModel({
                    name: req.user.displayName,
                    email: req.user.emails[0].value,
                })
                await user.save()
                const User = await userModel.findOne({ email: req.user.emails[0].value })
                if (User.role == 'user') {
                    const token = jsonwebtoken.sign({ userId: User._id }, process.env.JWT_SECRET_KEY);
                    res.cookie('token', token)
                    res.redirect('/dashboard')
                }
            }
        } catch (error) {
            console.log(error)
        }
    }
}

module.exports = UsersController