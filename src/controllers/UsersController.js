var User = require("../models/User");
var Term = require("../models/Term");
var Code = require("../models/Code");
var uuidv4 = require('uuid/v4');
var bcrypt = require('bcrypt');
const saltRounds = 10;

exports.getMe = function(req, res, next) {
  if (!req.decoded._id) {
    return next({
      status: 403,
      message: 'Token is valid, but you are not logged in as a user.'
    });
  }
  User.findById(req.decoded._id)
  .populate('bookmarks')
  .populate('notes')
  .exec(function(err, data) {
    if (err) {
      return next(err);
    }
    return res.json({
      success: true,
      payload: data,
    });
  });
};

exports.getUsers = function(req, res, next) {
  if (!req.decoded._id) {
    return next({
      status: 403,
      message: 'Token is valid, but you are not logged in as a user.'
    });
  }
  if (req.decoded.entry !== 'dash') {
    return next({
      status: 403,
      message: 'Token is valid, but only dashboard entry can get all users.'
    });
  }
  const query = req.query || {};

  User.find(query)
  .populate('bookmarks')
  .populate('notes')
  .exec(function(err, data) {
    if (err) {
      return next(err);
    } else {
      return res.json({
        success: true,
        payload: data,
      });
    }
  });
};

exports.getUser = function(req, res, next) {
  User.findById(req.params.id)
  .plugin(deepPopulate, 'bookmarks notes.term')
  .exec(function(err, data) {
    if (err) {
      return next(err);
    } else {
      return res.json({
        success: true,
        payload: data,
      });
    }
  });
};

exports.postUser = function(req, res, next) {
  if (!req.body.name || !req.body.roles || !req.body.email) {
    return next({
      status: 400,
      message: "Name, roles, or email fields are missing in post body.",
    });
  }

  // Make sure roles ends up as an array
  const roles = Array.isArray(req.body.roles) ? req.body.roles : [req.body.roles];

  // If entry is app, make sure that one of the roles is `reader`
  if (req.decoded.entry === 'app' && !roles.includes('reader')) {
    roles.push('reader');
  }
  
  // Admins and readers must have a password
  if (roles.includes('admin') || roles.includes('reader')) {
    if (!req.body.password) {
      return next({
        status: 400,
        message: "Admins and readers require a password to be set.",
      });
    }
  }

  // Do not add a new user with duplicate email
  User.findOne({ email: req.body.email }, function(err, foundUser) {
    if (err) {
      return next(err);
    }
    if (foundUser) {
      return next({
        status: 409,
        message: "Cannot add new user. Email already exists.",
      });
    }
    // If body has a password, hash it, then create user with rest of information
    if (req.body.password) {
      return bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        if (err) {
          return next(err);
        }
        const newUser = new User({
          ...req.body,
          roles,
          password: hash,
        });

        newUser.save(function(err, savedUser) {
          if (err) {
            return next(err);
          }
          return res.json({
            success: true,
            payload: {
              _id: savedUser._id,
            },
          });
        });
      });
    }
    // If body does not have a password, create user with rest of information
    const newUser = new User({
      ...req.body,
      roles,
    });

    newUser.save(function(err, savedUser) {
      if (err) {
        return next(err);
      }
      return res.json({ 
        success: true,
        payload: savedUser,
      });
    });
  });
};

exports.putUser = function(req, res, next) {
  User.findById(req.params.id, function(err, foundUser) {
    if (err) {
      return next(err);
    } else {
      if (!foundUser) {
        return next({
          status: 404,
          message: 'User not found.',
        });
      }
      // If password is being updated, hash the new password
      if (req.body.password) {
        bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
          if (err) {
            return next(err);
          }
          const updatedUser = {
            ...req.body,
            password: hash,
          };
          foundUser.set(updatedUser);
          foundUser.save(function (err, savedUser) {
            if (err) {
              return next(err);
            } else {
              return res.json({
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
            return next(err);
          } else {
            return res.json({
              success: true,
              payload: savedUser,
            });
          }
        });
      }
    }
  });
};

exports.deleteUser = function(req, res, next) {
  User.findByIdAndRemove(req.params.id, function(err, deletedUser) {
    if (err) {
      return next(err);
    } else {
      return res.json({
        success: true,
        payload: deletedUser,
      });
    }
  });
};

exports.inviteUser = function(req, res, next) {
  if (!req.body.role || !req.body.email) {
    return next({
      status: 400,
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
      return next(err);
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
