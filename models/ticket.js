const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ticketSchema = new Schema(
  {
    title: { type: String },
    description: { type: String },
    imageName: { type: String },
    imagePath: { type: String },
    email: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    status: { type: String, enum: ["Open", "In Progress", "Closed"], default: "Open" },
    creationDate: { type: String },
    closeDate: { type: String },
    comments: [
      {
        user: String,
        comment: String,
      }
    ],
  },
  {
    timestamps: true
  }
);

const Ticket = mongoose.model("Ticket", ticketSchema);

module.exports = Ticket;
