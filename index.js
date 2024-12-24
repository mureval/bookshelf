import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import { db } from "./connectDB.js";
import { getBook, getRating, getNotes } from "./utils.js";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", async (req, res) => {
  const book = await getBook();
  let result;
  try {
    book.forEach(async (bk) => {
      const response = await axios.get(
        `https://covers.openlibrary.org/b/olid/${bk.olid}.json`
      );
      result = response.data;
      try {
        await db.query("UPDATE books SET img_url = ($1) WHERE id = $2", [
          result.source_url,
          bk.id,
        ]);
      } catch (err) {
        res.status(204).send("image doesn't not found");
      }
    });
    res.render("index.ejs", {
      coverBook: result,
      books: book,
      sort: "sorting",
    });
  } catch (err) {
    console.log("Book not found!");
  }
});

app.get("/book", async (req, res) => {
  res.render("newBook.ejs");
});

app.get("/book/:id", async (req, res) => {
  const books = await getBook();
  const rates = await getRating();
  const notes = await getNotes();
  const book = books.find((b) => b.id === parseInt(req.params.id));
  const rate = rates.find((r) => r.book_id === book.id);
  const note = notes.filter((nt) => nt.book_id === book.id);
  if (!book) return res.status(400).send("404 Not Found!");

  res.render("detailsBook.ejs", { data: book, rating: rate, note: note });
});

app.get("/:filter", async (req, res) => {
  const { category } = req.query;
  try {
    const result = await db.query(
      `SELECT books.id as id, title, book_summary, img_url, author, created_date, rate FROM books JOIN rating ON rating.id = books.id ORDER BY ${category} ASC`
    );
    let sortBy = result.rows;

    res.render("index.ejs", { books: sortBy, sort: category });
  } catch (err) {
    res.status(400).send("Sorting category not found!");
  }
});

app.post("/book", async (req, res) => {
  const book = await getBook();
  const { title, author, isbn, olid, rating, summary } = req.body;
  const date = new Date();

  try {
    await db.query(
      "INSERT INTO books (id, title, author, isbn, olid, book_summary, created_date) VALUES ($1, $2, $3, $4, $5, $6, $7)",
      [book.length + 1, title, author, isbn, olid, summary, date]
    );

    await db.query("INSERT INTO rating (id, rate) VALUES ($1, $2)", [
      book.length + 1,
      rating,
    ]);

    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

app.post("/book/:id", async (req, res) => {
  const books = await getBook();
  const { notes } = req.body;
  const date = new Date();
  const book = books.find((b) => b.id === parseInt(req.params.id));

  try {
    await db.query(
      "INSERT INTO notes (id, note, note_date) VALUES ($1, $2, $3)",
      [book.id, notes, date]
    );
    res.redirect(`/book/${book.id}`);
  } catch (err) {
    console.log(err);
  }
});

app.listen(port, () => {
  console.log(`Server running on port: http://localhost:${port}`);
});
