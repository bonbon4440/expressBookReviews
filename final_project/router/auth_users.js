const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

// const authenticatedUser = (username,password)=>{ //returns boolean
// //write code to check if username and password match the one we have in records.
// }

//only registered users can login
regd_users.post("/login", (req,res) => {
    // If already logged in
    if (req.session.authorization) {
        return res.send("Already logged in");
    }
    //Write your code here
    if (!req.body.username) {
        return res.send("Username not provided");
    }
    if (!req.body.password) {
        return res.send("Password not provided");
    }
    let matchingUsers = users.filter((user) => {
        // console.log(user.username);
        // console.log(req.body.username);
        return (user.username === req.body.username && user.password === req.body.password);
    });

    // If matching user found
    if (matchingUsers.length > 0) {
        // Creates a new token
        let accessToken = jwt.sign({ username: req.body.username, password: req.body.password }, "secret-key", { expiresIn: 3600 });
        // Stores token in session
        req.session.authorization = accessToken;
        res.send("Successfully logged in");
    }

    // If matching not found
    else {
        res.send("Incorrect username or password");
    }

    //return res.status(300).json({message: "Yet to be implemented"});
});

// Authorization Middleware
regd_users.use((req, res, next) => {
        // Checks if session exists
        if (req.session.authorization) {
          // Retrieves the token stored inside session
          let token = req.session.authorization;
          // Verify token
          jwt.verify(token, "secret-key", (err, user) => {
              // If verify successful
              if (!err) {
                  req.user = user;
                  next();
              }
              else {
                  return res.send("Token verification failed");
              }
          }); // End verify
      }
  
      // If session does not exist
      else {
          return res.send("Please login first");
      }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    // // Checks if session exists
    // if (req.session.authorization) {
    //     // Retrieves the token stored inside session
    //     let token = req.session.authorization;
    //     // Verify token
    //     jwt.verify(token, "secret-key", (err, user) => {
    //         // If verify successful
    //         if (!err) {
    //             req.user = user;
    //         }
    //         else {
    //             return res.send("Token verification failed");
    //         }
    //     }); // End verify
    // }

    // // If session does not exist
    // else {
    //     return res.send("Please login first");
    // }
    //Write your code here
    const requestedBook = books[req.params.isbn];
    const existingReviews = requestedBook.reviews;
    const newReview = req.query.review;
    existingReviews[req.user.username] = newReview;
    res.send("Review added/updated");
    //return res.status(300).json({message: "Yet to be implemented"});
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const requestedBook = books[req.params.isbn];
    const existingReviews = requestedBook.reviews;
    // If review exists
    if (existingReviews.hasOwnProperty(req.user.username)) {
        delete existingReviews[req.user.username];
        res.send("Delete successful");
    }
    // If no
    else {
        res.send("Review not exist");
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
