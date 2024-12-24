import { db } from "./connectDB.js";

async function getBook() {
  const result = await db.query("SELECT * FROM books ORDER BY id ASC");
  let books = [];
  books = result.rows;

  return books;
}

async function getRating() {
  const result = await db.query(
    "SELECT books.id as book_id, rate FROM books JOIN rating ON rating.id = books.id ORDER BY books.id ASC"
  );
  let rate = [];
  rate = result.rows;

  return rate;
}

async function getNotes() {
  const result = await db.query(
    "SELECT books.id as book_id, note, note_date FROM books JOIN notes ON notes.id = books.id ORDER BY books.id ASC"
  );

  let note = [];
  note = result.rows;

  return note;
}

export { getBook, getRating, getNotes };
