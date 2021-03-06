const express = require("express")
const router = express.Router({ mergeParams: true });
const Park = require("../models/park");
const Review = require("../models/review");
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const Joi = require('joi');
const { reviewSchema } = require('../joiSchemas.js');
const { validateReview, isLoggedIn, isReviewAuthor } = require('../authMiddleware');


// reviews routes

// POST a review
router.post('/', isLoggedIn, validateReview, catchAsync(async(req, res) =>{
    const park = await Park.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    park.reviews.push(review);
    await review.save();
    await park.save();
    req.flash('success', "Successfully created a new review!")
    res.redirect(`/parks/${park._id}`)
}));

// DELETE a review
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    // delete the reference in Park from array of references
    await Park.findByIdAndUpdate(id, {$pull: {reviews: reviewId }})
    // delete the review itself
    await Review.findByIdAndDelete(req.params.reviewId);
    req.flash('success', "Successfully deleted review!")
    res.redirect(`/parks/${id}`);

}))

module.exports = router;