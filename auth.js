const db = require("./db");

const execludedPaths = ["/login", "/auth-required"];

const AuthGuard = (req, res, next) => {
//   if (!execludedPaths.includes(req.path)) {
//     console.log("Auth");
//     if (req.session.loggedin) {
//       next();
//     } else {
//       res.json({ error: "auth" });
//     }
//   } else {
    next();
 // }
};

const requiredAuth = (req, res) => {
  res.json({ error: "auth" });
  res.end();
};

const Login = async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const query = "SELECT * FROM users WHERE username=? AND password=?;";

  db.pool.query(query, [username, password], (err, results) => {
    if (results.length > 0) {
      req.session.loggedin = true;
      req.session.user = results[0];
      res.json({ user: results[0] });
      res.end();
    } else {
      res.json({ error: `Wrong username & password combination` });
      res.end();
    }
  });
};
module.exports = { AuthGuard, requiredAuth, Login };
