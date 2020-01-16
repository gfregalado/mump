const express = require("express");
const router = express.Router();
const Ticket = require("../models/ticket");
const User = require("../models/user");
const uploadCloud = require("../config/cloudinary.js");
const moment = require("moment");

// this router triggers LOGIN on any attempt to enter the URL  without having the session - LOGIN ROUTE For BOTH
router.use((req, res, next) => {
  if (req.session.currentUser) {
    // <== if there's user in the session (user is logged in)
    next(); // ==> go to the next route ---
  } else {
    //    |
    res.redirect("/login"); //    |
  } //    |
}); // ------------------------------------

// GET - User ticket area view

router.get("/user/tickets", (req, res, next) => {
  res.render("user/user-ticket-area");
});

router.get("/user/user-dashboard", (req, res, next) => {
  const email = req.session.currentUser.email;
  Ticket.find({ status: "Open" })
    .sort({ createdAt: -1 })
    .then(tickets => {
      res.render("user/user-dashboard", {
        userAuthenticated: req.session.currentUser,
        tickets: tickets
      });
    });
});

router.get("/user/ticket", (req, res, next) => {
  const ticketID = req.query.ticket_id;
  Ticket.find({ _id: ticketID })
    .then(ticket => {
      console.log(ticket);
      res.render("user/ticket", {
        userAuthenticated: req.session.currentUser,
        ticket: ticket
      });
    })
    .catch(err => {
      console.log(err);
    });
});

//Ticket Creation

router.post(
  "/ticketcreationuser",
  uploadCloud.single("photo"),
  (req, res, next) => {
    const { title, description } = req.body;
    const email = req.session.currentUser.email;
    const firstName = req.session.currentUser.firstName;
    const lastName = req.session.currentUser.lastName;
    const imageName = req.file.originalName;
    const imagePath = req.file.url;
    const creationDate = moment().format("MMM Do YYYY");

    console.log("I AM HERE" + moment());

    Ticket.create({
      title,
      description,
      imageName,
      imagePath,
      email,
      firstName,
      lastName,
      creationDate
    })
      .then(() => {
        res.redirect("/user/user-dashboard");
      })
      .then(() => {
        res.render("user/user-dashboard", {
          userAuthenticated: req.session.currentUser
        });
        console.log(userAuthenticated);
      })
      .catch(error => {
        console.log(error);
      });
  }
);

module.exports = router;
