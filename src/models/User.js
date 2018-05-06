const mongoose = require("mongoose");
let Schema = mongoose.Schema;
let ObjectId = Schema.ObjectId;

module.exports = mongoose.model(
  'User',
  new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ['admin', 'writer', 'artist', 'reader'], required: true },
    bookmarks: [{ type: ObjectId, ref: 'Content', default: [] }],
    notes: [{ type: ObjectId, ref: 'Term', default: [] }],
  })
);
