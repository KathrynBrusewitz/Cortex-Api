const mongoose = require("mongoose");
let Schema = mongoose.Schema;
let ObjectId = Schema.ObjectId;

module.exports = mongoose.model(
  'User',
  new Schema({
    // Required
    name: { type: String, required: true },
    roles: { type: [String], enum: ['admin', 'writer', 'artist', 'reader'], required: true },
    email: { type: String, unique: true, required: true },
    // Optional
    password: { type: String, select: false, default: null },
    bookmarks: [{ type: ObjectId, ref: 'Content' }],
    notes: [{ body: 'string', term: { type: ObjectId, ref: 'Term' } }],
    bio: { type: String, default: '' },
  })
);
