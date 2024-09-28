// backend/models/treatmentCenterModel.js
const mongoose = require("mongoose");

const treatmentCenterSchema = new mongoose.Schema({
  name: String,
  address: String,
  phone: String,
  email: String,
  website: String,
  coordinates: {
    lat: Number,
    lng: Number,
  },
});

const TreatmentCenter = mongoose.model(
  "TreatmentCenter",
  treatmentCenterSchema
);

module.exports = TreatmentCenter;
