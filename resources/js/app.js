// importing axios from node module file

import axios from 'axios';
import moment from 'moment';
import Noty from 'noty';
import { initAdmin } from './admin.js'

let addtocart = document.querySelectorAll('.add-to-cart')
let cartCounter = document.querySelector('#cartCounter')
// const form=document.querySelector('.form');
// const name=document.getElementById('Name');
// const email=document.getElementById('email-address');
// const phone=document.getElementById('phone');
// const password=document.getElementById('password');


function updateCart(drink) {
    axios.post('/update-cart', drink).then(res => {
        cartCounter.innerText = res.data.totalQty;
        new Noty({
            type: 'success',
            text: 'Added To Cart',
            timeout: 500,
            progressBar: false

        }).show();
    }).catch(err => {
        new Noty({
            type: 'error',
            text: 'somthing Went Wrong',
            timeout: 500,
            progressBar: false

        }).show();
    })
}


addtocart.forEach((btn) => {
    btn.addEventListener('click', (e) => {
        let drink = JSON.parse(btn.dataset.drink)
        updateCart(drink);
    })
})

// Removing alert message after X seconds
const alertMsg = document.querySelector('#success-alert')
if (alertMsg) {
    setTimeout(() => {
        alertMsg.remove()
    }, 3000);
}

// calling the admin js


// changing the order status
let status = document.querySelectorAll('.status-line')
let hiddenInput = document.querySelector('#hiddenInput');
let order = hiddenInput ? hiddenInput.value : null;
order = JSON.parse(order);
let time = document.createElement('small')


function updateStatus(order) {
status.forEach((status) =>{
    status.classList.remove('step-completed');
    status.classList.remove('current-status');
})
    let stepCompleted = true;
    status.forEach((status) => {
        let dataProp = status.dataset.status

        if (stepCompleted) {
            status.classList.add('step-completed')
        }

        if (dataProp === order.status) {
            stepCompleted = false;
            time.innerText = moment(order.updatedAt).format('hh:mm A')
            status.appendChild(time);
            if (status.nextElementSibling) {
                status.nextElementSibling.classList.add('current-status')
            }
        }
    })
    
}

updateStatus(order);

// Socket
let socket = io()
initAdmin(socket)
// join
if (order) {
    socket.emit('join', `order_${order._id}`)
}

// For Admin page
const adminPath=window.location.pathname;
console.log(adminPath)

if(adminPath.includes('admin')){
    socket.emit('join','adminRoom')
}

socket.on('orderupdated', (data) => {
    const updatedOrder = { ...order }
    updatedOrder.updatedAt = moment().format()
    updatedOrder.status = data.status
    updateStatus(updatedOrder);
    new Noty({
        type: 'success',
        text: 'Order Updated',
        timeout: 500,
        progressBar: false

    }).show();
})

















// For validation if the user put wrong input

// form.addEventListener('submit',e =>{
//     e.preventDefault();

//     validinput();
// });

// // for set the error
// const setError = (element,message) =>{
//     const inputControl=element.parentElement;
//     const errorDisplay=inputControl.querySelector('.error');

//     errorDisplay.innerText=message;
//     inputControl.classList.add('error');
// }

// // for remove the error
// const success = element =>{
//     const inputControl=element.parentElement;
//     const errorDisplay=inputControl.querySelector('.error');

//     errorDisplay.innerText=''
//     inputControl.classList.remove('error');
// }

// // for user give proper valid email
// const isValidEmail = email => {
//     const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
//     return re.test(String(email).toLowerCase());
// }

// // for valid inputs
// const validinput= () =>{
//     const nameValue=name.value.trim();
//     const emailValue=email.value.trim();
//     const phoneValue=phone.value.trim();
//     const passwordValue=password.value.trim();


//     if(nameValue=== ''){
//         setError(name,'Name is Required')
//     }else{
//         success(name);
//     }
//     if(emailValue=== ''){
//         setError(email,'Email is Required')
//     }else if(!isValidEmail(emailValue)){
//         setError(email,'Provide a valid email Address')
//     }
//     else{
//         success(email);
//     }
//     if(phoneValue=== ''){
//         setError(phone,'Phone Number is Required')
//     }
//     else{
//         success(phone);
//     }
//     if(passwordValue=== ''){
//         setError(password,'Password is Required')
//     }else if(passwordValue.lenght < 8){
//         setError(password,'Password must be at least 8 character ')
//     }
//     else{
//         success(password);
//     }
// }