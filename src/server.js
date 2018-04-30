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
// `extended` determines which parsing library to use: true=qs, false=querystring
// https://stackoverflow.com/questions/29960764/what-does-extended-mean-in-express-4-0
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

// -----------------------
// Auth and Users (Unprotected)
// -----------------------

// Authenticate user and get token
apiRoutes.post("/authenticate", function(req, res) {
  const entry = req.body.entry || null; // expect 'dash' or 'app'

  User.findOne({ email: req.body.email },
    function(err, user) {
      if (err) {
        console.log(err);
        res.json({
          success: false,
          message: "Server error."
        });
      }

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
          if (entry === 'dash' && user.role !== 'admin') {
            // Only admins can enter dash
            res.json({
              success: false,
              message: "Authentication failed. You are not an admin."
            });
          } else {
            // Create a token with only our given payload
            // Don't pass in the entire user, that has the password
            const payload = {
              _id: user._id,
              name: user.name,
              email: user.email,
              role: user.role,
              entry,
            };
            var token = jwt.sign(payload, app.get("superSecret"), {
              expiresIn: 86400 // Expires in 24 hours
            });
            // Return the information including token as JSON
            res.json({
              success: true,
              message: `Enjoy your ${user.role} token!`,
              token,
              ...payload,
            });
          }
        }
      }
    }
  ).select("+password");
});

apiRoutes.post("/createUser", function(req, res) {
  const newUser = new User({ 
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    role: req.body.role,
  });

  newUser.save(function(err) {
    if (err) {
      console.log(err);
      res.status(500).send({
        success: false,
        message: "Server error."
      });
    } else {
      res.json({ success: true });
    }
  });
});

// -----------------------
// Contents (Unprotected)
// -----------------------

apiRoutes.get("/contents", function(req, res) {
  const query = req.query || {};

  Content.find({ ...query, state: "published" }, function(err, data) {
    if (err) {
      console.log(err);
      res.json({
        success: false,
        message: "Server error."
      });
    } else {
      res.json({
        success: true,
        payload: data,
      });
    }
  });
});

apiRoutes.get("/contents/:id", function(req, res) {
  Content.findById({ _id: req.params.id, state: "published" }, function(err, data) {
    if (err) {
      console.log(err);
      res.json({
        success: false,
        message: "Server error."
      });
    } else {
      res.json({
        success: true,
        payload: data,
      });
    }
  });
});

// -----------------------
// Terms (Unprotected)
// -----------------------

apiRoutes.get("/terms", function(req, res) {
  const query = req.query || {};

  Term.find(query, function(err, data) {
    if (err) {
      console.log(err);
      res.json({
        success: false,
        message: "Server error."
      });
    } else {
      res.json({
        success: true,
        payload: data,
      });
    }
  });
});

apiRoutes.get("/terms/:id", function(req, res) {
  Term.findById({ _id: req.params.id }, function(err, data) {
    if (err) {
      console.log(err);
      res.json({
        success: false,
        message: "Server error."
      });
    } else {
      res.json({
        success: true,
        payload: data,
      });
    }
  });
});

// -----------------------
// Middleware
// -----------------------

// Middleware to verify a token and protects routes below
apiRoutes.use(function(req, res, next) {
  // Check for token in header or url parameters or post parameters
  var token = req.body.token || req.query.token || req.headers["x-access-token"];

  if (token) {
    // Verify secret and check expiration
    jwt.verify(token, app.get("superSecret"), function(err, decoded) {
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

// =======================
// Protected Routes
// =======================

apiRoutes.get("/", function(req, res) {
  res.json({ message: "Token verified. Welcome to Cortex API!" });
});

// -----------------------
// Users (Protected)
// -----------------------

// Returns back user information with a given token
apiRoutes.get("/user", function(req, res) {
  res.json({
    success: true,
    message: `Enjoy your ${req.decoded.role} token!`,
    token: req.token,
    ...req.decoded,
  });
});

apiRoutes.get("/users", function(req, res) {
  const query = req.query || {};

  User.find(query, function(err, data) {
    if (err) {
      console.log(err);
      res.json({
        success: false,
        message: "Server error."
      });
    } else {
      res.json({
        success: true,
        payload: data,
      });
    }
  });
});

apiRoutes.get("/users/:id", function(req, res) {
  User.findById({ _id: req.params.id }, function(err, user) {
    if (err) {
      console.log(err);
      res.json({
        success: false,
        message: "Server error."
      });
    } else {
      res.json({
        success: false,
        payload: user,
      });
    }
  });
});

// -----------------------
// Contents (Protected)
// -----------------------

apiRoutes.get("/prot/contents", function(req, res) {
  const query = req.query || {};

  Content.find(query, function(err, data) {
    if (err) {
      console.log(err);
      res.json({
        success: false,
        message: "Server error."
      });
    } else {
      res.json({
        success: true,
        payload: data,
      });
    }
  });
});

apiRoutes.get("/prot/contents/:id", function(req, res) {
  Content.findById({ _id: req.params.id }, function(err, data) {
    if (err) {
      console.log(err);
      res.json({
        success: false,
        message: "Server error."
      });
    } else {
      res.json({
        success: true,
        payload: data,
      });
    }
  });
});

apiRoutes.post("/contents", function(req, res) {
  const newContent = new Content({ 
    ...req.body,
    publishTime: req.body.state === "published" ? new Date() : null,
  });

  newContent.save(function(err) {
    if (err) {
      console.log(err);
      res.status(500).send({
        success: false,
        message: "Server error."
      });
    } else {
      res.json({ success: true });
    }
  });
});

apiRoutes.put("/contents/:id", function(req, res) {
  const updatedContent = { 
    ...req.body,
    publishTime: req.body.state === "published" ? new Date() : null,
  };

  Content.findById({ _id: req.params.id }, function(err, foundContent) {
    if (err) {
      console.log(err);
      res.json({
        success: false,
        message: "Server error."
      });
    } else {
      foundContent.set(updatedContent);
      foundContent.save(function (err, updatedContent) {
        if (err) {
          console.log(err);
          res.json({
            success: false,
            message: "Server error."
          });
        } else {
          res.json({ success: true });
        }
      });
    }
  });
});

// -----------------------
// Terms (Protected)
// -----------------------

apiRoutes.post("/terms", function(req, res) {
  const newTerm = new Term({ 
    ...req.body,
  });

  newTerm.save(function(err) {
    if (err) {
      console.log(err);
      res.status(500).send({
        success: false,
        message: "Server error."
      });
    } else {
      res.json({ success: true });
    }
  });
});

apiRoutes.put("/terms/:id", function(req, res) {
  const updatedTerm = { 
    ...req.body,
  };

  Term.findById({ _id: req.params.id }, function(err, foundTerm) {
    if (err) {
      console.log(err);
      res.json({
        success: false,
        message: "Server error."
      });
    } else {
      foundTerm.set(updatedTerm);
      foundTerm.save(function (err, updatedTerm) {
        if (err) {
          console.log(err);
          res.json({
            success: false,
            message: "Server error."
          });
        } else {
          res.json({ success: true });
        }
      });
    }
  });
});

// Apply routes with the prefix /api
app.use("/api", apiRoutes);

// =======================
// Start the server
// =======================
app.listen(port);
console.log("Cortex API running at http://localhost:" + port);
