const mongoose = require("mongoose");
let Schema = mongoose.Schema;
let ObjectId = Schema.ObjectId;

module.exports = mongoose.model(
  'Code',
  new Schema({
    // Required
    code: { type: String, required: true },
    type: { type: String, enum: ['invite', 'reset'], required: true },
    email: { type: String, required: true },
    // Specific for Invite Codes
    roles: { type: [String], enum: ['admin', 'writer', 'artist', 'reader'] },
  })
);
