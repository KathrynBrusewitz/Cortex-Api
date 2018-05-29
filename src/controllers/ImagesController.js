var Image = require("../models/Image");

exports.getImages = function(req, res, next) {
  let query = req.query.q || {};

  Image.find(query, function(err, data) {
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

exports.getImage = function(req, res, next) {
  Image.findById(req.params.id, function(err, data) {
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

exports.postImage = function(req, res, next) {
  const newImage = new Image({ 
    ...req.body,
  });

  newImage.save(function(err, savedImage) {
    if (err) {
      return next(err);
    } else {
      res.json({
        success: true,
        payload: savedImage,
      });
    }
  });
};

exports.putImage = function(req, res, next) {
  Image.findById(req.params.id, function(err, foundImage) {
    if (err) {
      return next(err);
    } else {
      const updatedImage = {
        ...req.body,
      };
      foundImage.set(updatedImage);
      foundImage.save(function (err, updatedImage) {
        if (err) {
          return next(err);
        } else {
          res.json({
            success: true,
            payload: updatedImage,
          });
        }
      });
    }
  });
};

exports.deleteImage = function(req, res, next) {
  Image.findByIdAndRemove(req.params.id, function(err, deletedImage) {
    if (err) {
      return next(err);
    } else {
      res.json({
        success: true,
        payload: deletedImage,
      });
    }
  });
};
