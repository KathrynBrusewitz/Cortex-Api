var Image = require("../models/Image");
var uuidv4 = require('uuid/v4');
var multer = require("multer");
var upload = multer().single("image");
var AWS = require('aws-sdk');

exports.getImages = function(req, res, next) {
  let query = req.query.q || {};

  Image.find(query)
  .deepPopulate('artists')
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

exports.getImage = function(req, res, next) {
  Image.findById(req.params.id)
  .deepPopulate('artists')
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

exports.postImage = function(req, res, next) {
  upload(req, res, function (err) {
    if (err) {
      return next(err);
    }

    if (!req.file) {
      return next({
        state: 400,
        message: 'No file given.',
      });
    }

    // S3 bucket to upload images to
    const bucket = 'cortexuploads';

    // Configuration to be used by S3 service objects
    AWS.config.update({
      accessKeyId: req.app.get("AWS_ACCESS_KEY_ID"),
      secretAccessKey: req.app.get("AWS_SECRET_ACCESS_KEY"),
      subregion: 'us-west-2',
    });

    // Each S3 object has data, a key, and metadata
    // uuidv4() generates and returns an RFC4122 v4 UUID
    const key = `images/${uuidv4()}-${req.file.originalname}`;

    const s3Object = {
      Bucket: 'cortexuploads',
      Key: key,
      Body: req.file.buffer,
      ACL: 'public-read',
    };

    const S3 = new AWS.S3();
    S3.putObject(s3Object, (err) => {
      if (err) {
        return next(err);
      }
      // Success! Store the bucket and key along with other post body data
      const newImage = new Image({
        ...req.body,
        artists: JSON.parse(req.body.artists),
        s3Bucket: bucket,
        s3Key: key,
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
    });
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
