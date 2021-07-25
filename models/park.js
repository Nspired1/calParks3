const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;

const ParkSchema = new Schema({
    title: String,
    price: Number,
    image: String,
    description: String,
    location: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});

// cascade delete for reviews when a Park is deleted
ParkSchema.post('findOneAndDelete', async function(doc){
    if(doc){
        await Review.deleteMany({
            _id : {
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Park', ParkSchema);