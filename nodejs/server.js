require("dotenv").config();
const express = require("express");
const app = express();
const MongoClient = require("mongodb").MongoClient;
const { ObjectId } = require("mongodb");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const session = require("express-session");
const cors = require("cors");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(
  session({
    secret: process.env.COOKIESECRET,
    resave: true,
    saveUninitialized: false,
  })
);
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
  done(null, user._id);
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
    failureRedirect: "http://localhost:3000/register",
    failureFlash: true,
  }),
  (req, res) => {
    req.login(req.user, (err) => {
      if (err) {
        console.error("Error loggint in: ", err);
        res.redirect("http://localhost:3000/register");
      } else {
        res.redirect(`http://localhost:3000/tasks/${req.user._id}`);
      }
    });
  }
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
  let user_id = req.params.user;
  console.log(user_id);
  await db
    .collection("post")
    .find({ writer: ObjectId(user_id) })
    .toArray((err, result) => {
      res.send(result);
    });
});

app.post("/api/complete/:id/:status", (req, res) => {
  const updatedStatus = req.params.status === "true";
  console.log(updatedStatus);
  db.collection("post").updateOne(
    { _id: ObjectId(req.params.id) },
    { $set: { completed: !updatedStatus } },
    (err, result) => {
      res.send("success to update the status");
    }
  );
});

app.delete("/api/delete/:id", (req, res) => {
  db.collection("post").deleteOne(
    { _id: ObjectId(req.params.id) },
    (err, result) => {
      res.send("successfully delete data in mongodb");
    }
  );
});

app.post("/api/add", (req, res) => {
  db.collection("post").insertOne(
    {
      title: req.body.title,
      content: req.body.content,
      created_at: req.body.created_at,
      writer: req.user._id,
      completed: false,
    },
    (err, result) => {
      res.redirect(`http://localhost:3000/tasks/${req.user._id}`);
    }
  );
});

app.post("/api/edit", (req, res) => {
  console.log(req.body.taskId);
  db.collection("post").updateOne(
    { _id: ObjectId(req.body.taskId) },
    { $set: { title: req.body.title, content: req.body.content } },
    (err, result) => {
      res.redirect(`http://localhost:3000/tasks/${req.user._id}`);
    }
  );
});
