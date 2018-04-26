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
// Unprotected Routes
// =======================

// Homepage
app.get("/", function(req, res) {
  res.send("Hello! The Cortex API is at http://localhost:" + port + "/api");
});

var apiRoutes = express.Router();

// Authenticate user and get token
apiRoutes.post("/authenticate", function(req, res) {
  const entry = req.body.entry || null; // expect 'dash' or 'app'

  User.findOne({ email: req.body.email },
    function(err, user) {
      if (err) throw err;

      if (!user) {
        // Email not found
        res.status(404).send({
          success: false,
          message: "Authentication failed. Incorrect credentials."
        });
      } else if (user) {
        // Password mismatch
        if (user.password != req.body.password) {
          res.status(404).send({
            success: false,
            message: "Authentication failed. Incorrect credentials."
          });
        } else {
          if (entry === 'dash' && user.role !== 'admin') {
            // Only admins can enter dash
            res.status(403).send({
              success: false,
              message: "Authentication failed. You are not an admin."
            });
          } else {
            // Create a token with only our given payload
            // Don't pass in the entire user, that has the password
            const payload = {
              name: user.name,
              email: user.email,
              role: user.role,
              entry: user.entry,
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
    }
  );
});

// Middleware to verify a token and protects routes below
apiRoutes.use(function(req, res, next) {
  // Check for token in header or url parameters or post parameters
  var token = req.body.token || req.query.token || req.headers["x-access-token"];

  console.log('route.use reached');

  // Decode token
  if (token) {
    // Verifies secret and checks expiration
    jwt.verify(token, app.get("superSecret"), function(err, decoded) {
      if (err) {
        res.json({
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
    res.status(403).send({
      success: false,
      message: "No token provided."
    });
  }
});

// =======================
// Protected Routes
// =======================

apiRoutes.get("/", function(req, res) {
  res.json({ message: "Token verified. Welcome to Cortex API!" });
});

apiRoutes.get("/users", function(req, res) {
  // req.params or req.query ????
  const query = req.params || {};
  User.find(query, function(err, users) {
    if (err) {
      res.status(500).send({
        success: false,
        message: "Server Error."
      });
    } else {
      res.json(users);
    }
  });
});

// apiRoutes.get("/users/:id", function(req, res) {
//   User.findById({ _id: req.params.id }, function(err, data) {
//     if (err) console.log(err);
//     res.json(data);
//   });
// });

// Apply routes with the prefix /api
app.use("/api", apiRoutes);

// =======================
// Start the server
// =======================
app.listen(port);
console.log("Cortex API running at http://localhost:" + port);
