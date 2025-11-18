const express = require("express");
const router = express.Router();
const Support = require("../../models/Support");

// Support form page
router.get("/support", (req, res) => {
    res.render("support");
});

// Submit support request
// router.post("/support", async (req, res) => {
//     const { name, email, subject, message } = req.body;

//     await Support.create({ name, email, subject, message });

//     res.render("success", { name: name });
// });
router.post("/support", async (req, res) => {
    const { name, email, subject, message } = req.body;

    await Support.create({ name, email, subject, message });

    res.render("support_success", { name });
});


// Show tickets in admin
const { isAdmin } = require("../../middleware/auth");
router.get("/admin/support", isAdmin, async (req, res) => {
    try {
        let tickets = await (require('../../db/adapter').Support.findAll());
        if (Array.isArray(tickets) && tickets.length && tickets[0].toObject) {
            tickets = tickets.map(t => t.toObject());
        } else if (Array.isArray(tickets) && tickets.length && tickets[0].dataValues) {
            tickets = tickets.map(t => t.dataValues);
        }
        tickets.sort((a, b) => new Date(b.date) - new Date(a.date));
        // use the admin folder view which includes actions
        res.render("admin/support_messages", { tickets });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error loading tickets');
    }
});

// View single support ticket
router.get("/admin/support/:id", isAdmin, async (req, res) => {
    try {
        const ticket = await require('../../db/adapter').Support.findById(req.params.id);
        if (!ticket) return res.status(404).send("Ticket not found");
        // normalize
        const t = ticket.dataValues ? ticket.dataValues : (ticket.toObject ? ticket.toObject() : ticket);
        res.render("admin/support_view", { ticket: t });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error loading ticket");
    }
});

// Resolve a ticket
router.post("/admin/support/resolve/:id", isAdmin, async (req, res) => {
    try {
        await require('../../db/adapter').Support.findByIdAndUpdate(req.params.id, { status: "resolved" });
        res.redirect("/admin/support");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error resolving ticket");
    }
});

// Delete a ticket
router.post("/admin/support/delete/:id", isAdmin, async (req, res) => {
    try {
        await require('../../db/adapter').Support.findByIdAndDelete(req.params.id);
        res.redirect("/admin/support");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error deleting ticket");
    }
});

module.exports = router;
