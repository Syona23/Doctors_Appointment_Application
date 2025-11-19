require('dotenv').config();
console.log("Loaded DB_TYPE:", process.env.DB_TYPE);
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");
const app = express();
const session = require("express-session");
const cookieParser = require("cookie-parser");
const adminConfig = require("./config/admin");



// setup
app.use(session({
  secret: adminConfig.jwtSecret,
  resave: false,
  saveUninitialized: true
}));

// cookies for JWT
app.use(cookieParser());


// middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

// middleware admin page
function isAdmin(req, res, next) {
  if (req.session && req.session.isAdmin) {
    return next();
  } else {
    res.redirect("/login");
  }
}

// database
const dotenv = require('dotenv');
dotenv.config();
const dbType = process.env.DB_TYPE || 'mongodb';
if (dbType === 'postgres') {
  const adapter = require('./db/adapter');
  // sync sequelize
  adapter.ensureSync();
} else {
  mongoose.connect("mongodb://localhost:27017/appointmentsDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

//support
const supportRoutes = require("./routes/get/support");
app.use("/", supportRoutes);



// routes 
const appointmentRoutes = require("./routes/get/appointments");
app.use("/", appointmentRoutes);

// server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
