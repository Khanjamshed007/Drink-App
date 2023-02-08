const homeController=require('../app/http/controllers/homeController');
const authController=require('../app/http/controllers/authController');
const cartController=require('../app/http/controllers/customer/cartController');
const guest=require('../app/http/middlewares/guest');


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

}
module.exports=initRoutes