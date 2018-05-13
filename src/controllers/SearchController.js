var Content = require("../models/Content");

// Just search content for now
exports.search = function(req, res) {
  const searchRegex = req.query.q || {};
  const options = req.query.options || {};

  Content.find({
    $or: [
      { title: { $regex : new RegExp(searchRegex, "i") } },
      { body: { $regex : new RegExp(searchRegex, "i") } },
      { description: { $regex : new RegExp(searchRegex, "i") } }
    ],
    state: "published",
    ...options,
  })
  .populate('creators')
  .exec(function(err, data) {
    if (err) {
      console.log(err);
      res.json({
        success: false,
        message: JSON.stringify(err),
      });
    } else {
      res.json({
        success: true,
        payload: data,
      });
    }
  });
};