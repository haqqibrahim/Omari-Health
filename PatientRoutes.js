const express = require("express");
const controller = require("./PatientController");
const router = express.Router();
const Patient = require("./Patient");
const Doctor = require("./Doctor");
const nodemailer = require("nodemailer");
router.get("/signup", (req, res) => {
  // Get the message parameter from the query string
  const error = req.query.error;
  if (error) {
    res.render("Patient/signup", { error: "Email already exists" });
  } else {
    res.render("Patient/signup", { error: "" });
  }
});

router.post("/signup", controller.signup);

router.get("/login", (req, res) => {
  const error = req.query.error;
  const error2 = req.query.errorPassword;
  if (error) {
    res.render("patient/login", { error: "Email not found" });
  } else if (error2) {
    res.render("patient/login", { error: "Incorrect Password" });
  } else {
    res.render("patient/login", { error: "" });
  }
});

router.post("/login", controller.login);

router.get("/home/:email", async (req, res) => {
  const { email } = req.params;
  const patient = await Patient.findOne({ email });
  res.render("Patient/home", { patient });
});

router.post("/find", controller.find);

router.get("/connect", async (req, res) => {
  const { patientEmail, specialistEmail } = req.query;
  const patient = await Patient.findOne({ email: patientEmail });
  const doctor = await Doctor.findOne({ email: specialistEmail });
  // use patientEmail and specialistEmail as needed
  res.render("Patient/connect", { patient, doctor });
});
module.exports = router;

// Nodemailer transporter
let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "dev.omari.ai@gmail.com",
    pass: "aswbgigvkdbtwoww",
  },
});

router.post("/link", async (req, res) => {
  const { doctor, link } = req.body;
  let mailOptions = {
    from: "dev.omari.ai@gmail.com", // sender address
    to: doctor, // list of receivers
    subject: "Omari Health consultation", // Subject line
    text: `Please find the link to the meeting. ${link}`, // plain text body
  };
  let mailOptions2 = {
    from: "dev.omari.ai@gmail.com", // sender address
    to: "yusraadeyeri45@gmail.com", // list of receivers
    subject: "New Omari Health consultation meeting", // Subject line
    text: `There is a new consultation meeting in progress. ${link}`, // plain text body
  };

  // Send the email
  transporter.sendMail(mailOptions, (err, info1) => {
    if (err) {
      console.error(err);
      res.status(500).send("Failed to send the statement.");
    }
    console.log("Email sent:", info1.response);
  });
  transporter.sendMail(mailOptions2, (err, info2) => {
    if (err) {
      console.error(err);
      res.status(500).send("Failed to send the statement.");
    }
    console.log("Email sent:", info2.response);
    return res.redirect(302, `/patient/sent`);
  });
});

router.get("/sent", (req, res) => {
  res.render("Patient/sent");
});
