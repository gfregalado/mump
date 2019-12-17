const express = require("express");
const router = express.Router();
const Ticket = require("../models/ticket");

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

//Staff-Ticket View

router.get("/staff-tickets", (req, res, next) => {
  res.render("staff/staff-current-tickets");
});

// Staff ticket creation

router.post("/ticketcreation", (req, res, next) => {
  const title = req.body.title;
  const description = req.body.description;
  const email = req.session.currentUser.email;

  Ticket.create({
    title,
    description,
    email
  })
    .then(() => {
      res.redirect("/staff/dashboard");
    })
    .then(() => {
      // console.log("user2", req.session.currentUser);

      res.render("staff/user-dashboard", {
        userAuthenticated: req.session.currentUser
      });
      // console.log("USER INFO:" + theUsername)
    })
    .catch(error => {
      console.log(error);
    });
});

module.exports = router;
