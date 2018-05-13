var User = require("../models/User");
var Code = require("../models/Code");
var uuidv4 = require('uuid/v4');
var bcrypt = require('bcrypt');
const saltRounds = 10;

exports.getUsers = function(req, res) {
  const query = req.query || {};

  User.find(query)
  .populate('bookmarks')
  .populate('notes')
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

exports.getUser = function(req, res) {
  User.findById({ _id: req.params.id })
  .populate('bookmarks')
  .populate('notes')
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

exports.postUser = function(req, res) {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password || !role) {
    return res.status(500).send({
      success: false,
      message: 'User registration is missing one or more req params: name, email, password, role',
    });
  }

  bcrypt.hash(password, saltRounds, function(err, hash) {
    if (err) {
      res.status(500).send({
        success: false,
        message: JSON.stringify(err),
      });
    } else {
      const newUser = new User({ name, email, password: hash, role });

      newUser.save(function(err) {
        if (err) {
          res.status(500).send({
            success: false,
            message: JSON.stringify(err),
          });
        } else {
          res.json({ 
            success: true,
          });
        }
      });
    }
  });
};

exports.putUser = function(req, res) {
  User.findById({ _id: req.params.id }, function(err, foundUser) {
    if (err) {
      res.json({
        success: false,
        message: JSON.stringify(err),
      });
    } else {
      if (!foundUser) {
        return res.json({
          success: false,
          message: 'User not found.',
        });
      }
      if (req.body.password) {
        bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
          if (err) {
            return res.status(500).send({
              success: false,
              message: JSON.stringify(err),
            });
          }
          const updatedUser = {
            ...req.body,
            password: hash,
          };
          foundUser.set(updatedUser);
          foundUser.save(function (err, savedUser) {
            if (err) {
              res.json({
                success: false,
                message: JSON.stringify(err),
              });
            } else {
              res.json({
                success: true,
                payload: savedUser,
              });
            }
          });
        });
      } else {
        const updatedUser = {
          ...req.body,
        };
        foundUser.set(updatedUser);
        foundUser.save(function (err, savedUser) {
          if (err) {
            res.json({
              success: false,
              message: JSON.stringify(err),
            });
          } else {
            res.json({
              success: true,
              payload: savedUser,
            });
          }
        });
      }
    }
  });
};

exports.deleteUser = function(req, res) {
  User.findByIdAndRemove({ _id: req.params.id }, function(err) {
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

exports.inviteUser = function(req, res) {
  if (!req.body.role || !req.body.email) {
    return res.json({
      success: false,
      message: 'UsersController.inviteUser requires one or more request params: role, email',
    });
  }

  const newCode = new Code({ 
    code: uuidv4(), // Generate and return a RFC4122 v4 UUID
    type: 'invite',
    role: req.body.role,
    email: req.body.email,
  });

  newCode.save(function(err, inviteCode) {
    if (err) {
      return res.status(500).send({
        success: false,
        message: JSON.stringify(err),
      });
    }
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const url = `${baseUrl}/invite?code=`;

    // TODO: Use Amazon SES to build a template and send email

    return res.json({
      success: true,
      message: 'Invite code created. TODO: Send email.',
    });
  });
};
