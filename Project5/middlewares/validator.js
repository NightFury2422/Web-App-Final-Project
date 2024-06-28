const Sale = require('../models/sale');
const {body} = require('express-validator');
const {validationResult} = require('express-validator');
exports.validateId = (req, res, next)=> {
    let id = req.params.id;
    if(!id.match(/^[0-9a-fA-F]{24}$/)) {
        let err = new Error('Invalid sale id');
        err.status = 400;
        return next(err);
    } else {
        return next();
    }
};

exports.validateSignUp = [body('firstName', 'First name cannot be empty.').notEmpty().trim().escape(),
body('lastName', 'Last name cannot be empty.').notEmpty().trim().escape(),
body('email', 'Email must be a valid email address.').isEmail().trim().escape().normalizeEmail(),
body('password', 'Password must be at least 8 characters and at most 64 characters.').isLength({min: 8, max: 64})];

exports.validateLogIn = [body('email', 'Email must be a valid email address.').isEmail().trim().escape().normalizeEmail(),
body('password', 'Password must be at least 8 characters and at most 64 characters.').isLength({min: 8, max: 64})];

exports.validateResult = (req, res, next) => {
    let errors = validationResult(req);
    if(!errors.isEmpty()){
        errors.array().forEach(error=>{
            req.flash('error', error.msg);
        });
        return res.redirect('back');
    } else {
        return next();
    }
}

exports.validateSale = [body('title', 'Title cannot be empty.').notEmpty().trim().escape(),
// body('seller').trim(),
body('condition', 'Condition cannot be empty or an invalid input.').notEmpty().isIn(['New','Used','Pre-owned','Poor','Damaged']).trim().escape(),
body('price', 'Price cannot be empty or less than 0.1.').notEmpty().isInt({min: .1}).trim().escape(),
body('details', 'Details cannot be empty or less than 10 characters in length.').notEmpty().isLength({min: 10}).trim().escape(),
body('image', 'You have to submit a cover image.').notEmpty().trim().escape(),
// body('totalOffers').trim(), it gets mad with these being active and wont display the default 0 value
// body('highestOffer').trim(),
body('active').trim()];

exports.validateOffer = [body('item').trim(),
body('user').trim(),
body('name').trim(),
body('title').trim(),
// this line below cannot use escape because it breaks the website where you cannot accept a offer as all offers are set to rejected.
// I have no idea why this happens i tried so many different things to fix it and couldnt do it so I just got rid of escape, now it works again
body('amount', 'Amount cannot be empty or less than 0.1.').notEmpty().isInt({min: .1}).trim()];
// body('status').isIn(['pending', 'rejected', 'accepted']) this for some reason did not work, and for the life of me I don't know why.
// I used to have trim on this as well but it broke the code by seemingly getting rid of the default value set for this field. Why? I dont know.