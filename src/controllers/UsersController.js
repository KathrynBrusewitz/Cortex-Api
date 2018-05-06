var User = require("../models/User");

exports.getUsers = function(req, res) {
  const query = req.query || {};

  User.find(query)
  .populate('bookmarks')
  .populate('notes')
  .exec(function(err, data) {
    if (err) {
      console.log(err);
      res.json({
        success: false,
        message: "Server error."
      });
    } else {
      res.json({
        success: true,
        payload: data,
      });
    }
  });
};

exports.getUser = function(req, res) {
  User.findById({ _id: req.params.id })
  .populate('bookmarks')
  .populate('notes')
  .exec(function(err, data) {
    if (err) {
      console.log(err);
      res.json({
        success: false,
        message: "Server error."
      });
    } else {
      res.json({
        success: true,
        payload: data,
      });
    }
  });
};

exports.postUser = function(req, res) {
  const newUser = new User({ 
    ...req.body,
  });

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

exports.putUser = function(req, res) {
  User.findById({ _id: req.params.id }, function(err, foundUser) {
    if (err) {
      console.log(err);
      res.json({
        success: false,
        message: "Server error."
      });
    } else {
      const updatedUser = {
        ...req.body,
      };
      foundUser.set(updatedUser);
      foundUser.save(function (err, updatedUser) {
        if (err) {
          console.log(err);
          res.json({
            success: false,
            message: "Server error."
          });
        } else {
          res.json({
            success: true,
            payload: updatedUser,
          });
        }
      });
    }
  });
};

exports.deleteUser = function(req, res) {
  User.findByIdAndRemove({ _id: req.params.id }, function(err) {
    if (err) {
      console.log(err);
      res.json({
        success: false,
        message: "Server error."
      });
    } else {
      res.json({
        success: true,
      });
    }
  });
};
