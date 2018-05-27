var Content = require("../models/Content");

exports.getContents = function(req, res, next) {
  let query = req.query.q || {};

  // Can filter contents by id
  if (req.query.contentIds) {
    // If contentIds is empty, override default behavior of returning all contents
    if (req.query.contentIds.length() < 1) {
      return res.json({
        success: true,
        payload: {},
      });
    }
    query._id = { $in: req.query.contentIds };
  }

  // Can filter contents by type
  if (req.query.type) {
    // Make sure type is an array first
    req.query.type = Array.isArray(req.query.type) ? req.query.type : [req.query.type];
    query.type = { $in: req.query.type };
  }

  // App can only get published content
  if (req.decoded.entry === 'app') {
    query.state = 'published';
  }

  Content.find(query)
  .deepPopulate('creators artists')
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

exports.getContent = function(req, res, next) {
  Content.findById(req.params.id)
  .deepPopulate('creators artists')
  .exec(function(err, data) {
    if (!data) {
      return next({
        status: 404,
        message: 'Content not found.',
      });
    }
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

exports.postContent = function(req, res, next) {
  const newContent = new Content({ 
    ...req.body,
    publishTime: req.body.state === "published" ? new Date() : null,
  });

  newContent.save(function(err, savedContent) {
    if (err) {
      return next(err);
    } else {
      res.json({
        success: true,
        payload: savedContent,
      });
    }
  });
};

exports.putContent = function(req, res, next) {
  Content.findById(req.params.id, function(err, foundContent) {
    if (err) {
      return next(err);
    } else {
      if (!foundContent) {
        return next({
          status: 404,
          message: 'Content not found.',
        });
      }
      // How should publish time be updated?
      let newPublishTime = req.body.state === "unpublished" ? null : new Date();

      newPublishTime = (foundContent.state === req.body.state 
        && req.body.state === "published")
        ? foundContent.publishTime 
        : newPublishTime;

      const updatedContent = {
        ...req.body,
        updateTime: new Date(),
        publishTime: newPublishTime,
      };
      foundContent.set(updatedContent);
      foundContent.save(function (err, savedContent) {
        if (err) {
          return next(err);
        } else {
          res.json({
            success: true,
            payload: savedContent,
          });
        }
      });
    }
  });
};

exports.deleteContent = function(req, res, next) {
  if (!req.decoded.entry === 'dash') {
    return next({
      status: 403,
      message: 'Token is valid, but you need to be logged into the dash to delete.'
    });
  }
  Content.findByIdAndRemove(req.params.id, function(err, deletedContent) {
    if (!deletedContent) {
      return next({
        status: 404,
        message: 'Content not found.',
      });
    }
    if (err) {
      return next(err);
    } else {
      res.json({
        success: true,
        payload: deletedContent,
      });
    }
  });
};
