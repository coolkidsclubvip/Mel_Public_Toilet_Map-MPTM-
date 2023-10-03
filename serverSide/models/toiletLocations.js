const mongoose = require("mongoose");

const toiletLocationsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  female: {
    type: Boolean,
    required: true,
  },
  male: {
    type: Boolean,
    required: true,
  },
  wheelchair: {
    type: Boolean,
    required: true,
  },
  operator: {
    type: String,
    required: true,
  },
  baby_facil: {
    type: Boolean,
    required: true,
  },
  lon: {
    type: Number,
    required: true,
  },
  lat: {
    type: Number,
    required: true,
  },
});

const ToiletLocationsModel = mongoose.model(
  "ToiletLocations",
  toiletLocationsSchema
);





 module.exports = ToiletLocationsModel;