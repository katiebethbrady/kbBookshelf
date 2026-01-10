import { useState } from "react";
import { searchBooks } from "./services/api";

// Reusable BookCard component
function BookCard({ book, currentShelf, onAddToShelf }) {
  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "1rem",
        display: "flex",
        gap: "1rem",
        alignItems: "flex-start",
      }}
    >
      <img
        src={book.thumbnail || "https://via.placeholder.com/80x120?text=No+Image"}
        alt={book.title}
        style={{
          width: "80px",
          height: "120px",
          objectFit: "cover",
          borderRadius: "4px",
        }}
      />
      <div>
        <h3 style={{ margin: 0, fontSize: "1rem" }}>{book.title}</h3>
        <p style={{ margin: "0.25rem 0", fontSize: "0.875rem", color: "#555" }}>
          {book.authors?.length ? book.authors.join(", ") : "Unknown Author"}
        </p>

        <select
          value={currentShelf}
          onChange={(e) => onAddToShelf(book, e.target.value)}
          style={{
            marginTop: "0.5rem",
            padding: "0.25rem",
            fontSize: "0.75rem",
            borderRadius: "4px",
            border: "1px solid #333",
            cursor: "pointer",
          }}
        >
          <option value="" disabled>
            Add to Shelf
          </option>
          <option value="wantToRead">Want to Read</option>
          <option value="currentlyReading">Currently Reading</option>
          <option value="read">Read</option>
        </select>

        {currentShelf && (
          <p style={{ fontSize: "0.75rem", color: "#333", marginTop: "0.25rem" }}>
            Shelf: {currentShelf.replace(/([A-Z])/g, " $1")}
          </p>
        )}
      </div>
    </div>
  );
}

function App() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [booksOnShelves, setBooksOnShelves] = useState({});
  const [selectedShelf, setSelectedShelf] = useState("all");

  // Search function
  const handleSearch = async () => {
    if (!query.trim()) return;
    const data = await searchBooks(query);
    setResults(data);
  };

  // Add or update book on shelf
  const handleAddToShelf = (book, shelf) => {
    setBooksOnShelves((prev) => ({
      ...prev,
      [book.id]: { ...book, shelf },
    }));
  };

  return (
    <div style={{ display: "flex", padding: "2rem", fontFamily: "sans-serif" }}>
      {/* Sidebar */}
      <div style={{ width: "150px", marginRight: "2rem" }}>
        <h2 style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>My Shelves</h2>
        {["all", "wantToRead", "currentlyReading", "read"].map((shelf) => (
          <button
            key={shelf}
            onClick={() => {
              setSelectedShelf(shelf);
              setResults([]); // Hide previous search when switching tabs
            }}
            style={{
              display: "block",
              width: "100%",
              padding: "0.5rem",
              marginBottom: "0.5rem",
              borderRadius: "4px",
              border: "1px solid #333",
              backgroundColor: selectedShelf === shelf ? "#ddd" : "#fff",
              cursor: "pointer",
              textTransform: "capitalize",
            }}
          >
            {shelf === "all"
              ? "All Books"
              : shelf
                .replace(/([A-Z])/g, " $1") // split camelCase
                .replace(/\b\w/g, (c) => c.toUpperCase())}
          </button>
        ))}
      </div>

      {/* Main content */}
      <div style={{ flex: 1 }}>
        {/* Search bar */}
        {selectedShelf === "all" && (
          <div style={{ marginBottom: "1.5rem" }}>
            <input
              type="text"
              value={query}
              placeholder="Search books..."
              onChange={(e) => setQuery(e.target.value)}
              style={{
                padding: "0.5rem",
                width: "300px",
                marginRight: "0.5rem",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
            />
            <button
              onClick={handleSearch}
              style={{
                padding: "0.5rem 1rem",
                borderRadius: "4px",
                border: "1px solid #333",
                backgroundColor: "#fff",
                cursor: "pointer",
              }}
            >
              Search
            </button>
          </div>
        )}

        {/* Search results */}
        {results.length > 0 && selectedShelf === "all" && (
          <div style={{ marginBottom: "2rem" }}>
            <h2>Search Results</h2>
            <div
              style={{
                display: "grid",
                gap: "1rem",
                gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
              }}
            >
              {results.map((book) => (
                <BookCard
                  key={book.id}
                  book={book}
                  currentShelf={booksOnShelves[book.id]?.shelf || ""}
                  onAddToShelf={handleAddToShelf}
                />
              ))}
            </div>
          </div>
        )}

        {/* Books on shelves */}
        <div>
          <h2>
            {selectedShelf === "all"
              ? "All Books on Shelves"
              : selectedShelf.replace(/([A-Z])/g, " $1")}
          </h2>
          <div
            style={{
              display: "grid",
              gap: "1rem",
              gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
            }}
          >
            {Object.values(booksOnShelves)
              .filter(
                (book) => selectedShelf === "all" || book.shelf === selectedShelf
              )
              .map((book) => (
                <BookCard
                  key={book.id}
                  book={book}
                  currentShelf={book.shelf}
                  onAddToShelf={handleAddToShelf}
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
