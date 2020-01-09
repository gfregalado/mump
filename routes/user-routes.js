const express = require("express");
const router = express.Router();
const Ticket = require("../models/ticket");
const User = require("../models/user");
const uploadCloud = require("../config/cloudinary.js");


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

router.get("/user/dashboard", (req, res, next) => {
  const email = req.session.currentUser.email;
  Ticket.find({ email: email }).then(tickets => {
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

// //Ticket Creation

// router.post("/ticketcreation", (req, res, next) => {
//   const title = req.body.title;
//   const description = req.body.description;
//   const email = req.session.currentUser.email;

//   Ticket.create({
//     title,
//     description,
//     email
//   })
//     .then(() => {
//       res.redirect("/user/dashboard");
//     })
//     .then(() => {
//       console.log("user2", req.session.currentUser);

//       res.render("user/user-dashboard", {
//         userAuthenticated: req.session.currentUser
//       });
//       // console.log("USER INFO:" + theUsername)
//     })
//     .catch(error => {
//       console.log(error);
//     });
// });

module.exports = router;
