const express = require("express");
const router = express.Router();
const Ticket = require("../models/ticket");
const User = require("../models/user")

// // this router triggers LOGIN on any attempt to enter the URL  without having the session - LOGIN ROUTE For BOTH
// router.use((req, res, next) => {
//   if (req.session.currentUser) {
//     // <== if there's user in the session (user is logged in)
//     next(); // ==> go to the next route ---
//   } else {
//     //    |
//     res.redirect("/login"); //    |
//   } //    |
// }); // ------------------------------------

//Staff-dashboard View

router.get("/staff/dashboard", (req, res, next) => {
  const email = req.session.currentUser.email;
  Ticket.find({ email: email }).then(tickets => {
    console.log(tickets);
    res.render("staff/staff-dashboard", {
      userAuthenticated: req.session.currentUser,
      tickets: tickets
    });
  });
});

router.get("/staff/dashboard", (req, res, next) => {
  const email = req.session.currentUser.email;
  Ticket.find({ email: email }).then(tickets => {
    console.log(tickets);
    res.render("staff/staff-dashboard", {
      userAuthenticated: req.session.currentUser,
      tickets: tickets
    });
  });
});

//Staff-Ticket View

router.get("/staff/staff-tickets", (req, res, next) => {
  Ticket.find().sort({ date: -1 }).then(tickets => {
    res.render("staff/staff-current-tickets", {
      userAuthenticated: req.session.currentUser,
      tickets: tickets
    });
  });
});

// Staff ticket creation

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
  User.find().sort({ firstName: -1 }).then(user => {
    res.render("staff/staff-users", {
      userAuthenticated: req.session.currentUser,
      user: user
    });
  });
});