const Sale = require('../models/sale');

//check if user is a guest.
exports.isGuest = (req, res, next)=>{
    if(!req.session.user) {
        return next();
    } else {
        req.flash('error', 'You are logged in already');
        return res.redirect('/users/profile');
    }
};

//check if user is authenticated
exports.isLoggedIn = (req, res, next)=> {
    if(req.session.user) {
        return next();
    } else {
        req.flash('error', 'You need to log in first');
        return res.redirect('/users/login');
    }
};

//check if user is seller of the game
exports.isSeller = (req, res, next) =>{
    let id = req.params.id;
    // if(!id.match(/^[0-9a-fA-F]{24}$/)) {
    //     let err = new Error('Invalid sale id');
    //     err.status = 400;
    //     return next(err);
    // }
    Sale.findById(id)
    .then(sale=>{
        if(sale) {
            if(sale.seller == req.session.user) {
                return next();
            } else {
                let err = new Error('Unauthorized to access the resource');
                err.status = 401;
                return next(err);
            }
        } else {
            let err = new Error('Cannot find a sale with id ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err=>next(err));
};

exports.isNotSeller = (req, res, next) =>{
    let id = req.params.id;
    // if(!id.match(/^[0-9a-fA-F]{24}$/)) {
    //     let err = new Error('Invalid sale id');
    //     err.status = 400;
    //     return next(err);
    // }
    Sale.findById(id)
    .then(sale=>{
        if(sale) {
            if(sale.seller == req.session.user) {
                let err = new Error('Unauthorized to access the resource');
                err.status = 401;
                return next(err);
            } else {
                return next();
            }
        } else {
            let err = new Error('Cannot find a sale with id ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err=>next(err));
};