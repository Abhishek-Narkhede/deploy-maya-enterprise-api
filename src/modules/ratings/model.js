const mongoose = require('mongoose');
const { Schema } = mongoose;

const ratingSchema = new Schema({
    productId: { type: Schema.Types.ObjectId, required: true },
    userId: { type: Schema.Types.ObjectId, required: true },
    rating: { type: Number, min: 0, max: 5, required: true }
}, { timestamps: true });

const Rating = mongoose.model('Rating', ratingSchema);

module.exports = Rating;