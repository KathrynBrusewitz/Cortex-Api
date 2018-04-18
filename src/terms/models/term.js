const mongoose = require("mongoose");
let Schema = mongoose.Schema;

module.exports = mongoose.model(
  'Term',
  new Schema({
    term: { type: String, required: true },
    description: { type: String, default: null },
  })
);
