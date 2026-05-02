// importData.js
const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");
const csv = require("csv-parser");

// Connect to (or create) the local SQLite database file
const db = new sqlite3.Database("./certificates.db", (err) => {
	if (err) {
		console.error("Error opening database:", err.message);
		process.exit(1);
	}
	console.log("Connected to the SQLite database.");
});

db.serialize(() => {
	// 1. Create the table
	db.run(`CREATE TABLE IF NOT EXISTS certificates (
        cid TEXT PRIMARY KEY,
        name TEXT,
        studentId TEXT,
        dateOfIssue TEXT,
        courseName TEXT
    )`);

	// 2. Prepare the insert statement (INSERT OR REPLACE updates existing CIDs)
	const stmt = db.prepare(
		"INSERT OR REPLACE INTO certificates (cid, name, studentId, dateOfIssue, courseName) VALUES (?, ?, ?, ?, ?)",
	);

	// 3. Read the CSV and insert rows
	let rowCount = 0;
	fs.createReadStream("data.csv")
		.pipe(csv())
		.on("data", (row) => {
			// Ensure CID is uppercase for consistent querying
			const cid = row.cid ? row.cid.toUpperCase().trim() : "";
			stmt.run(
				cid,
				row.name,
				row.studentId,
				row.dateOfIssue,
				row.courseName,
			);
			rowCount++;
		})
		.on("end", () => {
			stmt.finalize();
			console.log(
				`Successfully imported ${rowCount} records from CSV into the database.`,
			);
			db.close();
		});
});
