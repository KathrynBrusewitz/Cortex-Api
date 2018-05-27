const mongoose = require("mongoose");
let Schema = mongoose.Schema;
let ObjectId = Schema.ObjectId;
var deepPopulate = require('mongoose-deep-populate')(mongoose);

module.exports = mongoose.model(
  'Content',
  new Schema({
    // Required
    title: { type: String, required: true },
    state: { type: String, enum: ['published', 'unpublished'], required: true, default: 'unpublished' },
    type: { type: String, enum: ['article', 'podcast', 'video'], required: true },
    // Optional
    creators: [{ type: ObjectId, ref: 'User', default: [] }],
    updateTime: { type: Date, default: Date.now }, // updateTime == createTime
    publishTime: { type: Date, default: null },
    // Content Type Specific Details
    body: { type: String, default: null },
    bodySlate: { type: JSON, default: null }, // JSON format for Slate Framework
    description: { type: String, default: null },
    duration: { type: Number, default: null }, // milliseconds
    references: [{ number: Number, text: String }],
    url: { type: String, default: null }, // youtube url, podcast url, etc.
  }).plugin(deepPopulate, {
    populate: {
      'creators': {
        select: 'name roles',
      },
      'artists': {
        select: 'name roles',
      }
    }
  })
);
