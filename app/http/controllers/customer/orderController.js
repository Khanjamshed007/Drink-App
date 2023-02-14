
const Order = require('../../../models/order')
const moment = require('moment');

function orderController() {
    return {
        store(req, res) {
            // Validate Request
            const { phone, address } = req.body;
            if (!phone) {
                req.flash('error', "Please enter phone number");
                return res.redirect('/cart');
            }
            else if (!address) {
                req.flash('error', 'Please enter your Address.');
                return res.redirect('/cart');
            }

            const order = new Order({
                customerId: req.user._id,
                items: req.session.cart.items,
                phone,
                address
            })
            order.save().then(result => {
                Order.populate(result, { path: 'customerId' }, (err, placedOrder) => {

                    req.flash('success', 'Order Placed Successfully')
                    delete req.session.cart

                    // Emit
                    const eventEmitter = req.app.get('eventEmitter')
                    eventEmitter.emit('orderPlaced', placedOrder)
                    return res.redirect('/customer/order')
                })
            }).catch(err => {
                req.flash('error', 'Something went wrong');
                return res.redirect('/cart');
            })
        },

        async index(req, res) {
            const order = await Order.find({ customerId: req.user._id }, null, { sort: { 'createdAt': -1 } });
            res.header('Cache-Control', 'no-cache,private,no-store,must-revalidate,max-steal=0,post-check=0,pre-check=0')
            res.render('customers/orders', { order: order, moment: moment });
        },
        async showStatus(req, res) {
            const order = await Order.findById(req.params.id);
            // Authorize user
            if (req.user._id.toString() === order.customerId.toString()) {
                return res.render('customers/singleorder', { order: order })
            }
            return res.redirect('/');
        }
    }
}


module.exports = orderController