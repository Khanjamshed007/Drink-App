// Controllers
const homeController=require('../app/http/controllers/homeController');
const authController=require('../app/http/controllers/authController');

// Customer Controllers
const cartController=require('../app/http/controllers/customer/cartController');
const orderController=require('../app/http/controllers/customer/orderController');
const updateController=require('../app/http/controllers/customer/updateController')

// Admin Controller
const AdminOrderController=require('../app/http/controllers/admin/ordercontroller');
const statusController=require('../app/http/controllers/admin/statusController');


// Middlewares
const guest=require('../app/http/middlewares/guest');
const auth=require('../app/http/middlewares/auth');
const admin=require('../app/http/middlewares/admin');


function initRoutes(app){
    // Rendering the home page
app.get('/',homeController().index);


// Rendering login page
app.get('/login',guest,authController().login);

// Rendering the post login page
app.post('/login',authController().postLogin);

// rendering register page
app.get('/register',guest,authController().register)

// Rendering the Post  register Page
app.post('/register',authController().postRegister)

// Rendering the logout page
app.post('/logout',authController().logout);

// Rendering cart page
app.get('/cart',cartController().index);
app.post('/update-cart',cartController().update);
// app.post('/delete',cartController().delete);



// Customer Routes

// Rendering the order page
app.post('/order',auth,orderController().store);
app.get('/customer/order',auth,orderController().index);
app.get('/customer/profile',auth,updateController().profile);
app.get('/customer/order/:id',auth,orderController().showStatus);


// Admin Routes

// For Admin Order page
app.get('/admin/order',admin,AdminOrderController().index);

// For admin Status Page
app.post('/admin/order/status',admin,statusController().statusupdate);

}
module.exports=initRoutes