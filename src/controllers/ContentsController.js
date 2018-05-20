var Content = require("../models/Content");

exports.getContents = function(req, res) {
  // Build query:
  //   If req.query has contentIds, then build query just with that
  //   If not, then build query as usual
  let query = req.query || {};

  if (req.query.contentIds) {
    // If contentIds is an empty array, override default behavior of returning all contents
    // Instead return empty payload
    if (req.query.contentIds.length() < 1) {
      return res.json({
        success: true,
        payload: {},
      });
    }
    query = { _id: { $in: req.query.contentIds } };
  }

  Content.find({ ...query, state: "published" })
  .populate('creators')
  .exec(function(err, data) {
    if (err) {
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

exports.getContent = function(req, res) {
  Content.findById({ _id: req.params.id, state: "published" }, function(err, data) {
    if (err) {
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

exports.getProtectedContents = function(req, res) {
  const query = req.query || {};

  console.log(req.decoded); // req.decoded.entry = 'dash'
  
  Content.find({ ...query })
  .populate('creators')
  .exec(function(err, data) {
    if (err) {
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

exports.getProtectedContent = function(req, res) {
  Content.findById({ _id: req.params.id }, function(err, data) {
    if (err) {
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

exports.postContent = function(req, res) {
  const newContent = new Content({ 
    ...req.body,
    publishTime: req.body.state === "published" ? new Date() : null,
  });

  newContent.save(function(err) {
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

exports.putContent = function(req, res) {
  Content.findById({ _id: req.params.id }, function(err, foundContent) {
    if (err) {
      res.json({
        success: false,
        message: JSON.stringify(err),
      });
    } else {
      // How should publish time be updated?
      let newPublishTime = req.body.state === "unpublished" ? null : new Date();
      newPublishTime = foundContent.state === req.body.state && req.body.state === "published"
        ? foundContent.publishTime 
        : newPublishTime;

      const updatedContent = {
        ...req.body,
        updateTime: new Date(),
        publishTime: newPublishTime,
      };
      foundContent.set(updatedContent);
      foundContent.save(function (err, updatedContent) {
        if (err) {
          res.json({
            success: false,
            message: JSON.stringify(err),
          });
        } else {
          res.json({
            success: true,
            payload: updatedContent,
          });
        }
      });
    }
  });
};

exports.deleteContent = function(req, res) {
  Content.findByIdAndRemove({ _id: req.params.id }, function(err) {
    if (err) {
      res.json({
        success: false,
        message: JSON.stringify(err),
      });
    } else {
      res.json({
        success: true,
      });
    }
  });
};
