const db = require("./db");
const path = require("path");
const CONSTANTS = require("./constants");
/** Get All Assignments */
const GetAllAssignments = async (req, res) => {
  const query =
    "SELECT assignment.* ,doctor.username,doctor.email FROM assignments AS assignment RIGHT JOIN users AS doctor ON assignment.doctor_id = doctor.id;";
  db.pool.query({ sql: query, nestTables: "_" }, null, (err, results) => {
    res.json({ assignments: results });
  });
};
/** Get Submissions for a specific assignment */

const GetSubmissionsForAssignmentById = async (req, res) => {
  const assignment_id = req.params.assignment_id;
  const query =
    "SELECT * FROM submissions as submission RIGHT JOIN users as student ON submission.student_id = student.id WHERE assignment_id = ?;";
  db.pool.query(
    { sql: query, nestTables: "_", values: [assignment_id] },
    (err, results) => {
      if (err) {
        console.log(err);
        res.json({ error: "error" });
        res.end();
      } else {
        res.json({ submissions: results });
        res.end();
      }
    }
  );
};

/** Get Assignmenta for a specific doctor */

const GetAssignmentsByDoctorId = async (req, res) => {
  const doctor_id = req.params.doctor_id;
  const query = "SELECT * FROM assignments WHERE doctor_id = ?;";
  db.pool.query({ sql: query, values: [doctor_id] }, (err, results) => {
    if (err) {
      console.log(err);
      res.json({ error: "error" });
      res.end();
    } else {
      res.json({ assignments: results });
      res.end();
    }
  });
};

/** add assignment */

const AddAssignment = async (req, res) => {
  let name = req.body.name;
  let details = req.body.details;
  let deadline = req.body.deadline;
  let filename = null;

  if (req.file) {
    filename = path.resolve(
      CONSTANTS.ASSIGNMENTS_PATH + "/" + req.file.filename
    );
  }

  const query =
    "INSERT INTO assignments (name,details,file,deadline,doctor_id) VALUES (?,?,?,?,?);";
  db.pool.query(
    {
      sql: query,
      values: [name, details, filename, deadline, req.session.user.id],
    },
    (err, results) => {
      if (err) {
        console.log(err);
        res.json({ error: "error" });
      } else {
        res.json({
          assignment: results[0],
        });
        res.end();
      }
    }
  );
};

/** student: add submission */

const AddSubmission = async (req, res) => {
  let student_id = req.session.user.id;
  let assignment_id = req.params.assignment_id;
  let filename = path.resolve(
    CONSTANTS.SUBMISSIONS_PATH + "/" + req.file.filename
  );
  const query =
    "INSERT INTO submissions (assignment_id,student_id,submission_file) VALUES (?,?,?);";

  db.pool.query(
    {
      sql: query,
      values: [assignment_id, student_id, filename],
    },
    (err, results) => {
      if (err) {
        console.log(err);
        res.json({ error: "error" });
      } else {
        res.json({
          assignment: results[0],
        });
        res.end();
      }
    }
  );
};

module.exports = {
  GetAllAssignments,
  GetSubmissionsForAssignmentById,
  GetAssignmentsByDoctorId,
  AddAssignment,
  AddSubmission,
};
