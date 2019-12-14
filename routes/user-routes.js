const express = require('express');
const router = express.Router();
const Ticket = require("../models/ticket");


// GET - User ticket area view

router.use((req, res, next) => {
  if (req.session.currentUser) { // <== if there's user in the session (user is logged in)
    next(); // ==> go to the next route ---
  } else {                          //    |
    res.redirect("/login");         //    |
  }                                 //    |
}); // ------------------------------------           


router.get("/user/tickets", (req, res, next) => {
  res.render('user/user-ticket-area');
});


router.get("/user/dashboard", (req, res, next) => {
  const email = req.session.currentUser.email
  Ticket.find({ email: email })
    .then((tickets) => {
      console.log(tickets)
      res.render('user/user-dashboard', { userAuthenticated: req.session.currentUser, tickets: tickets });
    })
});



//Ticket Creation

router.post('/ticketcreation', (req, res, next) => {
  const title = req.body.title;
  const description = req.body.description;
  const email = req.session.currentUser.email

  Ticket.create({
    title, description, email
  }).then(() => {
    res.redirect("/user/dashboard");
  })
    .catch(error => {
      console.log(error);
    });
})


// //Render Tickets

// router.get('/rendertickets', (req, res, next) => {
//   const email = req.session.currentUser.email
//   Ticket.find({ email: email })
//     .then((tickets) => {
//       console.log(tickets)
//       res.send(tickets);
//     })
//     .catch(error => {
//       console.log(error);
//     });
// })

module.exports = router;
