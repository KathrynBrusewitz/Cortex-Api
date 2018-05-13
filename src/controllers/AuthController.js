var jwt = require("jsonwebtoken");
var User = require("../models/User");

// Authenticate user and get token
exports.login = function(req, res) {
  const entry = req.body.entry || null; // expect 'dash' or 'app'

  User.findOne({ email: req.body.email },
    function(err, user) {
      if (err) {
        return res.json({
          success: false,
          message: JSON.stringify(err),
        });
      }
      // Email not found
      if (!user) {
        return res.json({
          success: false,
          message: "Authentication failed. Incorrect credentials."
        });
      }
      // Password mismatch
      if (user.password != req.body.password) {
        return res.json({
          success: false,
          message: "Authentication failed. Incorrect credentials."
        });
      }
      // Only admins can enter dash
      if (entry === 'dash' && user.role !== 'admin') {
        return res.json({
          success: false,
          message: "Authentication failed. You are not an admin."
        });
      }
      // Create a token with only our given payload
      // Don't pass in the entire user, that has the password
      const payload = {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        bookmarks: user.bookmarks,
        notes: user.notes,
        entry,
      };

      var token = jwt.sign(payload, req.app.get("tokenSecret"), {
        expiresIn: 86400 // Expires in 24 hours
      });

      // Return the information including token as JSON
      res.json({
        success: true,
        token,
        ...payload,
      });
    }
  ).select("+password");
};

exports.register = function(req, res) {
  const { name, email, password, role } = req.body;
  const newUser = new User({ name, email, password, role });

  newUser.save(function(err) {
    if (err) {
      res.status(500).send({
        success: false,
        message: JSON.stringify(err),
      });
    } else {
      res.json({ success: true });
    }
  });
};

// Returns back user information with a given token
exports.tokenLogin = function(req, res) {
  if (!req.token || !req.decoded) {
    res.json({
      success: false,
      message: 'AuthController.tokenLogin requires req.token and req.decoded',
    });
  } else {
    res.json({
      success: true,
      token: req.token,
      ...req.decoded,
    });
  }
};
