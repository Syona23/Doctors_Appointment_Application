const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");
const app = express();
const session = require("express-session");
const adminConfig = require("./config/admin");

// ===== Session setup =====
app.use(session({
  secret: "d9F!4bQ@7xTz#1kLmN$2pR^6sVw*8hJ",
  resave: false,
  saveUninitialized: true
}));

// ===== Middleware to protect admin page =====
function isAdmin(req, res, next) {
  if (req.session && req.session.isAdmin) {
    return next();
  } else {
    res.redirect("/login");
  }
}

// ===== Database Connection =====
mongoose.connect("mongodb://localhost:27017/appointmentsDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// ===== Middlewares =====
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

// ===== Routes =====
const appointmentRoutes = require("./routes/get/appointments");
app.use("/", appointmentRoutes);

// ===== Server Start =====
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
