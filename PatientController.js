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
    res.redirect(302, `patient/home/${email}`);
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

// exports.find = async (req, res) => {
//   try {
//     const { email, latitude, longitude, specialty } = req.body;

//     const specialists = await Doctor.find({ specialty });
//     console.log(`specialists: ${specialists}`);
//     // Filter out specialists with missing or invalid location data
//     const validSpecialists = specialists.filter(
//       (s) => s.location && s.location.lat && s.location.lng
//     );

//     console.log(validSpecialists);

//     // Sort the valid specialists by distance from the patient's location
//     const sortedSpecialists = validSpecialists.sort((a, b) => {
//       const distanceA = geolib.getDistance(
//         { latitude, longitude },
//         { latitude: a.location.lat, longitude: a.location.lng }
//       );
//       const distanceB = geolib.getDistance(
//         { latitude, longitude },
//         { latitude: b.location.lat, longitude: b.location.lng }
//       );
//       return distanceA - distanceB;
//     });

//     console.log(sortedSpecialists);

//     // Check if there are any valid specialists
//     if (sortedSpecialists.length > 0) {
//       // Return the nearest specialist
//       const nearestSpecialist = sortedSpecialists[0];
//       console.log(nearestSpecialist);
//       const nearestSpecialistEmail = nearestSpecialist.email;
//       res.redirect(
//         302,
//         `/patient/connect?patientEmail=${email}&specialistEmail=${nearestSpecialistEmail}`
//       );
//     } else {
//       console.log("No valid specialists found.");
//       res.status(404).json({ error: "No valid specialists found." });
//     }
//   } catch (error) {
//     console.error("Error finding nearest specialist:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }

// };



exports.find = async (req, res) => {
  try {
    const { latitude, longitude, specialty,email } = req.body;

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
    const nearestSpecialistEmail = nearestSpecialist.email
     res.redirect(
        302,
        `/patient/connect?patientEmail=${email}&specialistEmail=${nearestSpecialistEmail}`
      );
  } catch (error) {
    console.error("Error finding nearest specialist:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
