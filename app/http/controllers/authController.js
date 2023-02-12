const User = require('../../models/user');
const bcrypt = require('bcrypt');
const passport = require('passport');

function authController() {
    const _getRedirect = (req) => {
        return req.user.role ==='admin' ? '/admin/order' :'/customer/order'
}

    return {
        login(req, res) {
            res.render('auth/login');
        },
        postLogin(req, res, next) {

            const { email, password } = req.body
            if (!email || !password) {
                req.flash('error', 'All Fields are required ');
                return res.redirect('/login')
            }

            passport.authenticate('local', (err, user, info) => {
                if (err) {
                    req.flash('error', info.message);
                    return next(err)
                }
                if (!user) {
                    req.flash('error', info.message);
                    return res.redirect('/login')
                }
                req.logIn(user, (err) => {
                    if (err) {
                        req.flash('error', info.message);
                        return next(err)
                    }
                    return res.redirect(_getRedirect(req));
                })
            })(req, res, next);
        },

        register(req, res) {
            res.render('auth/register');
        },
        async postRegister(req, res) {
            const { name, email, phone, password } = req.body;
            // validate request
            if (!name || !email || !phone || !password) {

                req.flash('error', 'All Fields are required ');
                req.flash('name', name);
                req.flash('email', email);
                req.flash('phone', phone);
                return res.redirect('/register')
            }


            // if the user email already exist 
            User.exists({ email: email }, (err, result) => {
                if (result) {
                    req.flash('error', 'Email Already Taken');
                    req.flash('name', name);
                    req.flash('email', email);
                    req.flash('phone', phone);
                    return res.redirect('/register')
                }
            });

            // hash Password
            const hashPassword = await bcrypt.hash(password, 10)

            // Create a user
            const user = new User({
                name,
                email,
                phone,
                password: hashPassword
            })

            user.save().then((user) => {
                return res.redirect('/')
            }).catch(err => {
                req.flash('error', 'Something went Wrong');
                return res.redirect('/register')
            })
        },
        // creating a logout function
        logout(req, res, next) {
            req.logout(function (err) {
                if (err) {
                    return next(err);
                }
                res.redirect('/login');
            });
        }
    }
}

module.exports = authController