
const Order = require('../../../models/order');

function statusController() {
    return {
        statusupdate(req, res) {
            Order.updateOne({ _id: req.body.orderId }, { status: req.body.status }, (err, data) => {
                if (err) {
                    req.flash('error', 'Something went wrong');
                    return res.redirect('/admin/order')
                }
                // Emit Event
                const eventEmitter = req.app.get('eventEmitter')
                eventEmitter.emit('orderupdated', { id: req.body.orderId ,status: req.body.status })
                return res.redirect('/admin/order')
            })
        }
    }
}

module.exports = statusController