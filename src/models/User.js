const mongoose = require("mongoose");
let Schema = mongoose.Schema;

module.exports = mongoose.model(
  'User',
  new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'writer', 'reader'], required: true },
    bookmarks: [{ type: ObjectId, ref: 'Content', default: [] }],
  })
);
