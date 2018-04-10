const mongoose = require("mongoose");
let Schema = mongoose.Schema;

module.exports = mongoose.model(
  'Article',
  new Schema({
    type: 'article',
    body: { type: String, required: true },
    references: { type: String, default: null },
  })
);
