var Item = require("../models/Item");

exports.getItems = function(req, res, next) {
  let query = req.query.q || {};

  Item.find(query, function(err, data) {
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

exports.getItem = function(req, res, next) {
  Item.findById(req.params.id, function(err, data) {
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

exports.postItem = function(req, res, next) {
  const newItem = new Item({ 
    ...req.body,
  });

  newItem.save(function(err, savedItem) {
    if (err) {
      return next(err);
    } else {
      res.json({
        success: true,
        payload: savedItem,
      });
    }
  });
};

exports.putItem = function(req, res, next) {
  Item.findById(req.params.id, function(err, foundItem) {
    if (err) {
      return next(err);
    } else {
      const updatedItem = {
        ...req.body,
      };
      foundItem.set(updatedItem);
      foundItem.save(function (err, updatedItem) {
        if (err) {
          return next(err);
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

exports.deleteItem = function(req, res, next) {
  Item.findByIdAndRemove(req.params.id, function(err) {
    if (err) {
      return next(err, deletedItem);
    } else {
      res.json({
        success: true,
        payload: deletedItem,
      });
    }
  });
};
