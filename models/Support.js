const mongoose = require("mongoose");

const supportSchema = new mongoose.Schema({
    name: String,
    email: String,
    subject: String,
    message: String,
    date: { type: Date, default: Date.now },
    status: { type: String, default: "open" }
});

module.exports = mongoose.model("Support", supportSchema);
