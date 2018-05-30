const mongoose = require("mongoose");
let Schema = mongoose.Schema;
let ObjectId = Schema.ObjectId;
var deepPopulate = require('mongoose-deep-populate')(mongoose);

module.exports = mongoose.model(
  'Event',
  new Schema({
    title: { type: String, required: true },
    dateStart: { type: Date, default: null },
    dateEnd: { type: Date, default: null },
    description: { type: String, default: null },
    location: { type: String, default: null },
    url: { type: String, default: null },
    coverImage: { type: ObjectId, ref: 'Image', default: null },
  }).plugin(deepPopulate, {
    populate: {
      'coverImage.artists': {
        select: 'name roles'
      },
    }
  })
);
