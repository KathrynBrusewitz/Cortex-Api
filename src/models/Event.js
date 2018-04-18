const mongoose = require("mongoose");
let Schema = mongoose.Schema;

module.exports = mongoose.model(
  'Event',
  new Schema({
    title: { type: String, required: true },
    startTime: { type: Date, default: Date.now, required: true },
    endTime: { type: Date, default: Date.now, required: true },
    description: { type: String, default: null },
  })
);
