const express = require('express');
const router  = express.Router();

// We're using index for our main landing page 

router.get('/', (req, res, next) => {
  res.render('index');
});




module.exports = router;
