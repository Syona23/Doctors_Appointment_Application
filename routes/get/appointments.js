const express = require("express");
const router = express.Router();
const Appointment = require("../../models/Appointment");
const adminConfig = require("../../config/admin");
function isAdmin(req, res, next) {
    if (req.session && req.session.isAdmin) {
        return next();
    } else {
        res.redirect("/login");
    }
}
router.get("/login", (req, res) => {
    res.render("login", { error: null });
});
router.post("/login", (req, res) => {
    const { username, password } = req.body;
    if (username === adminConfig.username && password === adminConfig.password) {
        req.session.isAdmin = true;
        res.redirect("/admin");
    } else {
        res.render("login", { error: "<div class='alert alert-danger'>Invalid credentials</div>" });
    }
});
router.get("/logout", (req, res) => {
    req.session.destroy(() => {
        res.redirect("/login");
    });
});

// Home Page
router.get("/", (req, res) => {
    res.render("index");
});

// Book Appointment Page
router.get("/book", (req, res) => {
    res.render("book");
});

// Handle Appointment Submission
router.post("/book", async (req, res) => {
    const { name, email, phone, date, time, reason } = req.body;

    const newAppointment = new Appointment({
        name,
        email,
        phone,
        date,
        time,
        reason,
    });

    await newAppointment.save();
    res.render("success", { name });
});

// Admin Dashboard
router.get("/admin", isAdmin, async (req, res) => {
    try {
        const appointments = await Appointment.find().sort({
            status: 1 
        });

        const statusOrder = { pending: 1, accepted: 2, completed: 3 };
        appointments.sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);

        res.render("admin", { appointments });
    } catch (err) {
        res.status(500).send("Error loading appointments");
    }
});

router.post("/admin/update/:id", isAdmin, async (req, res) => {
    try {
        const { status } = req.body;
        await Appointment.findByIdAndUpdate(req.params.id, { status });
        res.redirect("/admin");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error updating appointment");
    }
});
router.post("/admin/delete/:id", isAdmin, async (req, res) => {
  try {
    await Appointment.findByIdAndDelete(req.params.id);
    res.redirect("/admin");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting appointment");
  }
});

module.exports = router;
