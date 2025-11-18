// const express = require("express");
// const router = express.Router();
// const Appointment = require("../../models/Appointment");
// const adminConfig = require("../../config/admin");
// function isAdmin(req, res, next) {
//     if (req.session && req.session.isAdmin) {
//         return next();
//     } else {
//         res.redirect("/login");
//     }
// }
// router.get("/login", (req, res) => {
//     res.render("login", { error: null });
// });
// router.post("/login", (req, res) => {
//     const { username, password } = req.body;
//     if (username === adminConfig.username && password === adminConfig.password) {
//         req.session.isAdmin = true;
//         res.redirect("/admin");
//     } else {
//         res.render("login", { error: "<div class='alert alert-danger'>Invalid credentials</div>" });
//     }
// });
// router.get("/logout", (req, res) => {
//     req.session.destroy(() => {
//         res.redirect("/login");
//     });
// });

// // Home Page
// router.get("/", (req, res) => {
//     res.render("index");
// });

// // Book Appointment Page
// router.get("/book", (req, res) => {
//     res.render("book");
// });





// // Handle Appointment Submission
// router.post("/book", async (req, res) => {
//     const { name, email, phone, date, time, reason } = req.body;

//     const newAppointment = new Appointment({
//         name,
//         email,
//         phone,
//         date,
//         time,
//         reason,
//     });

//     await newAppointment.save();
//     res.render("success", { name });
// });

// // Admin Dashboard
// router.get("/admin", isAdmin, async (req, res) => {
//     try {
//         const appointments = await Appointment.find().sort({
//             status: 1 
//         });

//         const statusOrder = { pending: 1, accepted: 2, completed: 3 };
//         appointments.sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);

//         res.render("admin", { appointments });
//     } catch (err) {
//         res.status(500).send("Error loading appointments");
//     }
// });

// router.post("/admin/update/:id", isAdmin, async (req, res) => {
//     try {
//         const { status } = req.body;
//         await Appointment.findByIdAndUpdate(req.params.id, { status });
//         res.redirect("/admin");
//     } catch (err) {
//         console.error(err);
//         res.status(500).send("Error updating appointment");
//     }
// });
// router.post("/admin/delete/:id", isAdmin, async (req, res) => {
//   try {
//     await Appointment.findByIdAndDelete(req.params.id);
//     res.redirect("/admin");
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Error deleting appointment");
//   }
// });

// module.exports = router;
const express = require("express");
const router = express.Router();
const adapter = require("../../db/adapter");
const adminConfig = require("../../config/admin");
const { generateToken, isAdmin } = require("../../middleware/auth");
router.get("/login", (req, res) => {
    res.render("login", { error: null });
});
router.post("/login", (req, res) => {
    const { username, password } = req.body;
    if (username === adminConfig.username && password === adminConfig.password) {
        // create JWT and set as httpOnly cookie
        const token = generateToken({ username });
        res.cookie("token", token, { httpOnly: true, sameSite: "lax" });
        // keep session for backward compatibility
        req.session.isAdmin = true;
        res.redirect("/admin");
    } else {
        res.render("login", { error: "<div class='alert alert-danger'>Invalid credentials</div>" });
    }
});
router.get("/logout", (req, res) => {
    res.clearCookie("token");
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

    // Use adapter create to support MongoDB (Mongoose) and Postgres (Sequelize)
    try {
        await adapter.Appointment.create({
            name,
            email,
            phone,
            date,
            time,
            reason,
        });
        res.render("success", { name });
    } catch (err) {
        console.error('Error creating appointment:', err);
        res.status(500).send('Error creating appointment');
    }
});

// Admin Dashboard
router.get("/admin", isAdmin, async (req, res) => {
    try {
        // unified API: adapter returns arrays for findAll/find
        let appointments = await (adapter.Appointment.findAll ? adapter.Appointment.findAll() : adapter.Appointment.findAll());
        // normalize Sequelize result (plain objects)
        if (Array.isArray(appointments) && appointments.length && appointments[0].toObject) {
            appointments = appointments.map(a => a.toObject());
        } else if (Array.isArray(appointments) && appointments.length && appointments[0].dataValues) {
            appointments = appointments.map(a => a.dataValues);
        }

        const statusOrder = { pending: 1, accepted: 2, completed: 3 };
        appointments.sort((a, b) => (statusOrder[a.status] || 0) - (statusOrder[b.status] || 0));

        res.render("admin", { appointments });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error loading appointments");
    }
});

router.post("/admin/update/:id", isAdmin, async (req, res) => {
        try {
                const { status } = req.body;
                await adapter.Appointment.findByIdAndUpdate(req.params.id, { status });
                res.redirect("/admin");
        } catch (err) {
                console.error(err);
                res.status(500).send("Error updating appointment");
        }
});
router.post("/admin/delete/:id", isAdmin, async (req, res) => {
    try {
        await adapter.Appointment.findByIdAndDelete(req.params.id);
        res.redirect("/admin");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error deleting appointment");
    }
});

module.exports = router;