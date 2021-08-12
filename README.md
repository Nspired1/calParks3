# calParks3

Full stack web app like Yelp, but for California parks instead of restaurants.

Users can register to create their account, create posts where they can upload pictures of parks, write a brief description of a park, add location of the park, and (if they choose) delete their post. Other users can post reviews of that park, but (using Passport authentication) only the review author can delete it. Also, some users can be designated Administrators to moderate posts (edit and delete). With the location Geocoder translates the location to latitude and longitude on a map using the Mapbox API. Also, Mapbox enables the cluster map on the index page.

The frontend uses View EJS, Bootstrap, HTML, CSS. The backend uses Node.js with an Express server, Mongo database + Mongoose Object Relational Mapping (ORM) tool, Mongo Atlas for the cloud database, Cloudinaryfor image upload and storage, Passport for authorization & authentiation, Helmet for http header security, calls to Mapbox API, Joi for validation, Heroku for deployment, and a variety of different libraries for different features.

## deployment

Typically with a repo, you can download and type `npm install` and run it on a local machine. However, Cloudinary, Mapbox, and Mongo Atlas require tokens and for security purposes those tokens are not shared on GitHub.

To see the working app visit the link to the Heroku deployment: (https://whispering-thicket-78456.herokuapp.com/)
