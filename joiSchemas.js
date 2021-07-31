// Joi schemas are VALIDATION schemas, not Database schemas
const Joi = require('joi');

// Joi schema for required fields for parks
module.exports.parkSchema = Joi.object({
    park: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        price: Joi.number().min(0).allow(null, ''),
        image: Joi.string().allow(null, '')
    }).required(),
    deleteImages: Joi.array()
});

// Joi schema for required fields for reviews
module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        body: Joi.string().required()
    }).required()
});