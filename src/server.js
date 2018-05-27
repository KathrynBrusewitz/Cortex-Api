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

// =======================
// Configuration
// =======================
var config = require("./config");
var port = process.env.PORT || 8080;
mongoose.connect(config.database);
app.set("tokenSecret", config.tokenSecret);
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

api.post("/login", AuthController.login);
api.post("/users/reset", UsersController.resetPassword);
api.get("/decode", verifyToken, AuthController.decode);
api.get("/me", verifyToken, UsersController.getMe);

api.post("/users", verifyToken, UsersController.postUser);
api.get("/users", verifyToken, UsersController.getUsers);
api.get("/users/:id", verifyToken, UsersController.getUser);
api.put("/users/:id", verifyToken, UsersController.putUser);
api.delete("/users/:id", verifyToken, UsersController.deleteUser);
api.post("/users/invite", verifyToken, UsersController.inviteUser);

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

api.get("/search", verifyToken, SearchController.search);

api.use(handleError);
app.use("/1.0", api);

// =======================
// Start the server
// =======================
app.listen(port);
console.log("Cortex is running on port " + port);
