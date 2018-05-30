const mongoose = require("mongoose");
let Schema = mongoose.Schema;
let ObjectId = Schema.ObjectId;
var deepPopulate = require('mongoose-deep-populate')(mongoose);

module.exports = mongoose.model(
  'Image',
  new Schema({
    // Required
    s3Bucket: { type: String, required: true },
    s3Key: { type: String, required: true },
    // Optional
    artists: [{ type: ObjectId, ref: 'User', default: [] }],
    title: { type: String, default: 'Untitled' },
    description: { type: String, default: '' },
  }).plugin(deepPopulate, {
    populate: {
      'artists': {
        select: 'name roles',
      }
    }
  })
);
