<h1 align="center">
  Cortex API
</h1>

API for Cortex Admin CMS for Grey Matters App and other science content/experience creators.

Below should give you enough instructions to get started.

## Dev Setup

### Dependencies

Install packages by running `npm install`.

### MongoDB

Install MongoDB. You can install on Mac using either Homebrew or manually. With Homebrew, run `brew update` and `brew install mongodb`.

Start up MongoDB by running `mongod`. You should see `waiting for connections on port 27017`.

Now you just need to connect to the service. Connect to it by running `mongo`. Here you can issue MongoDB commands.

In MongoDB, create the database for Cortex by running `use cortex-dev`.

### Config File

In `/src`, create config file. Call it `config.js`. Inside, write:

```
module.exports = {
  secret: "banana",
  database: "mongodb://127.0.0.1:27017/cortex-dev"
};
```

## Run Server

Use nodemon to have the server restart on file changes. Install globally by running `npm install -g nodemon`. Then start up the Node server by running `npm start`.

## Dev Tools

### Robo 3T (Optional)

You can use [Robo 3T](https://robomongo.org/) to manage the database through a GUI.

In Robo 3T, set the address to `localhost` and the port to `27017`. Name the connection anything you want.


### POSTman (Optional)

You can use [POSTman](https://www.getpostman.com/) to test routes through a GUI.

## Developer Notes

<i>To be organized into docs at a later time.</i>

A quick explanation of the dependencies:<br>
`express` is the Node framework<br>
`mongoose` is how we interact with our MongoDB database<br>
`morgan` logs requests to the console<br>
`body-parser` lets us get info from POST requests and URL parameters<br>
`jsonwebtoken` is how we create, sign, and verify JSON Web Tokens<br>


http://mongoosejs.com/docs/populate.html#query-conditions
```
Story.
  find(...).
  populate({
    path: 'fans',
    match: { age: { $gte: 21 }},
    // Explicitly exclude `_id`, see http://bit.ly/2aEfTdB
    select: 'name -_id',
    options: { limit: 5 }
  }).
  exec();
```

Route Examples
```
GET /api/content                                  get all content (note: app must only receive ?state=published)
  GET /api/content?type=article                   get all articles
  GET /api/content?type=podcast                   get all podcasts
  GET /api/content?type=video                     get all videos
  GET /api/content?type=article&state=published   get all published articles
GET /api/content/:id                              get content with id

GET /api/events
GET /api/events/:id

GET /api/terms
GET /api/terms/:id

GET /api/users
GET /api/users/:id
GET /api/users/:id/bookmarks                      get all bookmarks for a user
GET /api/users/:id/bookmarks?type=video           get all video bookmarks for a user

Same pattern across routes:
POST /api/{object}/
PUT /api/{object}/:id
DELETE /api/{object}/:id

// Controllers
getBookmarks(userId)

getBookmarks(contentId)
  Find all in /content that match

countBookmarks(contentId)
  Call getBookmarks(contentId), return length
```
