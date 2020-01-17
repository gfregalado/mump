const express = require("express");
const router = express.Router();
const User = require("../models/user");

// We're using index for our main landing page

router.get("/", (req, res, next) => {
  res.render("index", { userAuthenticated: req.session.currentUser });
});

module.exports = router;
