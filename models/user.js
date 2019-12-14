const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    email: { type: String, match: "\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b" },
    password: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    super: { type: Boolean, default: false },
    role: { type: String },
    Avatar: { type: String },
  },
  {
    timestamps: true
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
