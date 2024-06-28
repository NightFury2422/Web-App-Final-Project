const express = require('express');
const controller = require('../controllers/offerController');
const {isLoggedIn, isSeller, isNotSeller} = require('../middlewares/auth');
const {validateId, validateOffer, validateResult} = require('../middlewares/validator');

const router = express.Router({mergeParams: true});

// create new offer

router.post('/', validateId, isLoggedIn, isNotSeller, validateOffer, validateResult, controller.create);

// show all offers

router.get('/', isLoggedIn, isSeller, controller.veiw);

// accept an offer

router.post('/:offerId', isLoggedIn, isSeller, controller.accept);




module.exports = router;