# calParks3

Full stack web app like Yelp, but for California parks instead of restaurants.

Users can register to create their account, create posts where they can upload pictures of parks, write a brief description of a park, add location of the park, and (if they choose) delete their post. With the location geocoder translates the location to latitude and longitude on a map using the Mapbox API. Yahoo Weather to display the location and weather in the post. In addition, logged in users can comment on other users' posts, but cannot delete others' posts or comments.

The frontend uses View EJS, Bootstrap, HTML, CSS. The backend uses Node.js with an Express server, Mongo database + Mongoose Object Relational Mapping (ORM) tool, Cloudinaryfor image upload and storage, Passport for security, calls to Mapbox API, Joi for validation, and a variety of different libraries for different features.