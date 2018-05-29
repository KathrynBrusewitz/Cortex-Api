const mongoose = require("mongoose");
let Schema = mongoose.Schema;
let ObjectId = Schema.ObjectId;

module.exports = mongoose.model(
  'Image',
  new Schema({
    // Required
    url: { type: String, required: true },
    // Optional
    artists: [{ type: ObjectId, ref: 'User', default: [] }],
    title: { type: String, default: '' },
    description: { type: String, default: '' },
  })
);
