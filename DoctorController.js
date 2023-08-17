const Doctor = require("./Doctor");

exports.signup = async (req, res) => {
  try {
    // Extract fields from request body
    const { fullName, email, specialty, password, latitude, longitude } =
      req.body;
    const check = await Doctor.findOne({ email });
    if (check) {
      return res.redirect(302, `/doctor/signup?error=true`);
    }
    // Create new doctor instance using Mongoose schema
    const doctor = new Doctor({
      fullName,
      email,
      specialty,
      password,
      location: {
        type: "Point",
        coordinates: [parseFloat(longitude), parseFloat(latitude)],
      },
    });

    // Save doctor instance to database
    await doctor.save();

    // Redirect to success page with success message in query string
    res.redirect(302, `/doctor/home/${email}`);
  } catch (error) {
    // Redirect to error page with error message in query string
    // Handle the error appropriately
    console.error("Error creating patient:", error);
    res.redirect(302, `/doctor/signup?error=${error.message}`);
    res.status(500).send("Internal Server Error");
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const doctor = await Doctor.findOne({ email });
    if (!doctor) {
      return res.redirect(302, `/doctor/login?error=true`);
    }
    if (doctor.password != password) {
      return res.redirect(302, `/doctor/login?errorPassword=true`);
    }
    res.redirect(302, `/doctor/home/${email}`);
  } catch (error) {
    console.error("Error creating patient:", error);
    res.redirect(302, `/doctor/login?error=${error.message}`);
    res.status(500).send("Internal Server Error");
  }
};
