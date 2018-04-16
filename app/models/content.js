const mongoose = require("mongoose");
let Schema = mongoose.Schema;

module.exports = mongoose.model(
  'Content',
  new Schema({
    title: { type: String, required: true },
    status: { type: String, enum: ['published', 'unpublished'], required: true, default: 'unpublished' },
    editTime: { type: Date, default: Date.now, required: true },
    publishTime: { type: Date, default: null, required: false },
    creators: [{ type: ObjectId, ref: 'User', default: [] }],
    type: { type: String, enum: ['article', 'podcast', 'video'], required: true },
    details: { type: ObjectId, refPath: type },
  })
);
