var jwt = require("jsonwebtoken");
var User = require("../models/User");

// Authenticate user and get token
exports.login = function(req, res) {
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

            var token = jwt.sign(payload, req.app.get("superSecret"), {
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
};

exports.register = function(req, res) {
  const { name, email, password, role } = req.body;
  const newUser = new User({ name, email, password, role });

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
};

// Returns back user information with a given token
exports.tokenLogin = function(req, res) {
  res.json({
    success: true,
    message: `Enjoy your ${req.decoded.role} token!`,
    token: req.token,
    ...req.decoded,
  });
};
