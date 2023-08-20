const express = require('express')
const app = express()
const web = require('./routers/web')

const session = require('express-session')

const cookieParser = require('cookie-parser')
// for security
app.use(cookieParser())

// requiring flash package for messages
const flash = require('connect-flash')

// const port=process.env.PORT || 3000
const passport = require('passport')
const googleStrategy = require('passport-google-oauth20')
passport.serializeUser(function(user,done){
  done(null, user)
})
passport.deserializeUser(function(user,done){
  done(null, user)
})
passport.use(
  new googleStrategy(
      {
          clientID:'439280418682-39eu5p36b39enh83ronik0eho40r1d6r.apps.googleusercontent.com',
          clientSecret:'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',
          callbackURL:"/auth/google/callback",
          passReqToCallback:true,
      },(request, accessToken, refreshToken, profile, done)=>{
        // console.log(profile)
        return done(null, profile)
      }
  )
);
// using session for messages
app.use(session({
  secret: 'secret',
  cookie: { maxAge: 60000 },
  resave: false,
  saveUninitialized: false,
})); 
app.use(passport.initialize())
app.use(passport.session())




// env for more security
const dotenv = require('dotenv')
dotenv.config({path:'.env'})

// require body-parser
const bodyParser = require('body-parser')
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))
// parse application/json
app.use(bodyParser.json())

app.use(flash());

// connection to database mongoose
const connectDB = require('./db/connectdb')
connectDB()

// routing
app.use('/', web)

// ejs setup
app.set('view engine', 'ejs')

// static files setup e.g css, images
app.use(express.static('public'))

// listening to server
app.listen(process.env.PORT,()=>{
    console.log(`server is running localhost:${process.env.PORT}`)
})