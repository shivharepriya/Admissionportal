const enrollmentModel = require('../models/enrollment')
const userModel = require('../models/users.js')

class AdminController {
    static adminDashboard = async (req, res) => {
        const { _id, name, email } = req.showUserData
        res.render('admin/admindashboard', { n: name, e: email, id: _id })
    }

    static usersDetail = async (req, res) => {
        // const{_id, name, email}= req.showUserData;
        const userDetail = await userModel.find()
        // console.log(userDetail)
        res.render('admin/userdetails', { UD: userDetail })
    }

    static registerationDetail = async (req, res) => {
        // const{_id, name, email}= req.showUserData;
        const RegisterDetail = await enrollmentModel.find()
        // console.log(RegisterDetail) //courseregisterdetail page
        res.render('admin/courseregisterationdetails', { RD: RegisterDetail })
    }

    static viewCourseDetails = async (req, res) => {
        try {
            // console.log(req.params.id)
            const viewCourseDetails = await enrollmentModel.findById(req.params.id)
            // console.log(viewCourseDetails) //view register user page 
            res.render('admin/viewcoursedetails', { courseView: viewCourseDetails })
        } catch (error) {
            console.log(error)
        }
    }

    static viewUsersDetails = async(req,res)=>{
        try {
            // console.log(req.params.id)
            const usersviewDetails = await userModel.findById(req.params.id)
            // console.log(usersviewDetails)
            res.render('admin/viewuserdetails', { usersView: usersviewDetails })
        } catch (error) {
            console.log(error)
        }
    }

    static updateStatus = async (req, res) => {
        try {
            const { status, comment } = req.body
            //    console.log(status)
            //    console.log(comment)
            const result = await enrollmentModel.findByIdAndUpdate(req.params.id, {
                status: status,
                comment: comment
            })
            await result.save()
            return res.redirect('/admin/courseregisterdetails')

        } catch (error) {
            console.log(error)
        }
    }

    static adminLogout = async (req, res) => {
        try {
            res.clearCookie('token')
            res.redirect('/')
        } catch (error) {
            console.log(error)
        }
    }
}
module.exports = AdminController