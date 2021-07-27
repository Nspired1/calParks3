const express = require('express');
const router = express.Router();
const Park = require("../models/park");
const Review = require("../models/review");
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const Joi = require('joi');
const { reviewSchema } = require('../joiSchemas.js');

// Joi validation middleware
const validatePark = (req, res, next) => {
    const parkSchema = Joi.object({
        park: Joi.object({
            title: Joi.string().required(),
            description: Joi.string().required(),
            location: Joi.string().required(),
            price: Joi.number().min(0).allow(null, ''),
            image: Joi.string().allow(null, '')
        }).required()
    })
    const { error } = parkSchema.validate(req.body);
    if (error){
        const msg = error.details.map(element => element.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

// GET all parks
router.get('/', catchAsync(async (req, res)=>{
    const parks = await Park.find({});
    res.render('parks/index', {parks});
}));

// GET the NEW form
router.get('/new', (req, res) => {
    res.render('parks/new');
});

// POST route to create a NEW park
router.post('/', validatePark, catchAsync(async(req, res) => {
    // server side error handling for invalid parks
    if(!req.body.park) throw new ExpressError('Invalid Park Data', 400);
    const park = new Park(req.body.park);
    await park.save();
    res.redirect(`/parks/${park._id}`);
}));

// GET single park SHOW
router.get('/:id', catchAsync(async(req, res) => {
    const park = await Park.findById(req.params.id).populate('reviews');
    console.log(park)
    res.render('parks/show', { park });
}));

// EDIT form
router.get('/:id/edit', catchAsync(async(req, res) => {
    const park = await Park.findById(req.params.id);
    res.render('parks/edit', { park } );
}));

// EDIT route
router.put('/:id', catchAsync(async(req, res) => {
    const { id } = req.params;
    const park = await Park.findByIdAndUpdate(id, {...req.body.park});
    console.log(park);
    res.redirect(`/parks/${park._id}`);
}));

// DELETE
router.delete('/:id', catchAsync(async(req, res) => {
    const { id } = req.params;
    await Park.findByIdAndDelete(id);
    res.redirect('/parks');
}));

module.exports = router;