const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const PORT = process.env.PORT || 3000;

const PatientRouter = require("./PatientRoutes");
const DoctorRouter = require("./DoctorRoutes");
const app = express();
// Set the view engine to EJS
app.set("view engine", "ejs");


// Use body-parser middleware to parse request bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Set up MongoDB connection
const DB_URI =
  "mongodb+srv://enessyibrahim:haqq1234@cluster0.y4bhm0f.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
mongoose
  .connect(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.render("Welcome");
});

app.use("/patient", PatientRouter);
app.use("/doctor", DoctorRouter);

app.listen(PORT, () => {
  console.log(`Server is running at port: ${PORT}`);
});
