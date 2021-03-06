const express = require("express");
const router = express.Router();
const Ticket = require("../models/ticket");
const User = require("../models/user");
const moment = require("moment");
const uploadCloud = require("../config/cloudinary.js");
const transporter = require("../config/nodemailer.js")

// ==================================================================================================

//Staff-Dashboard View

router.get("/staff/dashboard", (req, res, next) => {
  const email = req.session.currentUser.email;
  Ticket.find({ status: "Open" })
    .sort({ createdAt: -1 })
    .then(openTickets => {
      User.find({ super: false }).then(users => {
        Ticket.find({ status: "Closed" }).then(closedTickets => {
          res.render("staff/staff-dashboard", {
            userAuthenticated: req.session.currentUser,
            openTickets: openTickets,
            closedTickets: closedTickets,
            users: users
          });
        });
      });
    });
});

// ==================================================================================================

//Staff-Ticket View

router.get("/staff/staff-tickets", (req, res, next) => {
  Ticket.find({ status: "Open" })
    .sort({ createdAt: -1 })
    .then(tickets => {
      User.find().then(users => {
        res.render("staff/staff-current-tickets", {
          userAuthenticated: req.session.currentUser,
          tickets: tickets,
          users: users
        });
      });
    });
});

// ==================================================================================================

// Staff ticket Creation Modal

router.post(
  "/ticketcreation",
  uploadCloud.single("photo"),
  (req, res, next) => {
    const { title, description } = req.body;
    const imageName = req.file.originalName;
    const imagePath = req.file.url;
    const email = req.session.currentUser.email;
    const firstName = req.session.currentUser.firstName;
    const lastName = req.session.currentUser.lastName;
    const creationDate = moment().format("MMM Do YYYY");

    Ticket.create({
      title,
      description,
      imageName,
      imagePath,
      email,
      firstName,
      lastName,
      creationDate
    })
      .then(() => {
        res.redirect("/staff/staff-tickets");
      })
      .then(() => {
        res.render("staff/staff-current-tickets", {
          userAuthenticated: req.session.currentUser
        });
      })
      .catch(error => {
        console.log(error);
      });
  }
);

// ==================================================================================================

// Staff Users View

router.get("/staff/users", (req, res, next) => {
  User.find({ super: "false" })
    .sort({ firstName: -1 })
    .then(user => {
      res.render("staff/staff-users", {
        userAuthenticated: req.session.currentUser,
        user: user
      });
    });
});

// ==================================================================================================

//Staff Close Ticket
router.post("/staff/staff-ticket", (req, res, next) => {
  const ticketID = req.query.ticket_id;
  const currentTime = moment().format("MMMM Do YYYY, h:mm:ss a");

  Ticket.update(
    { _id: ticketID },
    { $set: { status: "Closed", closeDate: currentTime } }
  )
    .then(() => {
      res.redirect("/staff/closed-tickets");
    }).then(Ticket.findById(
      { _id: ticketID }).then(ticket => {
        transporter.sendMail({
          from: '"Mump Crew " <mumpcsteam@gmail.com>',
          to: `${ticket.email}`,
          subject: 'Your ticket was just solved!',
          text: 'Ticket',
          html: `<p>Hey there ${ticket.firstName}</p>
          <br>
          <p>We have just solved your ticket regarding ${ticket.title} that you opened on ${ticket.creationDate}. 
          We hope you are happy with the solution we have found for you.</p>
          <br>
          <p>Please reach out to the Mump team if you need anything else</p>
          <br>
          <p>Best regards,</p>
          <p>${req.session.currentUser.firstName} ${req.session.currentUser.lastName}</p>`
        })
      }
      ))

    .catch(error => {
      console.log(error);
    });
});

// ==================================================================================================

// Staff Closed Tickets view

router.get("/staff/closed-tickets", (req, res, next) => {
  Ticket.find({ status: "Closed" })
    .sort({ createdAt: -1 })
    .then(tickets => {
      res.render("staff/staff-closed-tickets", {
        userAuthenticated: req.session.currentUser,
        tickets: tickets
      });
    });
});

// ==================================================================================================

// Staff view of each individual ticket

router.get("/staff/staff-ticket", (req, res, next) => {
  const ticketID = req.query.ticket_id;
  Ticket.find({ _id: ticketID })
    .then(ticket => {
      res.render("staff/staff-ticket", {
        userAuthenticated: req.session.currentUser,
        ticket: ticket
      });
    })
    .catch(err => {
      console.log(err);
    });
});

// ==================================================================================================

// post message on ticket board

router.post("/staff/ticket-message", (req, res, next) => {
  const ticketID = req.query.ticket_id;
  const user = `${req.session.currentUser.firstName} ${req.session.currentUser.lastName}`;
  const message = req.body.message;
  const messageTime = moment().format("MMMM Do YYYY, h:mm:ss a");
  const avatar = req.session.currentUser.avatarPath;

  Ticket.update(
    { _id: ticketID },
    { $push: { comments: { user, message, messageTime, avatar } } }
  )
    .then(
      Ticket.find({ _id: ticketID }).then(ticket => {
        res.redirect(`/staff/staff-ticket?ticket_id=${ticketID}`)
        //   res.render("staff/staff-ticket", {
        //     userAuthenticated: req.session.currentUser,
        //     ticket: ticket
        //   });
      })
    )
    .catch(error => {
      console.log(error);
    });
});

// ==================================================================================================

// Make user admin

router.post("/staff/users", (req, res, next) => {
  const userID = req.query.user_id;
  console.log("I AM HERE" + userID);
  User.update({ _id: userID }, { super: true })
    .then(() => {
      res.redirect("/staff/users");
    })
    .catch(error => {
      console.log(error);
    });
});

module.exports = router;
