const express = require("express");
const session = require("express-session");
const massive = require("massive");
require("dotenv").config();
const authCtrl = require("./controllers/authController");
const treasureCtrl = require("./controllers/treasureController");
const auth = require("./middleware/authMiddleware");

//const SERVER_PORT = 4000;
const app = express();
const { CONNECTION_STRING, SESSION_SECRET, SERVER_PORT } = process.env;

app.use(express.json());

massive({
  connectionString: CONNECTION_STRING,
  ssl: { rejectUnauthorized: false },
}).then((db) => {
  app.set("db", db);
  console.log("The database is connected.");
});

app.use(
  session({
    resave: true,
    saveUninitialized: false,
    secret: SESSION_SECRET,
  })
);

//auth endpoints
app.post("/auth/register", authCtrl.register);
app.post("/auth/login", authCtrl.login);
app.get("/auth/logout", authCtrl.logout);
app.get("/api/treasure/dragon", treasureCtrl.dragonTreasure);
app.get("/api/treasure/user", auth.usersOnly, treasureCtrl.getUserTreasure);
app.post("/api/treasure/user", auth.usersOnly, treasureCtrl.addUserTreasure);
app.get("/api/treasure/all", auth.usersOnly, treasureCtrl.getAllTreasure);
app.get("/api/treasure/all", auth.usersOnly, auth.adminsOnly);

app.listen(SERVER_PORT, () => console.log(`Listening on Port ${SERVER_PORT}`));
