// server.js
require("dotenv").config()
const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const sqlite3 = require("sqlite3").verbose(); // Import SQLite

const app = express();
const PORT = process.env.PORT || 5000;
const ORIGIN = process.env.ORIGIN || "*";
const RATE = process.env.RATE || 5;

// Middleware
app.use(cors({ origin: { ORIGIN } }));
app.use(express.json());

// Connect to the SQLite database
const db = new sqlite3.Database("./certificates.db", (err) => {
	if (err) {
		console.error("Error opening database", err.message);
	} else {
		console.log("Connected to the certificates.db SQLite database.");
	}
});

// Rate Limiter: 10 requests per minute per IP
const apiLimiter = rateLimit({
	windowMs: 1 * 60 * 1000,
	max: 5,
	message: {
		error: "Too many verification attempts from this IP. Please try again after a minute.",
	},
	standardHeaders: true,
	legacyHeaders: false,
});

// Verification Endpoint fetching from SQL Database
app.get("/api/verify/:cid", apiLimiter, (req, res) => {
	const cid = req.params.cid.toUpperCase().trim();

	// SQL Query
	const sql = `SELECT name, studentId, dateOfIssue, courseName FROM certificates WHERE cid = ?`;

	db.get(sql, [cid], (err, row) => {
		if (err) {
			console.error(err.message);
			return res
				.status(500)
				.json({
					error: "Internal server error connecting to the database.",
				});
		}

		if (row) {
			// Record found
			return res.status(200).json(row);
		} else {
			// Record not found
			return res
				.status(404)
				.json({
					error: "Certificate not found. Please check the CID.",
				});
		}
	});
});

app.listen(PORT, () => {
	console.log(`Backend server running on http://localhost:${PORT}`);
});
