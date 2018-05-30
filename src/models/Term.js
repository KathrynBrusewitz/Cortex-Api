const mongoose = require("mongoose");
let Schema = mongoose.Schema;
let ObjectId = Schema.ObjectId;
var deepPopulate = require('mongoose-deep-populate')(mongoose);

module.exports = mongoose.model(
  'Term',
  new Schema({
    term: { type: String, required: true },
    definition: { type: String, default: null },
    description: { type: String, default: null },
    coverImage: { type: ObjectId, ref: 'Image', default: null },
  }).plugin(deepPopulate, {
    populate: {
      'coverImage.artists': {
        select: 'name roles'
      },
    }
  })
);
