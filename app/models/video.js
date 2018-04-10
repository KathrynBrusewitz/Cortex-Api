const mongoose = require("mongoose");
let Schema = mongoose.Schema;

module.exports = mongoose.model(
  'Video',
  new Schema({
    type: 'video',
    description: { type: String, default: null },
    duration: { type: Number, default: null },
  })
);
