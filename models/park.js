const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
  url: String,
  filename: String,
});

ImageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("/upload", "/upload/w_200");
});

const ParkSchema = new Schema(
  {
    title: String,
    price: Number,
    images: [ImageSchema],
    description: String,
    location: String,
    geometry: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
  },
  {
    toJSON: { virtuals: true }, //enables virtual properties to populate when converting to JSON
  }
);

// virtual schema for Mapbox. Populates park pin pop up info
// also by default Mongoose doesn't include virtuals when you convert to json.
// see above for toJSON
ParkSchema.virtual("properties.popUpMarkup").get(function () {
  return `<a href="/parks/${this._id}">${this.title}</a>
            <p>${this.description.substring(0, 20)}...</p>`;
});

// cascade delete for reviews when a Park is deleted
ParkSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Review.deleteMany({
      _id: {
        $in: doc.reviews,
      },
    });
  }
});

module.exports = mongoose.model("Park", ParkSchema);
