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
const catchAsync = require("./util/catchAsync");

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

// ROUTES

app.get('/', (req, res) => {
    res.render('home');
});

// GET all parks
app.get('/parks', catchAsync(async (req, res)=>{
    const parks = await Park.find({});
    res.render('parks/index', {parks});
}));

// get the NEW form
app.get('/parks/new', (req, res) => {
    res.render('parks/new');
});

// POST route to create a NEW park
app.post('/parks', catchAsync(async(req, res) => {
    const park = new Park(req.body.park);
    await park.save();
    res.redirect(`/parks/${park._id}`);
}));

//GET single park
app.get('/parks/:id', catchAsync(async(req, res) => {
    const park = await Park.findById(req.params.id)
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

// error handling
app.use((err, req, res, next) => {
    res.send("Uh-oh, something went wrong!")
})

// to start server at command prompt type: node app.js or nodemon app.js
app.listen(PORT, ()=> {
    console.log(`Server is started and listening on PORT: ${PORT} and IP: ${IP}`)
})
