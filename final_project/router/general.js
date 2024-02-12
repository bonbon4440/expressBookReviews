const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require("axios");


public_users.post("/register", (req,res) => {
    //Write your code here
    if (!req.body.username) {
        return res.send("Username not provided");
    }
    if (!req.body.password) {
        return res.send("Password not provided");
    }
    // Checks if username already exists
    let doesExist = users.filter((user) => {
        return user.username === req.body.username;
    });

    if (doesExist.length > 0) {
        return res.send("Username already exists");
    }
    
    // If username does not exist
    else {
        // Adds a new object of username password to the array
        users.push({username: req.body.username, password: req.body.password});
        res.send("Registered successfully");
    }
    
    //return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    axios.get("http://localhost:5000/")
        .then((response) => {
            res.send(JSON.stringify(books, null, 4));
        })
        .catch((error) => {
            res.send("An error occurred");
        });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const url = "http://localhost:5000/isbn/" + req.params.isbn;
    axios.get(url)
        .then((response) => {
            const requestedIsbn = req.params.isbn;
            res.send(JSON.stringify(books[requestedIsbn], null, 4));
        })
        .catch((error) => {
            res.send("An error occurred");
        });
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const url = "http://localhost:5000/author/" + req.params.author;
    axios.get(url)
        .then((response) => {
            const requestedAuthor = req.params.author;
            const matchingBooks = [];
            const numberOfBooks = Object.keys(books).length;
            for (let i = 1; i < numberOfBooks + 1; i++) {
                if (books[i].author === requestedAuthor) {
                    matchingBooks.push(books[i]);
                }
            }
            res.send(JSON.stringify(matchingBooks, null, 4));
        })
        .catch((error) => {
            res.send("An error occurred");
        })
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const url = "http://localhost:5000/title/" + req.params.title;
    axios.get(url)
        .then((response) => {
            const requestedTitle = req.params.title;
            const matchingBooks = [];
            const numberOfBooks = Object.keys(books).length;
            for (let i = 1; i < numberOfBooks + 1; i++) {
                if (books[i].title === requestedTitle) {
                    matchingBooks.push(books[i]);
                }
            }
            res.send(JSON.stringify(matchingBooks, null, 4));
        })
        .catch((error) => {
            res.send("An error occurred");
        })
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    //Write your code here
    const requestedIsbm = req.params.isbn;
    res.send(JSON.stringify(books[requestedIsbm].reviews, null, 4));
    //return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
