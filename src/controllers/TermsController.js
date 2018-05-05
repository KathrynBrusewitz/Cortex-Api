var Term = require("../models/Term");

exports.getTerms = function(req, res) {
  const query = req.query || {};

  Term.find(query)
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

exports.getTerm = function(req, res) {
  Term.findById({ _id: req.params.id }, function(err, data) {
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

exports.postTerm = function(req, res) {
  const newTerm = new Term({ 
    ...req.body,
  });

  newTerm.save(function(err) {
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

exports.putTerm = function(req, res) {
  Term.findById({ _id: req.params.id }, function(err, foundTerm) {
    if (err) {
      console.log(err);
      res.json({
        success: false,
        message: "Server error."
      });
    } else {
      const updatedTerm = {
        ...req.body,
      };
      foundTerm.set(updatedTerm);
      foundTerm.save(function (err, updatedTerm) {
        if (err) {
          console.log(err);
          res.json({
            success: false,
            message: "Server error."
          });
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

exports.deleteTerm = function(req, res) {
  Term.findByIdAndRemove({ _id: req.params.id }, function(err) {
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
