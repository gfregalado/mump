const express = require('express');
const router  = express.Router();

// We're using index for our main landing page 

router.get('/user/tickets', (req, res, next) => {
  res.render('user/user-ticket-area');
});

router.get('/user/dashboard', (req, res, next) => {
  res.render('user/user-dashboard');
});





module.exports = router;
