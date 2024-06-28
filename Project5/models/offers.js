const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const offerSchema = new Schema({
    item: {type: Schema.Types.ObjectId, ref:'Game'},
    user: {type: Schema.Types.ObjectId, ref:'User'},
    name: {type: Schema.Types.ObjectId, ref: 'User'},
    title: {type: Schema.Types.ObjectId, ref: 'Game'},
    amount: {type: Number, required: [true, 'Amount is required']},
    status: {type: String, enum: ['pending', 'rejected', 'accepted'], default: 'pending'}
});

module.exports = mongoose.model('Offer', offerSchema);
