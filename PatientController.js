const Patient = require("./Patient");
const Doctor = require("./Doctor");
const geolib = require("geolib");
exports.signup = async (req, res) => {
  try {
    const { fullName, email, password, latitude, longitude } = req.body;

    const check = await Patient.findOne({ email });
    if (check) {
      // Redirect to success page with error message in query string
      return res.redirect(302, `/patient/signup?error=true`);
    }

    // Create a new Patient instance
    const patient = new Patient({
      fullName,
      email,
      password,
      location: {
        type: "Point",
        coordinates: [parseFloat(longitude), parseFloat(latitude)],
      },
    });

    // Save the patient to the database
    await patient.save();

    // Redirect to success page or send a response
    // res.redirect("/patient/home");
    res.redirect(302, `/patient/login`);
  } catch (error) {
    // Handle the error appropriately
    console.error("Error creating patient:", error);
    res.redirect(302, `/patient/signup?error=${error.message}`);
    res.status(500).send("Internal Server Error");
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const patient = await Patient.findOne({ email });
    if (!patient) {
      return res.redirect(302, `/patient/login?error=true`);
    }
    if (patient.password != password) {
      return res.redirect(302, `/patient/login?errorPassword=true`);
    }
    res.redirect(302, `/patient/home/${email}`);
  } catch (error) {
    console.error("Error creating patient:", error);
    res.redirect(302, `/patient/login?error=${error.message}`);
    res.status(500).send("Internal Server Error");
  }
};



exports.find = async (req, res) => {
  try {
    const { latitude, longitude, specialty, email } = req.body;

    // Find all specialists of the specified specialty
    const specialists = await Doctor.find({ specialty });

    if (specialists.length === 0) {
      return res.status(404).json({ error: "No valid specialists found." });
    }

    // Calculate the distance between the user's location and each specialist's location
    const distances = specialists.map((specialist) => {
      return {
        specialist: specialist,
        distance: geolib.getDistance(
          { latitude, longitude },
          {
            latitude: specialist.location.coordinates[1],
            longitude: specialist.location.coordinates[0],
          }
        ),
      };
    });

    // Sort the distances in ascending order
    distances.sort((a, b) => a.distance - b.distance);

    // Return the nearest specialist
    const nearestSpecialist = distances[0].specialist;
    const nearestSpecialistEmail = nearestSpecialist.email;
    // console.log the nearest specialist found with the distance in meters
    // console.log only the distance
    console.log(
      `Nearest specialist distance: ${distances[0].distance.toLocaleString(
        "en-US"
      )} meters`
    );
    const meters = distances[0].distance.toLocaleString("en-US");
    res.redirect(
      302,
      `/patient/connect?patientEmail=${email}&specialistEmail=${nearestSpecialistEmail}&meters=${meters}`
    );
  } catch (error) {
    console.error("Error finding nearest specialist:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
