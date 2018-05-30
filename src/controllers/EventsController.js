var Event = require("../models/Event");

exports.getEvents = function(req, res, next) {
  const query = req.query || {};

  Event.find({ ...query })
  .deepPopulate('coverImage coverImage.artists')
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

exports.getEvent = function(req, res, next) {
  Event.findById({ _id: req.params.id })
  .deepPopulate('coverImage coverImage.artists')
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

exports.postEvent = function(req, res, next) {
  const newEvent = new Event({ 
    ...req.body,
  });

  newEvent.save(function(err, savedEvent) {
    if (err) {
      return next(err);
    } else {
      res.json({ success: true, payload: savedEvent });
    }
  });
};

exports.putEvent = function(req, res, next) {
  Event.findById({ _id: req.params.id }, function(err, foundEvent) {
    if (err) {
      return next(err);
    } else {
      if (!foundEvent) {
        return next({
          status: 404,
          message: 'Event not found.',
        });
      }
      const updatedEvent = {
        ...req.body,
      };
      foundEvent.set(updatedEvent);
      foundEvent.save(function (err, updatedEvent) {
        if (err) {
          return next(err);
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

exports.deleteEvent = function(req, res, next) {
  Event.findByIdAndRemove({ _id: req.params.id }, function(err, deletedEvent) {
    if (err) {
      return next(err);
    } else {
      if (!deletedEvent) {
        return next({
          status: 404,
          message: 'Event not found.',
        });
      }
      res.json({
        success: true,
        payload: deletedEvent,
      });
    }
  });
};
