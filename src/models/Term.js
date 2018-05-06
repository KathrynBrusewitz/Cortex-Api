const mongoose = require("mongoose");
let Schema = mongoose.Schema;

module.exports = mongoose.model(
  'Term',
  new Schema({
    term: { type: String, required: true },
    definition: { type: String, default: null },
    description: { type: String, default: null },
  })
);
