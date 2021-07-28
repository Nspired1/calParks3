if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
  }

const express = require('express');
const app = express();
const path = require('path');
const session = require('express-session');
const flash = require("connect-flash");
const passport = require('passport');
const LocalStrategy = require("passport-local");
const User = require('./models/user');
const methodOverride = require('method-override');
const engine = require('ejs-mate');
const mongoose = require('mongoose');
const Park = require("./models/park");
const Review = require("./models/review");
const catchAsync = require("./utils/catchAsync");
const ExpressError = require("./utils/ExpressError");
const Joi = require('joi');
const { reviewSchema } = require('./joiSchemas.js');
const morgan = require('morgan');
const parkRoutes = require('./routes/parks');
const reviewRoutes = require("./routes/reviews");
const userRoutes = require('./routes/users');


mongoose.connect('mongodb://localhost:27017/calparks3', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
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

// use method override for put, patch, delete
app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true }));

// use static assets
app.use(express.static(path.join(__dirname, 'public')));

// configure cookie session
const sessionConfig = {
    secret: 'onlyfordevelopment',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig));

// user authorization and authentication with passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// use flash
app.use(flash());
app.use((req, res, next ) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

// use morgan logging library for development
app.use(morgan("dev"));

// env variables
const PORT = process.env.PORT || 3001;
const IP = process.env.IP;

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


// ROUTES

app.use("/parks", parkRoutes);
app.use("/parks/:id/reviews", reviewRoutes);
app.use("/", userRoutes);

// GET home page
app.get('/', (req, res) => {
    res.render('home');
});

// handle non-existent pages
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
