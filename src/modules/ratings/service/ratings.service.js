const Rating = require('../model');
const Product = require('../../products/model');

const rateProduct = async (ratingObj) => {
    try {
        const { userId, productId, rating } = ratingObj
        console.log("ratingObj", ratingObj);
        // Validate rating value
        if (rating < 0 || rating > 5) {
            throw new Error('Rating must be between 0 and 5');
        }

        let foundRating = await Rating.findOne({ productId, userId });

        console.log("foundRating", foundRating);
        if (foundRating) {
            // console.log("Inside", inside);
            foundRating.rating = rating;
        } else {
            // console.log("Inside", inside);
            foundRating = await Rating.create(ratingObj);
        }

        // Update product's average rating
        const result = await updateProductAverageRating(productId);
        console.log("result", result);
        return foundRating;
    } catch (error) {
        return { data: error.message, status: false, code: 500 };
    }
};

const updateProductAverageRating = async (productId) => {
    try {
        console.log("productId", productId);
        const avgRating = await calculateAverageRating(productId);

        const product = await Product.findByIdAndUpdate(
            productId,
            { avgRating },
            { new: true }
        );

        return { data: product, status: true, code: 200 };
    } catch (error) {
        return { data: error.message, status: false, code: 500 };
    }
};

const calculateAverageRating = async (productId) => {
    try {
        // Fetch all ratings for the product
        const ratings = await Rating.find({ productId });

        // If there are no ratings, set avgRating to 0
        if (ratings.length === 0) {
            return 0;
        }

        // Calculate the average rating
        const avgRating = ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;

        return avgRating;
    } catch (error) {
        throw new Error(`Error calculating average rating: ${error.message}`);
    }
};

const getAllRating = async () => {
    try {
        const rating = await Rating.find();
        if (!rating) {
            return { status: false, code: 404, rating: null };
        }
        return { status: true, code: 200, rating };
    } catch (error) {
        return { status: false, code: 500, rating: null, error: error.message };
    }
};

const getRatingByUserId = async (id) => {
    try {
        const rating = await Rating.find({ userId: id});
        if (!rating) {
            return { status: false, code: 404, rating: null };
        }
        return { status: true, code: 200, rating };
    } catch (error) {
        return { status: false, code: 500, rating: null, error: error.message };
    }
};

const updateRatingByUserId = async (userId, ratingObj) => {
    try {
        const rating = await Rating.findOneAndUpdate(
            { userId: userId }, // find the document with this userId
            ratingObj, // update it with this object
            { new: true } // return the updated document
        );

        if (!rating) {
            return { status: false, code: 404, rating: null, error: 'Rating not found' };
        }

        return { status: true, code: 200, rating };
    } catch (error) {
        return { status: false, code: 500, rating: null, error: error.message };
    }
};



module.exports = {
    rateProduct,
    getAllRating,
    getRatingByUserId,
    updateRatingByUserId
};