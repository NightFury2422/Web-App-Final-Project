const model = require('../models/offers');
const Sale = require('../models/sale');
const User = require('../models/user');

exports.create = (req, res, next)=>{
    let offer = new model(req.body);
    offer.user = req.session.user;
    offer.item = req.params.id;
    offer.title = req.params.id;
    offer.name = req.session.user;
    let id = req.params.id;
    offer.save()
    .then((offer)=>{
        Sale.findByIdAndUpdate(id, {$inc: {totalOffers: 1}, $max: {highestOffer: offer.amount}})
        .then(sale=>{
            req.flash('success', 'Offer listing created successfully');
            res.redirect('/sales/'+id);
        });
    })
    .catch(err=>{
        if(err.name === 'ValidateError' ) {
            err.status = 400;
        }
        next(err);
    });

    
};

exports.veiw = (req, res, next)=>{
    let id = req.params.id;
    Promise.all([Sale.findById(id), model.find({item: id}).populate('name', 'firstName lastName')])
    .then(results=>{
        const [sale, offers] = results;
        res.render('./offers/offers', {sale, offers});
    })
    .catch(err=>next(err));
};

exports.accept = (req, res, next)=>{
    let id = req.params.id;
    let offerId = req.params.offerId;

    Promise.all([Sale.findById(id), model.findById(offerId)])
    .then(results=>{
        const [sale, offer] = results;
        sale.active = false;
        offer.status = 'accepted';
        Promise.all([Sale.findByIdAndUpdate(id, sale), model.findByIdAndUpdate(offerId, offer), model.find({item: id})])
        .then(results=>{
            const [updatedSale, updatedOffer, offers] = results;
            offers.forEach(offr=>{
                if(offr.status != 'accepted'){
                    offr.status = 'rejected';
                    model.findByIdAndUpdate(offr.id, offr)
                    .then()
                }
            })
        })
        req.flash('success', 'Offer accepted successfully');
        res.redirect('/sales/'+id+'/offers');
    })
    .catch(err=>next(err));
};