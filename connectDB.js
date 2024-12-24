import pg from "pg";

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "bookshelf",
  password: "rev081",
  port: 5432,
});
db.connect();

export { db };
