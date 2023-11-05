const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [{
  username: 'admin',
  password: 'password'
}];

const isValid = (username) => { //returns boolean
  //write code to check is the username is valid
  const filteredUsers = users.filter(user => user.username === username);
  if (filteredUsers.length > 0) {
    return false;
  } else {
    return true;
  }
}

const authenticatedUser = (username, password) => { //returns boolean
  //write code to check if username and password match the one we have in records.

  if (!username || !password) {
    return false
  }
  const filteredUsers = users.filter(user => user.username === username && user.password === password);

  if (filteredUsers.length > 0) {
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  //Write your code here
  try {
    const { username, password } = req.body;
    if (authenticatedUser(username, password)) {
      const accessToken = jwt.sign({ data: password }, 'access', { expiresIn: 60 * 60 });

      req.session.authorization = {
        accessToken, username
      }

      return res.status(300).json({ message: "User successfully signed in.", token: accessToken })
    } else {
      return res.status(403).json({ message: "Invalid Credentials." });

    }
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error })
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", async (req, res) => {
  //Write your code here
  try{
    const review = req.body;
  const { isbn } = req.params;
  if (req.session.authorization.username !== review.user) {
    return res.status(403).json({ message: "Invalid username" });
  }
  const allReviews = await fetch(`http://localhost:5000/review/${isbn}`).then(res => res.json());

  
  const keyOfBookToUpdate = Object.keys(books).filter(key => books[key].isbn === isbn);

  const keyOfExistingReview = Object.keys(allReviews).filter(key => allReviews[key].user === review.user);

  if (keyOfBookToUpdate.length > 0) {
    // isbn is correct
    if (keyOfExistingReview.length > 0) {
      // there is an existing review for this book.
      allReviews[keyOfExistingReview[0]] = review;

      books[keyOfBookToUpdate[0]].reviews = allReviews;
     
      return res.status(300).json({ message: 'Reviews updated successfully', reviews: books[keyOfBookToUpdate] });
    } else {
      // no existing review add a new review
      books[keyOfBookToUpdate[0]].reviews = {...books[keyOfBookToUpdate[0]].reviews, [Object.keys(allReviews).length + 2]: review};

      return res.status(300).json({ message: 'Reviews updated successfully', reviews: books[keyOfBookToUpdate] });

    }
  }else{
    // book is not found isbn is incorrect
    return res.status(500).json({message: "Invalid ISBN"});
  }

  }catch(error){
    console.log(error);
    return res.status(500).json({error});
  }
});

regd_users.delete('/auth/review/:isbn', function(req, res) {
  const {isbn} = req.params;
  const filteredBooks = Object.keys(books).filter(key => books[key].isbn === isbn);
  if(filteredBooks.length  === 0){
    return res.status(403).json({messge: "Invalid ISBN"});
  }else{
    let allReviews = books[filteredBooks[0]].reviews;
    const {username} = req.session.authorization;
    const keyToDelete = Object.keys(allReviews).filter(key => allReviews[key].user === username);
    if(keyToDelete.length > 0){
      delete allReviews[keyToDelete[0]];
      books[filteredBooks[0]].reviews = allReviews;

      return res.status(300).json({message: "Review deleted successfully", book: books[filteredBooks[0]]});
    }else{

      return res.status(403).json({message: 'No Review Found'});
    }


  }

})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
