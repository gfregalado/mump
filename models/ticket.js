const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ticketSchema = new Schema(
  {
    title: { type: String },
    description: { type: String },
    email: { type: String },
    image: { type: String },
    status: { type: String, enum: ["Open", "In Progress", "Closed"], default: "Open" },
    comments: [
      {
        user: String,
        comment: String,
      }
    ]
  },
  {
    timestamps: true
  }
);

const Ticket = mongoose.model("Ticket", ticketSchema);

module.exports = Ticket;
