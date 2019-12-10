const express = require('express');
const router  = express.Router();

// GET - User ticket area view

router.get('/user/tickets', (req, res, next) => {
  res.render('user/user-ticket-area');
});

// GET - User dashboard view

router.get('/user/dashboard', (req, res, next) => {
  res.render('user/user-dashboard');
});





module.exports = router;
