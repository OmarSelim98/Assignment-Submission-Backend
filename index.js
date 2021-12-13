const express = require("express");
const session = require("express-session");
const Auth = require("./auth");
const Assignments = require("./assignments");
const path = require("path");
const multer = require("multer");
const CONSTANTS = require("./constants");
const cors = require("cors");

const app = express();

const assignments_storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, CONSTANTS.ASSIGNMENTS_PATH);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const submissions_storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, CONSTANTS.SUBMISSIONS_PATH);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const port = process.env.PORT || 8080;

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["POST", "PUT", "GET", "OPTIONS", "HEAD"],
    credentials: true,
  })
);
app.use(express.json());

app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);
/** Test */
app.get("/", async (req, res) => {
  console.log(req.path);
  res.end();
});

/** AUTH */
app.use(Auth.AuthGuard); // auth middleware
app.get("/auth-required", Auth.requiredAuth); // auth required
app.post("/login", Auth.Login); // login

/** Assignments */

// get all with doctors details
app.get("/assignments/all", Assignments.GetAllAssignments);

// get submissions for assignment
app.get(
  "/assignments/:assignment_id/submissions",
  Assignments.GetSubmissionsForAssignmentById
);

// get assignments for a dr.
app.get(
  "/assignments/byDoctor/:doctor_id",
  Assignments.GetAssignmentsByDoctorId
);

// post a new assignment.
app.post(
  "/assignments",
  multer({ storage: assignments_storage }).single("file"),
  Assignments.AddAssignment
);

//post a submission for an assignment

app.post(
  "/assignments/:assignment_id/submit",
  multer({ storage: submissions_storage }).single("file"),
  Assignments.AddSubmission
);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
