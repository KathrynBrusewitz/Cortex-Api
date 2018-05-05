var Item = require("../models/Item");

exports.getItems = function(req, res) {
  const query = req.query || {};

  Item.find({ ...query })
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

exports.getItem = function(req, res) {
  Item.findById({ _id: req.params.id }, function(err, data) {
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

exports.postItem = function(req, res) {
  const newItem = new Item({ 
    ...req.body,
  });

  newItem.save(function(err) {
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

exports.putItem = function(req, res) {
  Item.findById({ _id: req.params.id }, function(err, foundItem) {
    if (err) {
      console.log(err);
      res.json({
        success: false,
        message: "Server error."
      });
    } else {
      const updatedItem = {
        ...req.body,
      };
      foundItem.set(updatedItem);
      foundItem.save(function (err, updatedItem) {
        if (err) {
          console.log(err);
          res.json({
            success: false,
            message: "Server error."
          });
        } else {
          res.json({
            success: true,
            payload: updatedItem,
          });
        }
      });
    }
  });
};

exports.deleteItem = function(req, res) {
  Item.findByIdAndRemove({ _id: req.params.id }, function(err) {
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
