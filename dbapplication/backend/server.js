const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "public"))); // Serve static files

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

// Route to get all items
app.get("/items", (req, res) => {
    db.all("SELECT * FROM items", [], (err, rows) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// Route to add a new item
app.post("/items", (req, res) => {
    console.log("Received POST request:", req.body); // Debugging log

    const { name, quantity } = req.body;
    if (!name || quantity == null) {
        console.error("Invalid input:", req.body);
        return res.status(400).json({ error: "Name and quantity are required" });
    }

    db.run(
        "INSERT INTO items (name, quantity) VALUES (?, ?)",
        [name, quantity],
        function (err) {
            if (err) {
                console.error("Database error:", err);
                return res.status(500).json({ error: err.message });
            }
            console.log("Item added:", { id: this.lastID, name, quantity });
            res.json({ id: this.lastID, name, quantity });
        }
    );
});

// Route to delete an item
app.delete("/items/:id", (req, res) => {
    const { id } = req.params;
    db.run("DELETE FROM items WHERE id = ?", [id], function (err) {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: err.message });
        }
        console.log("Item deleted:", id);
        res.json({ deleted: id });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
