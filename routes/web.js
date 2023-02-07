const homeController=require('../app/http/controllers/homeController');
const authController=require('../app/http/controllers/authController');
const cartController=require('../app/http/controllers/customer/cartController');


function initRoutes(app){
    // Rendering the home page
app.get('/',homeController().index);


// Rendering login page
app.get('/login',authController().login);

// rendering register page
app.get('/register',authController().register)

// Rendering cart page
app.get('/cart',cartController().index);
app.post('/update-cart',cartController().update);

}
module.exports=initRoutes