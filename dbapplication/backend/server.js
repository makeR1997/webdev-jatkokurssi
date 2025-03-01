const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(cors());

// Initialize database
const db = new sqlite3.Database("./database.db", (err) => {
    if (err) {
        console.error("Error opening database", err);
    } else {
        console.log("Database connected.");
        db.run(
            `CREATE TABLE IF NOT EXISTS items (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                quantity INTEGER NOT NULL
            )`,
            (err) => {
                if (err) {
                    console.error("Error creating table", err);
                } else {
                    console.log("Table 'items' is ready.");
                }
            }
        );
    }
});

// CRUD Routes

// Create
app.post("/items", (req, res) => {
    const { name, quantity } = req.body;
    db.run(
        "INSERT INTO items (name, quantity) VALUES (?, ?)",
        [name, quantity],
        function (err) {
            if (err) return res.status(400).json({ error: err.message });
            res.json({ id: this.lastID, name, quantity });
        }
    );
});

// Read (all)
app.get("/items", (req, res) => {
    db.all("SELECT * FROM items", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Read (single)
app.get("/items/:id", (req, res) => {
    db.get("SELECT * FROM items WHERE id = ?", [req.params.id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(row || {});
    });
});

// Update
app.put("/items/:id", (req, res) => {
    const { name, quantity } = req.body;
    db.run(
        "UPDATE items SET name = ?, quantity = ? WHERE id = ?",
        [name, quantity, req.params.id],
        function (err) {
            if (err) return res.status(400).json({ error: err.message });
            res.json({ message: "Item updated", changes: this.changes });
        }
    );
});

// Delete
app.delete("/items/:id", (req, res) => {
    db.run("DELETE FROM items WHERE id = ?", [req.params.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Item deleted", changes: this.changes });
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
