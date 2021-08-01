const express = require("express");
const router = express.Router();
const Park = require("../models/park");
const Review = require("../models/review");
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const Joi = require("joi");
const { isLoggedIn, isAuthor, validatePark } = require("../authMiddleware");
const multer = require("multer");
const { storage, cloudinary } = require("../cloudinary");
const upload = multer({ storage });
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

// GET all parks
router.get(
  "/",
  catchAsync(async (req, res) => {
    const parks = await Park.find({});
    res.render("parks/index", { parks });
  })
);

// GET the NEW form
router.get("/new", isLoggedIn, (req, res) => {
  res.render("parks/new");
});

// POST route to create a NEW park
router.post(
  "/",
  isLoggedIn,
  upload.array("image"),
  validatePark,
  catchAsync(async (req, res, next) => {
    const geoData = await geocoder
      .forwardGeocode({
        query: req.body.park.location,
        limit: 1,
      })
      .send();
    const park = new Park(req.body.park);
    park.geometry = geoData.body.features[0].geometry;
    park.images = req.files.map((file) => ({
      url: file.path,
      filename: file.filename,
    }));
    park.author = req.user._id;
    await park.save();
    req.flash("success", "Successfully made a new park!");
    res.redirect(`/parks/${park._id}`);
  })
);

// GET single park SHOW
router.get(
  "/:id",
  catchAsync(async (req, res) => {
    const park = await Park.findById(req.params.id)
      .populate({
        path: "reviews",
        populate: {
          path: "author",
        },
      })
      .populate("author");
    if (!park) {
      req.flash("error", "Park not found.");
      res.redirect("/parks");
    }
    res.render("parks/show", { park });
  })
);

// EDIT form
router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  upload.array("image"),
  catchAsync(async (req, res) => {
    const park = await Park.findById(req.params.id);
    if (!park) {
      req.flash("error", "Park not found.");
      res.redirect("/parks");
    }
    res.render("parks/edit", { park });
  })
);

// EDIT route
router.put(
  "/:id",
  isLoggedIn,
  isAuthor,
  upload.array("image"),
  validatePark,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const geoData = await geocoder
      .forwardGeocode({
        query: req.body.park.location,
        limit: 1,
      })
      .send();
    const updatedPark = await Park.findByIdAndUpdate(id, { ...req.body.park });
    updatedPark.geometry = geoData.body.features[0].geometry;
    const images = req.files.map((file) => ({
      url: file.path,
      filename: file.filename,
    }));
    updatedPark.images.push(...images);
    await updatedPark.save();
    if (req.body.deleteImages) {
      for (let filename of req.body.deleteImages) {
        await cloudinary.uploader.destroy(filename);
      }
      await updatedPark.updateOne({
        $pull: { images: { filename: { $in: req.body.deleteImages } } },
      });
    }
    req.flash("success", "Successfully updated park!");
    res.redirect(`/parks/${updatedPark._id}`);
  })
);

// DELETE
router.delete(
  "/:id",
  isLoggedIn,
  isAuthor,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const park = await Park.findById(id);
    park.images.map((image) => {
      cloudinary.uploader.destroy(image.filename);
    });
    await Park.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted park!");
    res.redirect("/parks");
  })
);

module.exports = router;
