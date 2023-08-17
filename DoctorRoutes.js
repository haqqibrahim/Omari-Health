const express = require("express");
const controller = require("./DoctorController");
const router = express.Router();
const Doctor = require("./Doctor");

router.get("/signup", (req, res) => {
  const error = req.query.error;
  if (error) {
    res.render("Doctor/signup", { error: "Email already exists" });
  } else {
    res.render("Doctor/signup", { error: "" });
  }
});
router.post("/signup", controller.signup);

router.get("/login", (req, res) => {
  const error = req.query.error;
  const error2 = req.query.errorPassword;
  if (error) {
    res.render("Doctor/login", { error: "Email not found" });
  } else if (error2) {
    res.render("Doctor/login", { error: "Incorrect Password" });
  } else {
    res.render("Doctor/login", { error: "" });
  }
});

router.post("/login", controller.login);

router.get("/home/:email", async (req, res) => {
  try {
    const {email} = req.params;
    console.log(email);
    const doctor = await Doctor.findOne({ email: email });
    console.log(email)
    res.render("Doctor/home", { doctor });
  } catch (error) {
    console.log(error.message);
  }
});
module.exports = router;
