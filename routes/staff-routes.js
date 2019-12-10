const express = require('express');
const router = express.Router();

//Staff-dashboard View

router.get('/staff-dashboard', (req, res, next) => {
  res.render('staff/staff-dashboard.hbs');
});


//Staff-Ticket View

router.get('/staff-tickets', (req, res, next) => {
  res.render('staff/staff-ticket-area');
});


module.exports = router;