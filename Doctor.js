const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  specialty: { type: String, required: true },
  password: { type: String, required: true },
  location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
});

doctorSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Doctor", doctorSchema);
