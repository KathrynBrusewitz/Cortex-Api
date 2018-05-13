var Event = require("../models/Event");

exports.getEvents = function(req, res) {
  const query = req.query || {};

  Event.find({ ...query })
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

exports.getEvent = function(req, res) {
  Event.findById({ _id: req.params.id }, function(err, data) {
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

exports.postEvent = function(req, res) {
  const newEvent = new Event({ 
    ...req.body,
  });

  newEvent.save(function(err) {
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

exports.putEvent = function(req, res) {
  Event.findById({ _id: req.params.id }, function(err, foundEvent) {
    if (err) {
      res.json({
        success: false,
        message: JSON.stringify(err),
      });
    } else {
      const updatedEvent = {
        ...req.body,
      };
      foundEvent.set(updatedEvent);
      foundEvent.save(function (err, updatedEvent) {
        if (err) {
          res.json({
            success: false,
            message: JSON.stringify(err),
          });
        } else {
          res.json({
            success: true,
            payload: updatedEvent,
          });
        }
      });
    }
  });
};

exports.deleteEvent = function(req, res) {
  Event.findByIdAndRemove({ _id: req.params.id }, function(err) {
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
