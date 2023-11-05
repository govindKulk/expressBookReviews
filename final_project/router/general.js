const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


// Without Promises
// public_users.post("/register", (req,res) => {
//   //Write your code here
//   const {username, password} = req.body;
//   if(!username || !password){
//     return res.status(403).json({message: "Please Enter Username or Password"});
//   }
  
//   if(!isValid(username)){
//     return res.status(403).json({message: "Username already in use."});
//   }

//   users.push({username, password});

//   return res.status(300).json({message: "Success! You have successfully registered."});
// });


// With Promise
public_users.post("/register", (req,res) => {
  //Write your code here
  const {username, password} = req.body;
  if(!username || !password){
    return res.status(403).json({message: "Please Enter Username or Password"});
  }
  
  if(!isValid(username)){
    return res.status(403).json({message: "Username already in use."});
  }

  
  let addToDb = new Promise((resolve, reject) => {
    setTimeout(() => {
      users.push({username, password});
      resolve("Success! You have successfully registered.")
    }, 2000);
  })

  return addToDb.then((successMsg) => res.status(300).json({message: successMsg }))

  
});

// Get the book list available in the shop

// without async await
// public_users.get('/',function (req, res) {
//   //Write your code here
//   try{
//     const allBooks = Object.keys(books).map(key => {
//       return books[key];
//     })
//     console.log(allBooks)
//     return res.status(300).json({allBooks});
//   }catch(error){
//     console.log(error)
//     return res.status(500).json({error});
//   }
// });

// with async await
public_users.get('/',async function (req, res) {
  //Write your code here
  try{
    
    
    const getAllBooks = new Promise((resolve, reject) => {
      setTimeout(() => {
        const allBooks = Object.keys(books).map(key => {
          return books[key];
        })
        resolve(allBooks)
      }, 2000)
    })
    const allBooks = await getAllBooks;
    return res.status(300).json({allBooks});
  }catch(error){
    console.log(error)
    return res.status(500).json({error});
  }
});

// Get book details based on ISBN

// without Promise
// public_users.get('/isbn/:isbn',function (req, res) {
//   //Write your code here
//   const {isbn} = req.params;
//   const bookKey = Object.keys(books).find((key) => {
//     return books[key].isbn === isbn;
//   })
//   if(!bookKey){
//     return res.status(403).json({message: "Invalid ISBN. No records found."})
//   }else{
//     return res.status(300).json({book: books[bookKey]});
//   }
//  });

// with Promise
public_users.get('/isbn/:isbn',async function (req, res) {
  //Write your code here
  const {isbn} = req.params;
  
  const getBookWithIsbn = new Promise((resolve, reject) => {
      setTimeout(() => {
        const bookKey = Object.keys(books).find((key) => {
          return books[key].isbn === isbn;
        })
        if(!bookKey){
          reject("Invalid ISBN. No records found.")
        }else{
          resolve(books[bookKey])
        }
      }, 2000)
  })

  return getBookWithIsbn.then((book) => res.status(300).json({book})).catch((msg) => res.status(403).json({message: msg}))

 
 });
  
 // Get book details based on author

 // Without Promise
// public_users.get('/author/:author',function (req, res) {
//   //Write your code here

//   const {author} = req.params;
//   const bookKey = Object.keys(books).filter((key) => {
//     return books[key].author === author;
//   })
//   if(bookKey.length === 0){
//     return res.status(403).json({message: "Invalid Author. No records found."})
//   }else{
//     const booksByAuthor = bookKey.map((key) => books[key])
//     return res.status(300).json({book: booksByAuthor});
//   }
// });


// With Promise
public_users.get('/author/:author',async function (req, res) {
  //Write your code here
  const {author} = req.params;
  
  const getBookWithAuthor = new Promise((resolve, reject) => {
      setTimeout(() => {
        const bookKey = Object.keys(books).filter((key) => {
          return books[key].author === author;
        })
        if(bookKey.length === 0) {
          reject("Invalid Author Name. No records found.")
        }else{
          const booksByAuthor = bookKey.map((key) => books[key])
          resolve(booksByAuthor)
        }
      }, 2000)
  })

  return getBookWithAuthor.then((book) => res.status(300).json({book})).catch((msg) => res.status(403).json({message: msg}))

 
 });

// Get all books based on title

// Without Promsie
// public_users.get('/title/:title',function (req, res) {
//   //Write your code here

//   const {title} = req.params;
//   const bookKey = Object.keys(books).find((key) => {
//     return books[key].title === title;
//   })
//   if(!bookKey){
//     return res.status(403).json({message: "Invalid Title. No records found."})
//   }else{
//     return res.status(300).json({book: books[bookKey]});
//   }
// });

// With Promise
public_users.get('/title/:title',async function (req, res) {
  //Write your code here
  const {title} = req.params;
  
  const getBookWithtitle = new Promise((resolve, reject) => {
      setTimeout(() => {
        const bookKey = Object.keys(books).find((key) => {
          return books[key].title === title;
        })
        if(!bookKey){
          reject("Invalid title. No records found.")
        }else{
          resolve(books[bookKey])
        }
      }, 2000)
  })

  return getBookWithtitle.then((book) => res.status(300).json({book})).catch((msg) => res.status(403).json({message: msg}))

 
 });

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here

  const {isbn} = req.params;
  const bookKey = Object.keys(books).find((key) => {
    return books[key].isbn === isbn;
  })
  if(!bookKey){
    return res.status(403).json({message: "Invalid ISBN. No records found."})
  }else{
    return res.status(300).json({reviews: books[bookKey].reviews});
  }

});

module.exports.general = public_users;
