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
// Mongoose Models
// =======================
var User = require("./models/User");
var Content = require("./models/Content");
var Event = require("./models/Event");
var Term = require("./models/Term");

// =======================
// Configuration
// =======================
var config = require("./config");
var port = process.env.PORT || 8080;
mongoose.connect(config.database);
app.set("superSecret", config.secret);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan("dev"));
app.use(cors());
app.options('*', cors()); // Enable CORS pre-flight across all routes

// =======================
// Routes
// =======================

// Basic route: homepage
app.get("/", function(req, res) {
  res.send("Hello! The Cortex API is at http://localhost:" + port + "/api");
});

var apiRoutes = express.Router();

// Route: Authenticate user and get token (POST http://localhost:8080/api/authenticate)
apiRoutes.post("/authenticate", function(req, res) {
  // TODO: REMOVE NEXT LINE
  /// Check if req contains the entry type (either app or dash)
  console.log(req);

  // Find user
  User.findOne({ email: req.body.email },
    function(err, user) {
      if (err) throw err;

      if (!user) {
        // Email not found
        res.json({
          success: false,
          message: "Authentication failed. Incorrect credentials."
        });
      } else if (user) {
        // Password mismatch
        if (user.password != req.body.password) {
          res.json({
            success: false,
            message: "Authentication failed. Incorrect credentials."
          });
        } else {
          // Create a token with only our given payload
          // Don't pass in the entire user, that has the password
          const payload = {
            name: user.name,
            email: user.email,
            role: user.role,
          };
          var token = jwt.sign(payload, app.get("superSecret"), {
            expiresIn: 86400 // Expires in 24 hours
          });
          // Return the information including token as JSON
          res.json({
            success: true,
            message: `Enjoy your ${user.role} token!`,
            token: token,
            ...payload,
          });
        }
      }
    }
  );
});

// Route middleware to verify a token
apiRoutes.use(function(req, res, next) {
  // Check for token in header or url parameters or post parameters
  var token = req.body.token || req.query.token || req.headers["x-access-token"];

  // Decode token
  if (token) {
    // Verifies secret and checks expiration
    jwt.verify(token, app.get("superSecret"), function(err, decoded) {
      if (err) {
        return res.json({
          success: false,
          message: "Failed to authenticate token."
        });
      } else {
        // If it's all good, save to request for use in other routes
        req.decoded = decoded;
        next();
      }
    });
  } else {
    // If there is no token, return an error
    return res.status(403).send({
      success: false,
      message: "No token provided."
    });
  }
});

// Show a message at (GET http://localhost:8080/api/)
apiRoutes.get("/", function(req, res) {
  res.json({ message: "Welcome to Cortex API!" });
});

// db.getCollection('users').find({})
// Route: Get all users (GET http://localhost:8080/api/users)
apiRoutes.get("/users", function(req, res) {
  User.find({}, function(err, users) {
    res.json(users);
  });
});

// Apply routes with the prefix /api
app.use("/api", apiRoutes);

// =======================
// Start the server
// =======================
app.listen(port);
console.log("Cortex API running at http://localhost:" + port);
