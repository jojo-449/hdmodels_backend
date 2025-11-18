const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Generate Booking ID
function generateBookingID() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let id = "BK";
    for (let i = 0; i < 8; i++) {
        id += chars[Math.floor(Math.random() * chars.length)];
    }
    return id;
}

router.post("/add", (req, res) => {
    const {
        clientName,
        clientWhatsapp,
        instagramHandle,
        bookingDate,
        bookingTime,
        duration,
        modelCategory,
        shootType,
        location,
        requirements,
        specificRequirements   // <-- this is the one you asked about
    } = req.body;

    const booking_id = generateBookingID();
    const date_time = bookingDate + " at " + bookingTime;

    const sql = `
        INSERT INTO bookings 
        (booking_id, client_username, model_name, shoot_types, general_requirements, specific_requirements, date_time, duration, booked_via)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(sql, [
        booking_id,
        instagramHandle,     // client_username = IG username
        modelCategory,       // model name
        shootType,           // shoot types
        requirements,        // general requirements
        specificRequirements, // SPECIFIC REQUIREMENTS ADDED
        date_time,
        duration,
        clientWhatsapp ? "WhatsApp" : "Instagram" // booked via
    ], (err, result) => {
        if (err) return res.status(500).json({ error: err });

        res.json({
            success: true,
            booking_id,
            message: "Booking saved"
        });
    });
});

router.get("/", (req, res) => {
    db.query("SELECT * FROM bookings ORDER BY id DESC", (err, rows) => {
        if (err) return res.status(500).json({ error: err });
        res.json(rows);
    });
});

module.exports = router;
