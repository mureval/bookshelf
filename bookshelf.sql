CREATE DATABASE bookshelf;

CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    author VARCHAR(255),
    isbn VARCHAR(45),
    olid VARCHAR(45),
    img_url TEXT,
    book_summary TEXT,
    created_date DATE
);

CREATE TABLE rating (
    id INT REFERENCES books(id) UNIQUE,
    rate DOUBLE PRECISION
);

CREATE TABLE notes (
    id INT REFERENCES books(id),
    note TEXT,
    note_date DATE
)