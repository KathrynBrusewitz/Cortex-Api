const mongoose = require("mongoose");
let Schema = mongoose.Schema;
let ObjectId = Schema.ObjectId;

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
    description: { type: String, default: null },
    duration: { type: Number, default: null }, // milliseconds
    references: { type: String, default: null },
    url: { type: String, default: null }, // youtube url, podcast url, etc.
  }, {
    strict: false,
  })
);

// Future properties:
// media id/key/ref - for podcasts and videos to pull from another DB
// category or categories - for sorting and searching
// comments - using embedded documents