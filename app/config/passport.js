// importing the passport-local
const localStrategy = require('passport-local').Strategy
const User = require('../models/user');
const bcrypt = require('bcrypt');



function init(passport) {
    passport.use(new localStrategy({ usernameField: 'email' }, async (email, password, done) => {
        // Login
        // check if email exists
        const user = await User.findOne({ email: email })

        // if the user is not found
        if (!user) {
            return done(null, false, { message: 'No User found With this email' })
        }
        bcrypt.compare(password, user.password).then(match => {
            // if the password was matched
            if (match) {
                return done(null, user, { message: 'Logged in Successfully' })
            }
            return done(null, false, { message: 'Invalid Username/Password' })
        }).catch(err => {
            return done(null, false, { message: 'Somthign went Wrong' })
        })

    }))

    // Seriallizing the User
    passport.serializeUser((user, done) => {
        done(null, user._id);
    })

    // deserializing the user
    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user)
        })
    })
}



module.exports = init