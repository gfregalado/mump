const express = require('express');
const router = express.Router();
const Ticket = require("../models/ticket");


// GET - User ticket area view

router.get('/user/tickets', (req, res, next) => {
  if (req.session.currentUser) { // <== if there's user in the session (user is logged in)
    next(); // ==> go to the next route ---
  } else {                          //    |
    res.redirect("/login");         //    |
  }                                 //    |
}); // ------------------------------------                                
//     | 
//     V
router.get("/user/tickets", (req, res, next) => {
  res.render('user/user-ticket-area');
});

// GET - User dashboard view

router.get('/user/dashboard', (req, res, next) => {
  if (req.session.currentUser) { // <== if there's user in the session (user is logged in)
    next(); // ==> go to the next route ---
  } else {                          //    |
    res.redirect("/login");         //    |
  }                                 //    |
}); // ------------------------------------                                
//     | 
//     V
router.get("/user/dashboard", (req, res, next) => {
  res.render('user/user-dashboard');
});



//Ticket Creation

router.post('/ticketcreation', (req, res, next) => {
  const title = req.body.title;
  const description = req.body.description;

  Ticket.create({
    title, description
  }).then(() => {

    res.render("user/user-dashboard");
  })
    .catch(error => {
      console.log(error);
    });
})

module.exports = router;
