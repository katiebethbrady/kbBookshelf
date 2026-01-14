//imports
import { useState } from "react";
import { searchBooks } from "./services/api";
import placeHolder from "./assets/bookplaceholder.jpg";

//reusable bookcard component, displays book info and shelf
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
      {/* thumbnail logic*/}
      <img
        src={book.thumbnail || placeHolder}
        alt={book.title}
        style={{
          width: "80px",
          height: "120px",
          objectFit: "cover",
          borderRadius: "4px",
        }}
      />
      <div>
        <h3 style={{ margin: 0, fontSize: "1rem" }}>{book.title}</h3>                 {/* displays title */}
        <p style={{ margin: "0.25rem 0", fontSize: "0.875rem", color: "#555" }}>    {/* displays author, "unknown author" if no author listed */}
          {book.authors?.length ? book.authors.join(", ") : "Unknown Author"}
        </p>

        {/* shelf selection dropdown */}
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
        {/* TODO shelf formatting */}
        {/* {currentShelf && (
          <p style={{ fontSize: "0.75rem", color: "#333", marginTop: "0.25rem" }}>
            Shelf: {currentShelf.replace(/([A-Z])/g, " $1")}
          </p>
        )} */}
      </div>
    </div>
  );
}

function App() {
  const [query, setQuery] = useState("");                         // search query
  const [results, setResults] = useState([]);                     // search results                
  const [booksOnShelves, setBooksOnShelves] = useState({});       // books on shelves
  const [selectedShelf, setSelectedShelf] = useState("search");   // app starts in shelf mode

  // search function
  const handleSearch = async () => {
    if (!query.trim()) return;
    const data = await searchBooks(query);
    setResults(data);
  };

  // add or update book on shelf function
  const handleAddToShelf = (book, shelf) => {
    setBooksOnShelves((prev) => ({
      ...prev,
      [book.id]: { ...book, shelf },
    }));
  };

return (
  <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
    <div
      style={{
        display: "flex",
        gap: "2rem",
        alignItems: "flex-start",
      }}
    >
      {/* LEFT CONTENT*/}
      {/* TODO add filters for search like rating, date, etc... */}
      <div
        style={{
          width: "180px",
          padding: "1rem",
          border: "1px dashed #ccc",
          borderRadius: "6px",
          color: "#777",
          fontSize: "0.9rem",
        }}
      >
        <strong>Filters</strong>
        <p style={{ marginTop: "0.5rem", fontStyle: "italic" }}>
          Coming soon
        </p>
      </div>

      {/* CENTER CONTENT */}
      <div style={{ flex: 1 }}>
        {/* back to search button */}
        {selectedShelf !== "search" && (
          <button
            onClick={() => {
              setSelectedShelf("search");
              setQuery("");
              setResults([]);
            }}
            style={{
              marginBottom: "1rem",
              padding: "0.4rem 0.75rem",
              borderRadius: "4px",
              border: "1px solid #333",
              backgroundColor: "#f5f5f5",
              cursor: "pointer",
              fontSize: "0.85rem",
            }}
          >
            Back to Search
          </button>
        )}

        {/* search bar */}
        {selectedShelf === "search" && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              marginBottom: "2rem",
            }}
          >
            <input
              type="text"
              value={query}
              placeholder="Search books..."
              onChange={(e) => setQuery(e.target.value)}
              style={{
                padding: "0.5rem",
                width: "300px",
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

        {/* search results */}
        {selectedShelf === "search" && results.length > 0 && (
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

        {/* shelf books */}
        {selectedShelf !== "search" && (
          <div>
            <h2>
              {selectedShelf === "all"
                ? "All Books"
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
                .filter((book) => {
                  if (selectedShelf === "all") return true;
                  return book.shelf === selectedShelf;
                })
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
        )}
      </div>

      {/* RIGHT CONTENT */}
      {/* TODO add button to create shelves */}
      <div style={{ width: "200px" }}>
        <h2 style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>
          My Shelves
        </h2>

        {["all", "wantToRead", "currentlyReading", "read"].map((shelf) => (
          <button
            key={shelf}
            onClick={() => {
              setSelectedShelf(shelf);
              setResults([]);
            }}
            style={{
              display: "block",
              width: "100%",
              padding: "0.5rem",
              marginBottom: "0.5rem",
              borderRadius: "4px",
              border: "1px solid #333",
              backgroundColor:
                selectedShelf === shelf ? "#ddd" : "#fff",
              cursor: "pointer",
              textTransform: "capitalize",
            }}
          >
            {shelf === "all"
              ? "All Books"
              : shelf.replace(/([A-Z])/g, " $1")}
          </button>
        ))}
      </div>
    </div>
  </div>
);


}

export default App;
