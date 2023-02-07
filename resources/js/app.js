// importing axios from node module file
import axios from 'axios';
import Noty from 'noty';

let addtocart = document.querySelectorAll('.add-to-cart')
let cartCounter = document.querySelector('#cartCounter')


function updateCart(drink) {
    axios.post('/update-cart', drink).then(res => {
        cartCounter.innerText = res.data.totalQty;
        new Noty({
            type:'success',
            text: 'Added To Cart',
            timeout:500,
            progressBar:false

        }).show();
    }).catch(err =>{
        new Noty({
            type:'error',
            text: 'somthing Went Wrong',
            timeout:500,
            progressBar:false

        }).show();
    })
}


addtocart.forEach((btn) => {
    btn.addEventListener('click', (e) => {
        let drink = JSON.parse(btn.dataset.drink)
        updateCart(drink);
    })
})