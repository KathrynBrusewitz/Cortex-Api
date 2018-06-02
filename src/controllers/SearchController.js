var Content = require("../models/Content");

// Just search content for now
exports.search = function(req, res, next) {
  const searchRegex = req.query.q || {};
  const options = req.query.options || {};

  if (req.decoded.entry === 'app') {
    options.state = "published";
  }

  Content.find({
    $or: [
      { title: { $regex : new RegExp(searchRegex, "i") } },
      { body: { $regex : new RegExp(searchRegex, "i") } },
      { description: { $regex : new RegExp(searchRegex, "i") } }
    ],
    ...options,
  })
  .deepPopulate('creators artists coverImage')
  .exec(function(err, data) {
    if (err) {
      return next(err);
    } else {
      res.json({
        success: true,
        payload: data,
      });
    }
  });
};