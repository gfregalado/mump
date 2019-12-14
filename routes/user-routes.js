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
  console.log("userdashboard", req.session.currentUser);
  res.render('user/user-dashboard', { userAuthenticated: req.session.currentUser });
});



//Ticket Creation

router.post('/ticketcreation', (req, res, next) => {
  const title = req.body.title;
  const description = req.body.description;
  const email = req.session.currentUser.email
  console.log("user", req.session.currentUser);

  Ticket.create({
    title, description, email
  }).then(() => {
    console.log("user2", req.session.currentUser);

    res.render("user/user-dashboard", { userAuthenticated: req.session.currentUser });
    // console.log("USER INFO:" + theUsername)
  })
    .catch(error => {
      console.log(error);
    });
})

module.exports = router;
