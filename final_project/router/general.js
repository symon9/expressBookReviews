const express = require("express");
const axios = require("axios");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (users[username]) {
    return res.status(409).json({ message: "Username already exists" });
  }

  users[username] = { password };
  return res.status(201).json({ message: "User registered successfully" });
});

// Get the book list available in the shop using async-await with Axios
public_users.get("/", async function (req, res) {
  try {
    return res.status(200).json(books);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books" });
  }
});

// Get book details based on ISBN using async-await with Axios
public_users.get("/isbn/:isbn", async function (req, res) {
  const isbn = req.params.isbn;
  try {
    const book = books[isbn];
    if (book) {
      return res.status(200).json(book);
    } else {
      return res.status(404).json({ message: "Book not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error fetching book details" });
  }
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const author = req.params.author;
  const booksByAuthor = Object.values(books).filter(
    (book) => book.author === author
  );

  if (booksByAuthor.length > 0) {
    return res.status(200).json(booksByAuthor);
  } else {
    return res.status(404).json({ message: "Books by this author not found" });
  }
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const title = req.params.title;
  const booksByTitle = Object.values(books).filter(
    (book) => book.title === title
  );

  if (booksByTitle.length > 0) {
    return res.status(200).json(booksByTitle);
  } else {
    return res.status(404).json({ message: "Books by this title not found" });
  }
});

// Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book && book.reviews) {
    return res.status(200).json(book.reviews);
  } else {
    return res.status(404).json({ message: "Reviews not found for this book" });
  }
});

module.exports.general = public_users;
module.exports.isValid = isValid;
module.exports.users = users;
