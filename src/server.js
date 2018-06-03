// =======================
// Packages
// =======================
var express = require("express");
var app = express();
var cors = require("cors");
var bodyParser = require("body-parser");
var morgan = require("morgan");
var mongoose = require("mongoose");
var jwt = require("jsonwebtoken");
// https://stackoverflow.com/questions/45515251/how-to-redirect-http-to-https-for-a-reactjs-spa-behind-aws-elb
const path = require('path');
const util = require('util');

// =======================
// Configuration
// =======================
var config = require("./config");
var port = 8080;
mongoose.connect(config.database);
app.set("tokenSecret", config.tokenSecret);
app.set("AWS_ACCESS_KEY_ID", config.AWS_ACCESS_KEY_ID);
app.set("AWS_SECRET_ACCESS_KEY", config.AWS_SECRET_ACCESS_KEY);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan("dev"));
app.use(cors());
app.options("*", cors());

// =======================
// Middleware
// =======================
var verifyToken = require("./middleware/AuthMiddleware");
var handleError = require("./middleware/ErrorMiddleware");

// =======================
// Routing
// =======================
var api = express.Router();
var AuthController = require("./controllers/AuthController.js");
var SearchController = require("./controllers/SearchController.js");
var ContentsController = require("./controllers/ContentsController.js");
var EventsController = require("./controllers/EventsController.js");
var UsersController = require("./controllers/UsersController.js");
var TermsController = require("./controllers/TermsController.js");
var CodesController = require("./controllers/CodesController.js");
var ImagesController = require("./controllers/ImagesController.js");

/**
 * Identifies requests from clients that use http(unsecure) and
 * redirects them to the corresponding https(secure) end point.
 *
 * Identification of protocol is based on the value of non
 * standard http header 'X-Forwarded-Proto', which is set by
 * the proxy(in our case AWS ELB).
 * - when the header is undefined, it is a request sent by
 * the ELB health check.
 * - when the header is 'http' the request needs to be redirected
 * - when the header is 'https' the request is served.
 *
 * @param req the request object
 * @param res the response object
 * @param next the next middleware in chain
 */
const redirectionFilter = function (req, res, next) {
  const theDate = new Date();
  const receivedUrl = `${req.protocol}:\/\/${req.hostname}:${port}${req.url}`;

  if (req.get('X-Forwarded-Proto') === 'http') {
    const redirectTo = `https:\/\/${req.hostname}${req.url}`;
    console.log(`${theDate} Redirecting ${receivedUrl} --> ${redirectTo}`);
    res.redirect(301, redirectTo);
  } else {
    next();
  }
};

api.get("/*", redirectionFilter);

api.post("/login", AuthController.login);
api.get("/decode", verifyToken, AuthController.decode);
api.get("/me", verifyToken, UsersController.getMe);

api.post("/users", verifyToken, UsersController.postUser);
api.get("/users", verifyToken, UsersController.getUsers);
api.get("/users/:id", verifyToken, UsersController.getUser);
api.put("/users/:id", verifyToken, UsersController.putUser);
api.delete("/users/:id", verifyToken, UsersController.deleteUser);

api.get("/codes/invites", verifyToken, CodesController.getInvites);
api.post("/codes/invites", verifyToken, CodesController.postInvite);
api.post("/codes/resets", CodesController.postReset);
api.delete("/codes/invites/:id", verifyToken, CodesController.deleteInvite);

api.get("/contents", verifyToken, ContentsController.getContents);
api.get("/contents/:id", verifyToken, ContentsController.getContent);
api.post("/contents", verifyToken, ContentsController.postContent);
api.put("/contents/:id", verifyToken, ContentsController.putContent);
api.delete("/contents/:id", verifyToken, ContentsController.deleteContent);

api.get("/terms", verifyToken, TermsController.getTerms);
api.get("/terms/:id", verifyToken, TermsController.getTerm);
api.post("/terms", verifyToken, TermsController.postTerm);
api.put("/terms/:id", verifyToken, TermsController.putTerm);
api.delete("/terms/:id", verifyToken, TermsController.deleteTerm);

api.get("/events", verifyToken, EventsController.getEvents);
api.get("/events/:id", verifyToken, EventsController.getEvent);
api.post("/events", verifyToken, EventsController.postEvent);
api.put("/events/:id", verifyToken, EventsController.putEvent);
api.delete("/events/:id", verifyToken, EventsController.deleteEvent);

api.get("/images", verifyToken, ImagesController.getImages);
api.get("/images/:id", verifyToken, ImagesController.getImage);
api.post("/images", verifyToken, ImagesController.postImage);
api.put("/images/:id", verifyToken, ImagesController.putImage);
api.delete("/images/:id", verifyToken, ImagesController.deleteImage);

api.get("/search", verifyToken, SearchController.search);

api.use(handleError);
app.use("/1.0", api);

// =======================
// Start the server
// =======================
app.listen(port);
console.log("Cortex is running on port " + port);
