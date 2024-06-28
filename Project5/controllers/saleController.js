const model = require('../models/sale');
const offer = require('../models/offers');
exports.index = (req, res, next)=>{
    //model.sortByPrice();
    model.find().sort({price: 1})
    .then(games=>res.render('./sale/index.ejs', {games}))
    .catch(err=>next(err));
    //console.log(games);
};


exports.new = (req, res)=>{
    res.render('./sale/new.ejs');
};


exports.create = (req, res, next)=>{
    let game = new model(req.body);
    game.seller = req.session.user;
    game.active = true;
    game.save()
    .then((game)=>{
        req.flash('success', 'Game listing created successfully');
        res.redirect('/sales');
    })
    .catch(err=>{
        if(err.name === 'ValidateError' ) {
            err.status = 400;
        }
        next(err);
    });
};

exports.search = (req, res, next)=>{
    let query = req.query;
    let search = Object.values(query);
    model.find({$and: [
        {active: true},
        {$or: [
            {title: {$regex : search[0], $options : 'i'}},
            {details: {$regex : search[0], $options : 'i'}}
        ]}
    ]}).sort({price: 1})
    .then(games=>res.render('./sale/search.ejs', {games}))
    .catch(err=>next(err));
};


exports.show = (req, res, next)=>{
    let id = req.params.id;
    // if(!id.match(/^[0-9a-fA-F]{24}$/)) {
    //     let err = new Error('Invalid game id');
    //     err.status = 400;
    //     return next(err);
    // }
    model.findById(id).populate('seller', 'firstName lastName')
    .then(game=>{
        if(game) {
            return res.render('./sale/show.ejs', {game});
        } else {
            let err = new Error('Cannot find game with id ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err=>next(err));
};


exports.edit = (req, res, next)=>{
    let id = req.params.id;

    model.findById(id)
    .then(game=>{
        return res.render('./sale/edit.ejs', {game});
    })
    .catch(err=>next(err));
};

exports.update = (req, res, next)=>{
    let game = req.body;
    let id = req.params.id;

    model.findByIdAndUpdate(id, game, {useFindAndModify: false, runValidators: true})
    .then(game=>{
        req.flash('success', 'game listing updated successfully');
        res.redirect('/sales/'+id);
    })
    .catch(err=> {
        if(err.name === 'ValidationError') {
            err.status = 400;
        }
        next(err)
    });
};

exports.delete = (req, res, next)=>{
    let id =req.params.id;
    Promise.all([model.findByIdAndDelete(id), offer.find({item: id})])
    .then(results=> {
        const [deleted, offers] = results;
        offers.forEach(offr=>{
            offer.findByIdAndDelete(offr.id)
            .then()
        })
        req.flash('success', 'game listing deleted successfully');
        res.redirect('/sales');
    })
    .catch(err=>next(err));
};