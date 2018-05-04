const mongoose = require("mongoose");
let Schema = mongoose.Schema;

module.exports = mongoose.model(
  'Event',
  new Schema({
    title: { type: String, required: true },
    dateStart: { type: Date, default: null },
    dateEnd: { type: Date, default: null },
    description: { type: String, default: null },
    location: { type: String, default: null },
  }, {
    strict: false,
  })
);
