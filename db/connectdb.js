const mongoose = require('mongoose')

const connectDB = () => {

    return mongoose.connect(process.env.DB_URL)
        .then(() => {
            console.log('db connected successfully')
        }).catch((err) => {
            console.log(err)
        })
}
module.exports = connectDB