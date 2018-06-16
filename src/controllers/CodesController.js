var Code = require("../models/Code");
var User = require("../models/User");
var uuidv4 = require('uuid/v4');
var AWS = require('aws-sdk');

exports.getInvites = function(req, res, next) {
  let query = req.query.q || {};
  query.type = 'invite';

  if (!req.token && !query.code) {
    return next({
      status: 400,
      message: "Getting invites requires valid token or code.",
    });
  }

  Code.find(query, function(err, data) {
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

exports.deleteInvite = function(req, res, next) {
  Code.findByIdAndRemove(req.params.id, function(err, deletedCode) {
    if (err) {
      return next(err);
    } else {
      res.json({
        success: true,
        payload: deletedCode,
      });
    }
  });
};

exports.postInvite = function(req, res, next) {
  if (!req.body.roles || !req.body.email) {
    return next({
      status: 400,
      message: 'Invite user requires email and roles.',
    });
  }

  User.findOne({ email: req.body.email })
  .exec(function(err, foundUser) {
    if (err) {
      return next(err);
    }
    if (foundUser) {
      return next({
        status: 409,
        message: "Cannot send invite to new user. Email already exists.",
      });
    }
    // Make sure roles ends up as an array
    const roles = Array.isArray(req.body.roles) ? req.body.roles : [req.body.roles];

    const newCode = new Code({ 
      code: uuidv4(), // Generate and return a RFC4122 v4 UUID
      type: 'invite',
      roles,
      email: req.body.email,
    });

    newCode.save(function(err, savedCode) {
      if (err) {
        return next(err);
      }

      // Configuration to be used
      AWS.config.update({
        accessKeyId: req.app.get("AWS_ACCESS_KEY_ID"),
        secretAccessKey: req.app.get("AWS_SECRET_ACCESS_KEY"),
        region: 'us-west-2',
      });

      // Load AWS SES
      let SES = new AWS.SES({apiVersion: '2010-12-01'});

      // Build template
      let params = {
        Destination: {
          ToAddresses: [req.body.email]
        }, 
        Message: {
          Body: {
            Html: {
              Charset: "UTF-8", 
              Data: `<div width="100%" style="margin:0;padding:20px;background-color:#f4f4f4"><div style="max-width:680px;padding:15px;margin:auto;background-color:#fff;font-family:Poppins,'-apple-system',BlinkMacSystemFont,Helvetica,Arial,sans-serif;color:#2e343b;font-size:13.5px;font-weight:300;letter-spacing:.07em;line-height:2em;"><div style="text-align:center"><img width="250" src="https://s3-us-west-2.amazonaws.com/cortexdocs/grey-matters-logo.png" alt="Grey Matters Journal Logo" /></div><p><strong>Hello!</strong> You've been invited to join Grey Matters Journal!</p><p><a class="ulink" href="https://cortexdash.com/invite?code=${savedCode.code}" target="_blank">Click here to finish creating your account.</a></p><p><em>If the link does not work, copy and paste it in a new browser window.<br/>This is an automated, send-only email. Please do not reply.</em></p><p><strong>- The Grey Matters Team</p></strong></div></div>`
            },
          }, 
          Subject: {
            Charset: "UTF-8", 
            Data: "You've been invited to join Grey Matters Journal"
          }
        },
        Source: "noreply@cortexdash.com",
      };

      SES.sendEmail(params, function(err) {
        if (err) {
          return next(err);
        } else {
          return res.json({
            success: true,
            message: 'Created invite code and sent email.',
            payload: savedCode,
          });
        }
      });
    });
  });
};

exports.postReset = function(req, res, next) {
  if (!req.body.email) {
    return next({
      status: 400,
      message: 'Reset password requires an email.',
    });
  }

  User.findOne({ email: req.body.email })
  .exec(function(err, foundUser) {
    if (err) {
      return next(err);
    }
    if (!!foundUser) {
      return next({
        status: 409,
        message: "Cannot send password reset to email. Email does not exist.",
      });
    }
    const newCode = new Code({ 
      code: uuidv4(), // Generate and return a RFC4122 v4 UUID
      type: 'reset',
      email: req.body.email,
    });
  
    newCode.save(function(err, savedCode) {
      if (err) {
        return next(err);
      }
  
      // Configuration to be used
      AWS.config.update({
        accessKeyId: req.app.get("AWS_ACCESS_KEY_ID"),
        secretAccessKey: req.app.get("AWS_SECRET_ACCESS_KEY"),
        region: 'us-west-2',
      });
  
      // Load AWS SES
      let SES = new AWS.SES({apiVersion: '2010-12-01'});
  
      // Build template
      let params = {
        Destination: {
          ToAddresses: [req.body.email]
        }, 
        Message: {
          Body: {
            Html: {
              Charset: "UTF-8", 
              Data: `<div width="100%" style="margin:0;padding:20px;background-color:#f4f4f4"><div style="max-width:680px;padding:15px;margin:auto;background-color:#fff;font-family:Poppins,'-apple-system',BlinkMacSystemFont,Helvetica,Arial,sans-serif;color:#2e343b;font-size:13.5px;font-weight:300;letter-spacing:.07em;line-height:2em;"><div style="text-align:center"><img width="250" src="https://s3-us-west-2.amazonaws.com/cortexdocs/grey-matters-logo.png" alt="Grey Matters Journal Logo" /></div><p><strong>Hello!</strong> You've requested to reset your Grey Matters Journal password. Use the following code to continue resetting your password:</p><h2>${savedCode.code}</h2><p><em>If you did not make this request, please disregard this email.<br/>This is an automated, send-only email. Please do not reply.</em></p><p><strong>- The Grey Matters Team</p></strong></div></div>`
            },
          }, 
          Subject: {
            Charset: "UTF-8", 
            Data: "Password reset code for Grey Matters Journal"
          }
        },
        Source: "noreply@cortexdash.com",
      };
  
      SES.sendEmail(params, function(err) {
        if (err) {
          return next(err);
        } else {
          return res.json({
            success: true,
            message: 'Created reset code and sent email.',
            payload: savedCode,
          });
        }
      });
    });
  });
};
