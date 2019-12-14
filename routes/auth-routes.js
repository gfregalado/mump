const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

// SIGNUP ROUTES

router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;

  if (email === "" || password === "") {
    res.render("auth/signup", {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  }

  User.findOne({
    email: email
  })
    .then(user => {
      if (user !== null) {
        res.render("auth/signup", {
          errorMessage: "The username already exists!"
        });
        return;
      }
      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      User.create({
        email,
        password: hashPass,
        firstName,
        lastName
      })
        .then(() => {
          req.session.currentUser = user;
          res.render("index", { userAuthenticated: req.session.currentUser });
        })
        .catch(error => {
          console.log(error);
        });
    })
    .catch(error => {
      next(error);
    });
});

//LOGIN ROUTES

router.get("/login", (req, res, next) => {
  res.render("auth/login");
});

router.post("/login", (req, res, next) => {
  const theEmail = req.body.email;
  const thePassword = req.body.password;

  if (theEmail === "" || thePassword === "") {
    res.render("auth/login", {
      errorMessage: "Please enter both, username and password to sign up."
    });
    return;
  }

  User.findOne({ email: theEmail })
    .then(user => {
      if (!user) {
        res.render("auth/login", {
          errorMessage: "The username doesn't exist."
        });
        return;
      }

      if (bcrypt.compareSync(thePassword, user.password)) {
        // Save the login in the session!
        req.session.currentUser = user;

        res.render("user/user-dashboard", { userAuthenticated: req.session.currentUser })
      } else {
        res.render("auth/login", {
          errorMessage: "Incorrect password"
        });
      }
    })
    .catch(error => {
      next(error);
    });
});



//Logout Routes

router.get("/logout", (req, res, next) => {
  req.session.destroy((err) => {
    // cannot access session here
    res.redirect("/");
  });
});


module.exports = router;

// routes with modal

// // SIGNUP ROUTES

// router.get("/signup", (req, res, next) => {
//   res.render("signup");
// });

// router.post("/signup", (req, res) => {
//   const username = req.body.username;
//   const password = req.body.password;
//   if (username === "" || password === "") {
//     res.render("signup", {
//       errorMessage: "Indicate a username and a password to sign up"
//     });
//     return;
//   }

//   User.findOne({
//     "username": username
//   })
//     .then(user => {
//       if (user !== null) {
//         res.render("signup", {
//           errorMessage: "The username already exists!"
//         });
//         return;
//       }
//       const salt = bcrypt.genSaltSync(bcryptSalt);
//       const hashPass = bcrypt.hashSync(password, salt);
//       User.create({
//         username,
//         password: hashPass
//       })
//         .then(() => {
//           req.session.currentUser = user
//           res.redirect("/");
//         })
//         .catch(error => {
//           console.log(error);
//         })
//     })
//     .catch(error => {
//       next(error);
//     })
// });

// //LOGIN ROUTES

// router.post("/login", (req, res, next) => {
//   const theUsername = req.body.username;
//   const thePassword = req.body.password;

//   // if (theUsername === "" || thePassword === "") {
//   //   res.render("index", {
//   //     errorMessage: "Please enter both, username and password to sign up."
//   //   });
//   //   return;x
//   // }

//   User.findOne({ "username": theUsername })
//     .then(user => {
//       if (!user) {
//         //   res.render("index", {
//         //     errorMessage: "The username doesn't exist."
//         //   });
//         //   return
//         return "The username doesn't exit"
//       }

//       if (bcrypt.compareSync(thePassword, user.password)) {
//         // Save the login in the session!
//         req.session.currentUser = user;
//         res.redirect("/");
//       } else {
//         //   res.render("index", {
//         //     errorMessage: "Incorrect password"
//         //   });
//         return "Incorrect password";
//       }
//     })
//     .catch(error => {
//       next(error);
//     })
// })


