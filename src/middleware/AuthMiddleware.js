var jwt = require("jsonwebtoken");

// Token verification middleware to protect a route
module.exports = function(req, res, next) {
  // Check for token in header or url parameters or post parameters
  var token = req.body.token || req.query.token || req.headers["x-access-token"];

  if (token) {
    // Verify secret and check expiration
    jwt.verify(token, req.app.get("tokenSecret"), function(err, decoded) {
      if (err) {
        return next(err);
      } else {
        // Make available to protected routes
        req.token = token;
        req.decoded = decoded;
        next();
      }
    });
  } else {
    return next({
      status: 400,
      message: "No token provided."
    });
  }
};