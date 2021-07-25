if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
  }

const express = require('express');
const app = express();
const path = require('path');
const morgan = require('morgan');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const engine = require('ejs-mate');
const Park = require("./models/park");
const Review = require("./models/review");
const catchAsync = require("./utils/catchAsync");
const ExpressError = require("./utils/ExpressError");
const Joi = require('joi');
const { reviewSchema } = require('./joiSchemas.js');

mongoose.connect('mongodb://localhost:27017/calparks3', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection ERROR:"));
db.once("open", () => {
    console.log("Database connected");
});

// set view engine
app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true }));

// use morgan logging library for development
app.use(morgan("dev"));

// env variables
const PORT = process.env.PORT || 3001;
const IP = process.env.IP;

// Joi validation
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

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error){
        const msg = error.details.map(element => element.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}


// ROUTES

// GET home page
app.get('/', (req, res) => {
    res.render('home');
});

// GET all parks
app.get('/parks', catchAsync(async (req, res)=>{
    const parks = await Park.find({});
    res.render('parks/index', {parks});
}));

// GET the NEW form
app.get('/parks/new', (req, res) => {
    res.render('parks/new');
});

// POST route to create a NEW park
app.post('/parks', validatePark, catchAsync(async(req, res) => {
    // server side error handling for invalid parks
    if(!req.body.park) throw new ExpressError('Invalid Park Data', 400);
    const park = new Park(req.body.park);
    await park.save();
    res.redirect(`/parks/${park._id}`);
}));

// GET single park SHOW
app.get('/parks/:id', catchAsync(async(req, res) => {
    const park = await Park.findById(req.params.id).populate('reviews');
    console.log(park)
    res.render('parks/show', { park });
}));

// EDIT form
app.get('/parks/:id/edit', catchAsync(async(req, res) => {
    const park = await Park.findById(req.params.id);
    res.render('parks/edit', { park } );
}));

// EDIT route
app.put('/parks/:id', catchAsync(async(req, res) => {
    const { id } = req.params;
    const park = await Park.findByIdAndUpdate(id, {...req.body.park});
    console.log(park);
    res.redirect(`/parks/${park._id}`);
}));

// DELETE
app.delete('/parks/:id', catchAsync(async(req, res) => {
    const { id } = req.params;
    await Park.findByIdAndDelete(id);
    res.redirect('/parks');
}));

// reviews routes

// POST a review
app.post('/parks/:id/reviews', validateReview, catchAsync(async(req, res) =>{
    const park = await Park.findById(req.params.id);
    const review = new Review(req.body.review);
    park.reviews.push(review);
    await review.save();
    await park.save();
    console.log(review);
    res.redirect(`/parks/${park._id}`)
}));

// DELETE a review
app.delete('/parks/:id/reviews/:reviewId', catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    // delete the reference in Park from array of references
    await Park.findByIdAndUpdate(id, {$pull: {reviews: reviewId }})
    // delete the review itself
    await Review.findByIdAndDelete(req.params.reviewId);
    res.redirect(`/parks/${id}`);

}))

// 
app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
});

// error handling
app.use((err, req, res, next) => {
    const { statusCode = 500} = err;
    if(!err.message) err.message = "Oh no. Something went wrong!"
    res.status(statusCode).render('error', { err });
})

// to start server at command prompt type: node app.js or nodemon app.js
app.listen(PORT, ()=> {
    console.log(`Server is started and listening on PORT: ${PORT} and IP: ${IP}`)
})
