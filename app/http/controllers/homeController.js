const Menu=require('../../models/menu');

function homeController(){
    return{
        async index(req,res){
         const drinks=await Menu.find()
         return res.render("home",{drinks:drinks});
        }
    }
}

module.exports=homeController