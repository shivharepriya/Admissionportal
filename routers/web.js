const express = require('express')
const passport = require('passport')
const AdminController = require('../Controllers/AdminContoller')
const UsersController = require('../Controllers/UsersController')
const checkUserAuth = require('../middleware/auth')
const authRole = require('../middleware/authrole')
const router = express.Router()

// frontend Controller router
router.get('/', UsersController.login)
router.get('/registerform', UsersController.usersRegister) 
router.get('/dashboard', checkUserAuth, UsersController.dashboard)
router.get('/about',checkUserAuth, UsersController.about)
router.get('/contact',checkUserAuth, UsersController.contact)
router.get('/logout',checkUserAuth, UsersController.logout)
router.get('/coursedisplay', checkUserAuth, UsersController.courseDisplay)
router.get('/courseview/:id', checkUserAuth, UsersController.courseView)
router.post('/register', UsersController.submitregisterForm)
router.post('/verify_login', UsersController.verify_login)
router.post('/course_register', UsersController.courseRegister)
router.post('/update_course/:id', UsersController.updateCourse)
router.post('/profile/:id',checkUserAuth, UsersController.updatePassword)


// admin Controller router
router.get('/admin/dashboard',checkUserAuth,authRole('admin') ,AdminController.adminDashboard)
router.get('/admin/userdetails', checkUserAuth, AdminController.usersDetail)
router.get('/admin/courseregisterdetails', checkUserAuth, AdminController.registerationDetail)
router.get('/admin/viewcoursedetails/:id', checkUserAuth, AdminController.viewCourseDetails)
router.get('/admin/viewusersdetails/:id', checkUserAuth, AdminController.viewUsersDetails)
router.post('/admin/update_status/:id', checkUserAuth, AdminController.updateStatus)
router.get('/adminlogout',checkUserAuth, AdminController.adminLogout)

// google login 
router.get('/auth/google', passport.authenticate("google", {
    scope:["profile", "email"]
}))
router.get('/auth/google/callback', passport.authenticate("google"), UsersController.callbackGoogle)

module.exports = router