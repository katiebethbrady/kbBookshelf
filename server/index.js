import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import fs from "fs";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const DB_PATH = "./data/db.json";

// Ensure DB exists
if (!fs.existsSync("./data")) fs.mkdirSync("./data");
if (!fs.existsSync(DB_PATH)) fs.writeFileSync(DB_PATH, JSON.stringify([]));

app.get("/api/search", async (req, res) => {
  const q = req.query.q;
  if (!q) return res.status(400).json({ error: "Missing query" });

  try {
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(q)}`
    );
    const data = await response.json();
    // Normalize books
    const normalized = (data.items || []).map(item => {
        const info = item.volumeInfo || {};
        return {
            id: item.id,
            title: info.title || "No title",
            authors: info.authors || [],
            thumbnail: info.imageLinks?.thumbnail || "",
            pages: info.pageCount || 0,
            publishedDate: info.publishedDate || "",
        };
    });
    res.json(normalized);

  } catch (err) {
    res.status(500).json({ error: "Failed to fetch books" });
  }
});

app.get("/api/books", (req, res) => {
  const data = JSON.parse(fs.readFileSync(DB_PATH));
  res.json(data);
});

app.post("/api/books", (req, res) => {
  const books = JSON.parse(fs.readFileSync(DB_PATH));
  books.push(req.body);
  fs.writeFileSync(DB_PATH, JSON.stringify(books, null, 2));
  res.status(201).json(req.body);
});

app.put("/api/books/:id", (req, res) => {
  const books = JSON.parse(fs.readFileSync(DB_PATH));
  const index = books.findIndex(b => b.id === req.params.id);
  if (index === -1) return res.status(404).end();

  books[index] = { ...books[index], ...req.body };
  fs.writeFileSync(DB_PATH, JSON.stringify(books, null, 2));
  res.json(books[index]);
});

app.delete("/api/books/:id", (req, res) => {
  let books = JSON.parse(fs.readFileSync(DB_PATH));
  books = books.filter(b => b.id !== req.params.id);
  fs.writeFileSync(DB_PATH, JSON.stringify(books, null, 2));
  res.status(204).end();
});

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
