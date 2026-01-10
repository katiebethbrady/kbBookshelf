const API_BASE = "http://localhost:5000/api";

export async function searchBooks(query) {
  const res = await fetch(`${API_BASE}/search?q=${encodeURIComponent(query)}`);
  return res.json();
}

export async function getBooks() {
  const res = await fetch(`${API_BASE}/books`);
  return res.json();
}

export async function addBook(book) {
  const res = await fetch(`${API_BASE}/books`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(book),
  });
  return res.json();
}

export async function updateBook(id, data) {
  const res = await fetch(`${API_BASE}/books/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteBook(id) {
  await fetch(`${API_BASE}/books/${id}`, { method: "DELETE" });
}
