const express = require('express');
const offerRoutes = require('./offerRoutes');
const controller = require('../controllers/saleController');
const {isLoggedIn, isSeller} = require('../middlewares/auth');
const {validateId, validateSale, validateResult} = require('../middlewares/validator');

const router = express.Router();

// GET /sales: send all games to the user

router.get('/', controller.index);

//GET /sales/new: send html form for listing new games

router.get('/new', isLoggedIn, controller.new);

router.get('/search', controller.search);

// POST /sales: list a new game

router.post('/', isLoggedIn, validateSale, validateResult, controller.create);

//GET /sales/:id send details of game identified by id
router.get('/:id', validateId, controller.show);

//GET /sales/:id/edit: send html for editing an existing game listing
router.get('/:id/edit', isLoggedIn, validateId, isSeller, controller.edit);

//PUT /sales/:id: update game listing identified by id
router.put('/:id', isLoggedIn, validateId, isSeller, validateSale, validateResult, controller.update);

//DELETE /sales/:id: deletes game listing with specified id
router.delete('/:id', isLoggedIn, validateId, isSeller, controller.delete);

router.use('/:id/offers', offerRoutes);



module.exports = router;