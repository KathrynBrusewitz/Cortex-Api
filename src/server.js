// =======================
// Packages
// =======================
var express = require("express");
var app = express();
var cors = require("cors");
var bodyParser = require("body-parser");
var morgan = require("morgan");
var mongoose = require("mongoose");

// =======================
// Configuration
// =======================
var config = require("./config");
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
var { verifyToken, verifyTokenForCodes } = require("./middleware/AuthMiddleware");
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

app.get("/", function(req, res) {
  res.send("Welcome to Cortex API, go to /1.0/ for version 1.0.");
});

api.get("/", function(req, res) {
  res.send("Welcome to Cortex API version 1.0.");
});

api.post("/login", AuthController.login);
api.get("/decode", verifyToken, AuthController.decode);
api.get("/me", verifyToken, UsersController.getMe);

api.post("/users", verifyToken, UsersController.postUser);
api.get("/users", verifyToken, UsersController.getUsers);
api.get("/users/:id", verifyToken, UsersController.getUser);
api.put("/users/:id", verifyToken, UsersController.putUser);
api.delete("/users/:id", verifyToken, UsersController.deleteUser);

api.get("/codes/invites", verifyTokenForCodes, CodesController.getInvites);
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
// https://github.com/Daplie/greenlock-express/issues/91
require('greenlock-express').create({
  version: 'draft-11',
  server: 'https://acme-v02.api.letsencrypt.org/directory',
  email: 'cortex.dash@gmail.com',
  agreeTos: true,
  configDir: require('path').join(require('os').homedir(), 'acme', 'etc'),
  approveDomains: ['cortexapi.com', 'www.cortexapi.com'],
  app: app,
}).listen(80, 443);
