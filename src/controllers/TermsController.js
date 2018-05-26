var Term = require("../models/Term");

exports.getTerms = function(req, res, next) {
  const query = req.query || {};

  Term.find(query)
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

exports.getTerm = function(req, res, next) {
  Term.findById(req.params.id, function(err, data) {
    if (err) {
      return next(err);
    } else {
      if (!data) {
        return next({
          status: 404,
          message: 'Term not found.',
        });
      }
      res.json({
        success: true,
        payload: data,
      });
    }
  });
};

exports.postTerm = function(req, res, next) {
  const newTerm = new Term({ 
    ...req.body,
  });

  newTerm.save(function(err, savedTerm) {
    if (err) {
      return next(err);
    } else {
      res.json({ success: true, payload: savedTerm });
    }
  });
};

exports.putTerm = function(req, res, next) {
  Term.findById(req.params.id, function(err, foundTerm) {
    if (err) {
      return next(err);
    } else {
      if (!foundTerm) {
        return next({
          status: 404,
          message: 'Term not found.',
        });
      }
      const updatedTerm = {
        ...req.body,
      };
      foundTerm.set(updatedTerm);
      foundTerm.save(function (err, updatedTerm) {
        if (err) {
          return next(err);
        } else {
          res.json({
            success: true,
            payload: updatedTerm,
          });
        }
      });
    }
  });
};

exports.deleteTerm = function(req, res, next) {
  Term.findByIdAndRemove(req.params.id, function(err, deletedTerm) {
    if (!deletedTerm) {
      return next({
        status: 404,
        message: 'Term not found.',
      });
    }
    if (err) {
      return next(err);
    } else {
      res.json({
        success: true,
        payload: deletedTerm,
      });
    }
  });
};
