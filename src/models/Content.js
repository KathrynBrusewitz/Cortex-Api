const mongoose = require("mongoose");
let Schema = mongoose.Schema;

module.exports = mongoose.model(
  'Content',
  new Schema({
    title: { type: String, required: true },
    state: { type: String, enum: ['published', 'unpublished'], required: true, default: 'unpublished' },
    creators: [{ type: ObjectId, ref: 'User', default: [] }],
    updateTime: { type: Date, default: Date.now }, // updateTime == createTime
    publishTime: { type: Date, default: null },
    // Content Type Specific Details
    type: { type: String, enum: ['article', 'podcast', 'video'], required: true },
    body: { type: String, default: null },
    description: { type: String, default: null },
    duration: { type: Number, default: null }, // milliseconds
    references: { type: String, default: null },
  }, {
    strict: false,
  })
);

// Future properties:
// media id/key/ref - for podcasts and videos to pull from another DB
// category or categories - for sorting and searching
// comments - using embedded documents