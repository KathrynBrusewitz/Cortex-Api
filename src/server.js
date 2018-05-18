// =======================
// Packages
// =======================
var express = require("express");
var app = express();
var cors = require('cors');
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
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan("dev"));
app.use(cors());
app.options('*', cors());

// =======================
// Routing
// =======================
var api = express.Router();
var SearchController = require('./controllers/SearchController.js');
var ContentsController = require('./controllers/ContentsController.js');
var AuthController = require('./controllers/AuthController.js');
var EventsController = require('./controllers/EventsController.js');
var UsersController = require('./controllers/UsersController.js');
var TermsController = require('./controllers/TermsController.js');

app.get("/", function(req, res) {
  res.send(`Cortex API available on port ${port}`);
});

api.post("/authenticate", AuthController.login);
api.post("/createUser", AuthController.register);
api.get("/search", SearchController.search);

api.get('/contents', ContentsController.getContents);
api.get("/contents/:id", ContentsController.getContent);

api.get("/terms", TermsController.getTerms);
api.get("/terms/:id", TermsController.getTerm);

api.get("/events", EventsController.getEvents);
api.get("/events/:id", EventsController.getEvent);

// Token Verification Middleware, protects routes below
api.use(function(req, res, next) {
  // Check for token in header or url parameters or post parameters
  var token = req.body.token || req.query.token || req.headers["x-access-token"];

  if (token) {
    // Verify secret and check expiration
    jwt.verify(token, app.get("tokenSecret"), function(err, decoded) {
      if (err) {
        console.log(err);
        res.json({
          success: false,
          message: "Failed to authenticate token."
        });
      } else {
        // Make available to Protected Routes
        req.token = token;
        req.decoded = decoded;
        next();
      }
    });
  } else {
    res.json({
      success: false,
      message: "No token provided."
    });
  }
});

api.get("/", function(req, res) {
  res.json({ message: "Token verified. Welcome to Cortex API!" });
});

api.get("/user", AuthController.tokenLogin);

api.get("/users", UsersController.getUsers);
api.get("/users/:id", UsersController.getUser);
api.post("/users", UsersController.postUser);
api.put("/users/:id", UsersController.putUser);
api.delete("/users/:id", UsersController.deleteUser);
api.post("/users/invite", UsersController.inviteUser);

api.get("/prot/contents", ContentsController.getProtectedContents);
api.get("/prot/contents/:id", ContentsController.getProtectedContent);
api.post("/contents", ContentsController.postContent);
api.put("/contents/:id", ContentsController.putContent);
api.delete("/contents/:id", ContentsController.deleteContent);

api.post("/terms", TermsController.postTerm);
api.put("/terms/:id", TermsController.putTerm);
api.delete("/terms/:id", TermsController.deleteTerm);

api.post("/events", EventsController.postEvent);
api.put("/events/:id", EventsController.putEvent);
api.delete("/events/:id", EventsController.deleteEvent);

// Apply routes with the prefix /api
app.use("/api", api);

// =======================
// Start the server
// =======================
app.listen(port);
console.log("Cortex API running at http://localhost:" + port);
