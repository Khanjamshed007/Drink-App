const express=require('express');
const app=express();
const ejs=require('ejs');
const path=require('path');
const ejsLayout=require('express-ejs-layouts');
const port=process.env.port || 8000;


// Assests from css and js
app.use(express.static('public'));


// Set the template engine
app.use(ejsLayout);
app.set('views',path.join(__dirname,'/resources/views'))
app.set('view engine','ejs');

// Rendering the home page
app.get('/',(req,res)=>{
    res.render("home");
})

// Rendering cart page
app.get('/cart',(req,res)=>{
    res.render('customers/cart')
})

// Rendering login page
app.get('/login',(req,res)=>{
    res.render('auth/login')
})

// rendering register page
app.get('/register',(req,res)=>{
    res.render('auth/register')
})
// Running the server on port
app.listen(port,()=>{
    console.log(`Listing on port ${port}`);
})