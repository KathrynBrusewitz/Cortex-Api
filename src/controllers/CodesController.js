var Code = require("../models/Code");
var uuidv4 = require('uuid/v4');
var AWS = require('aws-sdk');

exports.getInvites = function(req, res, next) {
  let query = req.query.q || {};
  query.type = 'invite';

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

  // Make sure roles ends up as an array
  const roles = Array.isArray(req.body.roles) ? req.body.roles : [req.body.roles];

  const newCode = new Code({ 
    code: uuidv4(), // Generate and return a RFC4122 v4 UUID
    type: 'invite',
    roles,
    email: req.body.email,
  });

  newCode.save(function(err, inviteCode) {
    if (err) {
      return next(err);
    }
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const url = `${baseUrl}/invite?code=`;

    // Configuration to be used
    AWS.config.update({
      accessKeyId: req.app.get("AWS_ACCESS_KEY_ID"),
      secretAccessKey: req.app.get("AWS_SECRET_ACCESS_KEY"),
      subregion: 'us-west-2',
    });

    // Load AWS SES
    let SES = new aws.SES({apiVersion: '2010-12-01'});

    // Build template
    let params = {
      Destination: {
        ToAddresses: [req.body.email]
      }, 
      Message: {
        Body: {
          Html: {
            Charset: "UTF-8", 
            Data: "This message body contains HTML formatting. It can, for example, contain links like this one: <a class=\"ulink\" href=\"http://docs.aws.amazon.com/ses/latest/DeveloperGuide\" target=\"_blank\">Amazon SES Developer Guide</a>."
          }, 
          Text: {
            Charset: "UTF-8", 
            Data: "This is the message body in text format."
          },
        }, 
        Subject: {
          Charset: "UTF-8", 
          Data: "Test email"
        }
      },
      Source: "cortex.dash@gmail.com", 
    };

    SES.sendEmail(params, function(err, data) {
      if (err) {
        return next(err);
      } else {
        return res.json({
          success: true,
          message: 'Created invite code created and sent email.',
        });
      }
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

  const newCode = new Code({ 
    code: uuidv4(), // Generate and return a RFC4122 v4 UUID
    type: 'reset',
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
      message: 'Reset password code created. TODO: Send email.',
    });
  });
};
