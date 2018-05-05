var Event = require("../models/Event");

exports.getEvents = function(req, res) {
  const query = req.query || {};

  Event.find({ ...query })
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

exports.getEvent = function(req, res) {
  Event.findById({ _id: req.params.id }, function(err, data) {
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

exports.postEvent = function(req, res) {
  const newEvent = new Event({ 
    ...req.body,
  });

  newEvent.save(function(err) {
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

exports.putEvent = function(req, res) {
  Event.findById({ _id: req.params.id }, function(err, foundEvent) {
    if (err) {
      console.log(err);
      res.json({
        success: false,
        message: "Server error."
      });
    } else {
      const updatedEvent = {
        ...req.body,
      };
      foundEvent.set(updatedEvent);
      foundEvent.save(function (err, updatedEvent) {
        if (err) {
          console.log(err);
          res.json({
            success: false,
            message: "Server error."
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
