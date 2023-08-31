require("dotenv").config();
const express = require("express");
const app = express();
const MongoClient = require("mongodb").MongoClient;
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());

var db;
MongoClient.connect(
  process.env.DB_URL,
  { useUnifiedTopology: true },
  function (err, client) {
    if (err) return console.log(err);
    db = client.db("todolist");

    app.listen(process.env.PORT, function () {
      console.log("listening on 8080");
    });
  }
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  db.collection("user").findOne({ _id: ObjectId(id) }, (err, result) => {
    done(null, result);
  });
});

passport.use(
  new LocalStrategy(
    {
      usernameField: "userid",
      passwordField: "userpw",
      session: true,
      passReqToCallback: false,
    },
    function (InputId, InputPw, done) {
      console.log(InputId, InputPw);
      db.collection("user").findOne({ userid: InputId }, (err, result) => {
        if (err) console.log(err);

        if (!result) return done(null, false, { message: "Incorrect userid" });
        if (InputPw == result.userpw) return done(null, result);
        else return done(null, false, { message: "Incorrect password" });
      });
    }
  )
);

app.post(
  "/api/signin",
  passport.authenticate("local", {
    successRedirect: `http://localhost:3000/home/${req.user._id}`,
    failureRedirect: "http://localhost:3000/register",
    successFlash: "Welcome to chaek todo",
    failureFlash: true,
  })
);

app.post("/api/signup", (req, res) => {
  db.collection("user").insertOne(
    {
      username: req.body.username,
      userid: req.body.userid,
      userpw: req.body.userpw,
    },
    (err, result) => {
      res.redirect("http://localhost:3000/register");
    }
  );
});

app.get("/api/signout", (req, res) => {
  req.logout();
  req.session.save((err) => {
    res.redirect("http://localhost:3000/register");
  });
});

app.get("/api/tasks/:user", async (req, res) => {
  let userId = req.params.user;
  await db
    .collection("post")
    .find({ writer: new ObjectId(userId) })
    .toArray((err, result) => {
      res.send(result);
    });
});
