function guest(req,res,next){
    // if the user is not logged in then
    if(!req.isAuthenticated()){
        return next()
    }
    // if the user is logged in
    return res.redirect('/');

}

module.exports=guest