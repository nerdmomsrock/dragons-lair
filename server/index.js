const express = require("express");
const session = require("express-session");
const massive = require("massive");
require("dotenv").config();

const PORT = 4000;
const app = express();

app.use(express.json());
app.listen(PORT, () => console.log(`Listening on Port ${PORT}`));

const { CONNECTION_STRING, SESSION_SECRET } = process.env;

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
