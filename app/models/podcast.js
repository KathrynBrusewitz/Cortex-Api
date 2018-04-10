const mongoose = require("mongoose");
let Schema = mongoose.Schema;

module.exports = mongoose.model(
  'Podcast',
  new Schema({
    type: 'podcast',
    description: { type: String, default: null },
  })
);
