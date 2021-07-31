const Joi = require('joi');
const { reviewSchema, parkSchema } = require('./joiSchemas.js');
//const { reviewSchema } = require('./joiSchemas.js');
const ExpressError = require("./utils/ExpressError");
const Park = require("./models/park");
const Review = require("./models/review");


// Joi validation middleware for parks
module.exports.validatePark = (req, res, next) => {
    // const parkSchema = Joi.object({
    //     park: Joi.object({
    //         title: Joi.string().required(),
    //         description: Joi.string().required(),
    //         location: Joi.string().required(),
    //         price: Joi.number().min(0).allow(null, ''),
    //         image: Joi.string().allow(null, '')
    //     }).required()
    // });
    const { error } = parkSchema.validate(req.body);
    if (error){
        const msg = error.details.map(element => element.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

//  joi validation middleware
module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error){
        const msg = error.details.map(element => element.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}


// this is auth and validation middleware

module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You must be logged in.');
        return res.redirect('/login');
    }
    next();
}

// check for author of park middleware
module.exports.isAuthor = async(req, res, next) => {
    const { id } = req.params;
    const park = await Park.findById(id);
    if(!park.author.equals(req.user._id)){
        req.flash('error', 'You do not have permission to do that.');
        return res.redirect(`/parks/${id}`);
    }
    next();
}

module.exports.isReviewAuthor = async(req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if(!review.author.equals(req.user._id)){
        req.flash('error', 'You do not have permission to do that.');
        return res.redirect(`/parks/${id}`);
    }
    next();
}


