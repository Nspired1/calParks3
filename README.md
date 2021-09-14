The frontend uses View EJS, Bootstrap, HTML, CSS. The backend uses Node.js with an Express server, Mongo database + Mongoose Object Relational Mapping (ORM) tool, Cloudinaryfor image upload and storage, Passport for security, calls to Mapbox API, Joi for validation, and a variety of different libraries for different features.

# Cal Parks

## :zap: Yelp-like app for California parks

- Simple fullstack app that shows a list of California parks with an EJS view engine and processed on the Express server. Parks are saved in a hosted Mongodb database, MongoDB Atlas.

## :page_facing_up: Table of Contents

- [:zap: Cal Parks](#zap-Cal-Parks)
  - [:page_facing_up: Table of Contents](#page_facing_up-table-of-contents)
  - [:books: General Info](#books-general-info)
  - [:microscope: Deep Dive](#microscope-deep-dive)
  - [:computer: Technologies](#computer-technologies)
  - [:floppy_disk: Setup](#floppy_disk-setup)
  - [:sunglasses: Features](#cool-features)
  - [:clap: Inspiration](#clap-inspiration)
  - [:envelope: Contact](#envelope-contact)

## :books: General Info

- A simple Yelp like app for California parks where users can register, login, and logout; full Create Read Update Delete (CRUD) functionality for making posts where users can write a brief description of a park, upload pictures of parks, and add location of the park. If they choose, they can delete their post. Also, users can post a rating of the park and leave comments, but users can comment on other users' posts, but cannot delete others' posts or comments.

With the location geocoder translates the location to latitude and longitude on a map using the Mapbox API. Yahoo Weather to display the location and weather in the post.

## :microscope: Deep Dive

- Uploading images takes more writing and research than just posting to the server and database. The form type is different, the html forms need to be `multipart/form-data` to send files. Multer middleware helps by adding a file (or files) object to the request object. The request object is received by the Express server, the file is uploaded to Cloudinary, and MongoDB holds the link. The reason for this is MongoDB isn't the best place to hold images, so a hosted cloud database like Cloudinary was needed.
- Joi validation does not work with files. So image uploads are problematic.
- Trying to address the lag in loading some images and split-second display of a small login and register form.

## :computer: Technologies

- [Node.js ](https://nodejs.org/en/)
- [Express server](https://expressjs.com/)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) for cloud hosted database
- [EJS View Engine](https://www.npmjs.com/package/ejs) for frontend user interface
- [Passport](https://www.npmjs.com/package/passport) for authentication
- [Passport Local](https://www.npmjs.com/package/passport-local) local username and password strategy
- [Cloudinary](https://cloudinary.com/) for hosted image storage
- [Multer](https://www.npmjs.com/package/multer) handling multipart/form-data, in this case, sending images
- [Mapbox](https://www.mapbox.com/) for cluster map and park location

## :floppy_disk: Setup

- Normally, the setup would be to clone this repo, change directory into it, then type `npm install`, however because of the environment variables for MongoDB Atlas, Cookie Session secret, etc, and the associated setup with those services the easiest method is click on the link to the Heroku site either [here](https://whispering-thicket-78456.herokuapp.com/) or below:

link: [https://whispering-thicket-78456.herokuapp.com/](https://whispering-thicket-78456.herokuapp.com/)

## :sunglasses: Features

- User register, login, and logout
- Create, Read, Update, & Delete (CRUD) posts
- User authorization: only the creator of a post can delete their post
- Image upload for parks using Cloudinary
- User rating (5-star) and comments for other parks
- Cluster map for all parks
- Map for individual park location

## :clap: Inspiration

- The inspiration for this app was Yelp and a few tutorials with an Express server, Passport, Mongoose, MongoDB Atlas, Mapbox, and Cloudinary.

## :envelope: Contact

- repo created by Don Spire [Nspired1](https://github.com/Nspired1), email: don.spire1@gmail.com
