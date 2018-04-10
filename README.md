<h1 align="center">
  Cortex API
</h1>

API for Cortex Admin CMS for Grey Matters App and other science content/experience creators.

Below should give you enough instructions to get started.

## Todo

```
[ ] Move routes into own file

getUsers([userId])
  Find all in /users all users that match id, return [user objects]

getUser({ _id })
  GET /api/users/{id}
  Find in /users user that match id, return {user object}

getArticles(userId)
  Find all in /articles, writer in writers that match id

getBookmarks(userId)
  Use cases:
  - a user wants to see all their bookmarks
    GET /api/users/{id}/bookmarks
  - a user wants to see all their bookmarked articles
    GET /api/users/{id}/bookmarks?type=article
  - a user wants to see all their bookmarked podcasts
    GET /api/users/{id}/bookmarks?type=podcast
  - a user wants to see all their bookmarked videos
    GET /api/users/{id}/bookmarks?type=video

getBookmarks(contentId)
  Find all content in /content that match

countBookmarks(contentId)
  call getBookmarks(contentId), return length
```

## Dev Setup

### Dependencies

Install packages by running `npm install`.

### MongoDB

Install MongoDB. You can install on Mac using either Homebrew or manually. With Homebrew, run `brew update` and `brew install mongodb`.

Start up MongoDB by running `mongod`. You should see `waiting for connections on port 27017`.

Now you just need to connect to the service. Connect to it by running `mongo`. Here you can issue MongoDB commands.

In MongoDB, create the database for Cortex by running `use cortex-dev`.

### Config File

Create config file. Call it `config.js`. Inside, write:

```
module.exports = {
  secret: "banana",
  database: "mongodb://127.0.0.1:27017/cortex-dev"
};
```

## Run Server

Use nodemon to have the server restart on file changes. Install by running `npm install -g nodemon`. Then start up the Node server by running `npm start`.

## Dev Tools

### Robo 3T (Optional)

You can use [Robo 3T](https://robomongo.org/) to manage the database through a GUI.

In Robo 3T, set the address to `localhost` and the port to `27017`. Name the connection anything you want.


### POSTman (Optional)

You can use [POSTman](https://www.getpostman.com/) to test routes through a GUI.

## Misc

A quick explanation of the dependencies:

`express` is the Node framework<br>
`mongoose` is how we interact with our MongoDB database<br>
`morgan` logs requests to the console<br>
`body-parser` lets us get info from POST requests and URL parameters<br>
`jsonwebtoken` is how we create, sign, and verify JSON Web Tokens<br>
