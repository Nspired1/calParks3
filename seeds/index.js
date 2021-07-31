//self contained seeds file that will erase and repopulate database with parks

const mongoose = require("mongoose");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
const Park = require("../models/park");
const Review = require("../models/review");

// mongoose settings and connection
mongoose.connect("mongodb://localhost:27017/calparks3", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Connected to local Database");
});

// variable used to help make the title of a park
const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  //delete everything in database
  await Park.deleteMany({});
  await Review.deleteMany({});
  //loop over
  for (let i = 0; i < 5; i++) {
    const random40 = Math.floor(Math.random() * 5);
    const park = new Park({
      author:'6101aa949a4f165f51d7fd6e',
      location: `${cities[random40].city}, ${cities[random40].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      description:
        "Loran ipsum bacon brussel sprouts pie Infinite Frontier invisible kingdom far sector cloud city East of West.",
    });
    await park.save();
  }
};

// invoking the function that will actually seed the database
// to run seed file at command prompt at root dir write: node seeds/index.js
seedDB().then(() => {
  mongoose.connection.close();
  console.log("Closed connection to local database");
});
