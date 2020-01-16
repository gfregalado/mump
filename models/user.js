const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    email: { type: String, required: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    super: { type: Boolean, default: false },
    role: { type: String },
    avatarName: { type: String },
    avatarPath: { type: String, default: "images/default-avatar.png" },
    date: { type: Date, default: Date.now }
  },
  {
    timestamps: true
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
