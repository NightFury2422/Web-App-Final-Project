const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const gameSchema = new Schema({
    title: {type: String, required: [true, 'title is required']},
    seller: {type: Schema.Types.ObjectId, ref:'User'},
    condition: {type: String, required: [true, 'Condition is required']},
    price: {type: Number, required: [true, 'Price is required']},
    details: {type: String, required: [true, 'details are required'],
              minLength: [10, 'the details should have at least 10 characters']},
    image: {type: String, required: [true, 'Image is required']},
    totalOffers: {type: Number, default: 0},
    highestOffer: {type: Number, default: 0},
    active: {type: Boolean}
});

module.exports = mongoose.model('Game', gameSchema);



// exports.sortByPrice = function() {
//     i = 0;
//     while (i < games.length){
//         j = 0;
//         games.forEach(game => {
//             if (j+ 1 < games.length){
//                 game1 = game;
//                 game2 = games[j + 1];
    
//                  if (game1.price > game2.price){
//                     temp = game1;
//                     games[j] = games[j + 1];
//                     games[j + 1] = temp;
    
//                 }
//             }
//            j = j + 1;
            
//         });
//         i = i + 1;
//     }
// }

// exports.findBySearch = function(search) {
//     searchGames = [];
//     games.forEach(game => {
//         if (game.title.includes(search) || game.details.includes(search)){
//             searchGames.push(game);
//         }
//     });
//     return searchGames;
// }