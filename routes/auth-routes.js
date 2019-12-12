const express = require('express');
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const bcryptSalt = 10;



// SIGNUP ROUTES

router.get("/signup", (req, res, next) => {
  res.render("signup");
});

router.post("/signup", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username === "" || password === "") {
    res.render("signup", {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  }

  User.findOne({
    "username": username
  })
    .then(user => {
      if (user !== null) {
        res.render("signup", {
          errorMessage: "The username already exists!"
        });
        return;
      }
      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);
      User.create({
        username,
        password: hashPass
      })
        .then(() => {
          req.session.currentUser = user
          res.redirect("/");
        })
        .catch(error => {
          console.log(error);
        })
    })
    .catch(error => {
      next(error);
    })
});

//LOGIN ROUTES


router.post("/login", (req, res, next) => {
  console.log("hello im in login route")
  const theUsername = req.body.username;
  const thePassword = req.body.password;

  // if (theUsername === "" || thePassword === "") {
  //   res.render("index", {
  //     errorMessage: "Please enter both, username and password to sign up."
  //   });
  //   return;x
  // }

  User.findOne({ "username": theUsername })
    .then(user => {
      if (!user) {
        //   res.render("index", {
        //     errorMessage: "The username doesn't exist."
        //   });
        //   return
        return "The username doesn't exit"
      }

      if (bcrypt.compareSync(thePassword, user.password)) {
        // Save the login in the session!
        req.session.currentUser = user;
        res.redirect("/");
      } else {
        //   res.render("index", {
        //     errorMessage: "Incorrect password"
        //   });
        return "Incorrect password";
      }
    })
    .catch(error => {
      next(error);
    })
})




module.exports = router;
