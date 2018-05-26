var jwt = require("jsonwebtoken");
var User = require("../models/User");
var bcrypt = require('bcrypt');
const saltRounds = 10;

// Receive a token for API access
exports.login = function(req, res, next) {
  if (!req.body.entry) {
    return next({
      status: 400,
      message: "Entry field is missing in login request body."
    });
  }

  // Entry must be valid in order to be checked for query edge cases
  if (!['dash', 'app'].includes(req.body.entry)) {
    return next({
      status: 422,
      message: "Entry field is invalid in login request body."
    });
  }

  // If entering from app and has no email or password, return a token for basic API access
  if (!req.body.email && !req.body.password && req.body.entry === 'app') {
    const payload = {
      entry: req.body.entry,
    };
    // Create token with payload
    var token = jwt.sign(payload, req.app.get("tokenSecret"), {
      expiresIn: 86400 // Expires in 24 hours
    });

    return res.json({
      success: true,
      token,
      payload,
    });
  }

  // Otherwise, proceed login assuming it is for an existing user in userbase
  if (!req.body.email || !req.body.password) {
    return next({
      status: 400,
      message: "Email or password is missing in login request body."
    });
  }

  User.findOne({ email: req.body.email },
    function(err, user) {
      if (err) {
        return next(err);
      }
      // Email not found
      if (!user) {
        return next({
          status: 404,
          message: "Login failed. Incorrect credentials."
        });
      }
      // Password mismatch
      bcrypt.compare(req.body.password, user.password, function(err, isMatch) {
        if (err) {
          return next(err);
        }
        if (!isMatch) {
          return next({
            status: 404,
            message: "Login failed. Incorrect password."
          });
        }
        // Only admins can enter dash
        if (req.body.entry === 'dash' && !user.roles.includes('admin')) {
          return next({
            status: 404,
            message: "Login failed. You are not an admin."
          });
        }
        // Create payload
        const payload = {
          _id: user._id,
          entry: req.body.entry,
          name: user.name,
          roles: user.roles,
        };

        // Create token with payload
        var token = jwt.sign(payload, req.app.get("tokenSecret"), {
          expiresIn: 86400 // Expires in 24 hours
        });

        return res.json({
          success: true,
          token,
          payload,
        });
      });
    }
  ).select("+password");
};

// Given a token, returns token and decoded token information
exports.decode = function(req, res, next) {
  // Auth Middleware protects this route and provides decoded information in request
  // so no further action is needed here
  if (!req.token || !req.decoded) {
    return next({
      status: 400,
      message: 'Token login request body requires: token, decoded',
    });
  } else {
    res.json({
      success: true,
      token: req.token,
      payload: req.decoded,
    });
  }
};
