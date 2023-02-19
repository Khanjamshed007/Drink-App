
const User = require('../../../models/user');
const fs = require('fs');
const path = require('path');

function updateController() {
    return {
        profile(req, res) {
            User.findById(req.params.id, (err, user) => {
                return res.render('customers/profile', {
                    title: 'user',
                    profile: user
                })
            })
        }
    }
}

module.exports = updateController