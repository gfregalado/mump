const express = require("express");
const router = express.Router();
const Ticket = require("../models/ticket");
const User = require("../models/user");
const uploadCloud = require("../config/cloudinary.js");


//Staff-Dashboard View

router.get("/staff/dashboard", (req, res, next) => {
  const email = req.session.currentUser.email;
  Ticket.find({ email: email })
    .sort({ date: -1 })
    .then(tickets => {
      console.log(tickets);
      res.render("staff/staff-dashboard", {
        userAuthenticated: req.session.currentUser,
        tickets: tickets
        // // }.catch(error => {
        // //   res.redirect("index");
        // //   console.log(error);
        // })
      });
    });
});

//Staff-Ticket View

router.get("/staff/staff-tickets", (req, res, next) => {
  Ticket.find({ status: "Open" })
    .sort({ date: -1 })
    .then(tickets => {
      res.render("staff/staff-current-tickets", {
        userAuthenticated: req.session.currentUser,
        tickets: tickets
      });
    });
});

// Staff ticket Creation Modal

router.post("/ticketcreation", (req, res, next) => {
  const title = req.body.title;
  const description = req.body.description;
  const email = req.session.currentUser.email;
  const firstName = req.session.currentUser.firstName;
  const lastName = req.session.currentUser.lastName;

  Ticket.create({
    title,
    description,
    email,
    firstName,
    lastName
  })
    .then(() => {
      res.redirect("/staff/staff-tickets");
    })
    .then(() => {
      // console.log("user2", req.session.currentUser);

      res.render("staff/staff-current-tickets", {
        userAuthenticated: req.session.currentUser
      });
      // console.log("USER INFO:" + theUsername)
    })
    .catch(error => {
      console.log(error);
    });
});

module.exports = router;

// Staff Users View

router.get("/staff/users", (req, res, next) => {
  User.find({ super: "false" })
    .sort({ firstName: -1 })
    .then(user => {
      res.render("staff/staff-users", {
        userAuthenticated: req.session.currentUser,
        user: user
      });
    });
});

// Staff Closed Tickets view

router.get("/staff/closed-tickets", (req, res, next) => {
  Ticket.find({ status: "Closed" })
    .sort({ createdAt: -1 })
    .then(tickets => {
      res.render("staff/staff-closed-tickets", {
        userAuthenticated: req.session.currentUser,
        tickets: tickets
      });
    });
});
