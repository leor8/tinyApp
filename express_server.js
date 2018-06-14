/*
  APPLICATION DESCRIPTION:

  Leo Ruan
  2018/06/21
*/

//Requiring the express lib and setting up the port number
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cookieParser = require("cookie-parser");
const PORT = 8080;

// variables
let uid = "";

// Database for saving all unique id with the corresponding link
// Database will be updated if user add/update/delete any elements
let urlDatabase = {
  "b2xVn2": {
    url: "http://www.lighthouselabs.ca",
    userID: "admin"},
  "9sm5xK": {
    url: "http://www.google.com",
    userID: "admin"}
};

let users = {
  "admin": {
    id: "admin",
    email: "leo442183205@gmail.com",
    password: "123456"
  }
}

// Setting ejs and bodyParser
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Default GET
app.get("/", function (req, res){
  res.redirect("/urls");
});

// Rendering the database page (urls_index.ejs) with current database
app.get("/urls", function (req, res){
  var cookieID = req.cookies["cookies"];
  let currUserData = urlsForUser(cookieID);
  let templateVars = { urls: urlDatabase,
                      usersObject: users[cookieID],
                      currLogIn: cookieID };
  res.render("urls_index", templateVars);
});

// Rendering the page getting new url from user via input field
app.get("/urls/new", function (req, res){
  let cookieID = req.cookies["cookies"];
  if(!cookieID){
    res.redirect("/login");
   } else {
    let templateVars = { usersObject: users[cookieID],
                        currLogIn: cookieID };
    res.render("urls_new", templateVars);
  }
});

app.get("/login", function (req, res){
  let cookieID = req.cookies["cookies"];
  let templateVars = { usersObject: users[cookieID],
                      currLogIn: cookieID };
  res.render("urls_login", templateVars);
});

// Rendering updating input request page that allow user to update
// the correspondant hyperlink to the URL. Accessing this page from
// urls_index's edit link
app.get("/urls/:id", function (req, res){
  let cookieID = req.cookies["cookies"];
  let templateVars = { shortURL: req.params.id,
                      longURL: urlDatabase[req.params.id],
                      usersObject: users[cookieID],
                      currLogIn: cookieID };
  res.render("urls_show", templateVars);
});

// This get method is for processing, it turns shortURL
// generated and put them into database and redirect to
// the longURL website
app.get("/u/:shortURL", function (req, res){
  let longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

// This get method returns a page with a form with emal
// and password
app.get("/register", function (req, res){
  let cookieID = req.cookies["cookies"];
  let templateVars = { usersObject: users[cookieID],
                      currLogIn: cookieID };
  res.render("usr_register", templateVars);
});

// post url received from /urls/new and redirect to that webpage
// provided by user and also generate a new id for that hyperlink
// and save it in the database
app.post("/urls", function (req, res){
  uid = generateRandomString();
  urlDatabase[uid] = {};
  urlDatabase[uid].url = req.body.longURL;
  urlDatabase[uid].userID = req.cookies["cookies"];
  res.redirect("/urls");
});

// Updated from database page if user hit delete and redirect back
// to database page with updated database
app.post("/urls/:id/delete", function (req, res){
  if(urlDatabase[req.params.id].userID == req.cookies["cookies"]){
    delete urlDatabase[req.params.id];
  }
  res.redirect("/urls");
});

// If user requested changed the link paired with id and update in
// database and redirect back to database page with updated database
app.post("/urls/update/:id", function (req, res){
  if(urlDatabase[req.params.id].userID == req.cookies["cookies"]){
    urlDatabase[req.params.id].url = req.body.longURL;
  }
  res.redirect("/urls");
});

// This post handles user id input that store the id into
// cookies
app.post("/login", function (req, res){
  var ifExist = false;
  for(var user in users){
    if(req.body.email == users[user].email){
      if(req.body.password == users[user].password){
        ifExist = true;
        res.cookie("cookies", users[user].id);

        res.redirect("/");
      }
    }
  }

  if(!ifExist){
    res.status(403);
    res.send("Your email address or password does not match the record!");
  }
});

// This post is for handling when user logout, and redirect
// back to login back after user has logged out
app.post("/logout", function (req, res){
  res.clearCookie("cookies");
  res.redirect("/login");
});

app.post("/register", function (req, res){
  // Error Handling
  var passed = true;
  let message = "";
  if(req.body.email == '' || req.body.password == ''){
    passed = false;
    message = "ERROR: NO PASSWORD OR EMAIL ENTERED."
  } else {
    for(var eachUser in users){
        if(users[eachUser].email == req.body.email){
          passed = false;
          message = "ERROR: EMAIL ALREADY IN USE.";
        }
      }
  }

  if(passed){
    let userId = generateRandomString();
    users[userId] = { id: userId, email:
                      req.body.email,
                      password: req.body.password };
    res.redirect("/login");

  } else {
    res.status(400);
    res.send(message);
  }

});

// Even handler
app.listen(PORT, function (){
  console.log(`Example app listening on port ${PORT}!`);
});


/*
  FUNCTIONS
*/


function generateRandomString(){
  // this function returns a random 6 digits string with random number + a to z
  return Math.random().toString(36).substring(6);
}

function urlsForUser(currID) {
  let matchingLinks = {}
  for(var url in urlDatabase){
    if(urlDatabase[url].userID === currID){
      matchingLinks[urlDatabase[url]] = urlDatabase[url];
    }
  }

  return matchingLinks;
}










