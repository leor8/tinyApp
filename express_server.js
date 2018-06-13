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
var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

// Setting ejs and bodyParser
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Default GET
app.get("/", function (req, res){
  res.end("Hello!");
});

// Rendering the database page (urls_index.ejs) with current database
app.get("/urls", function (req, res){
  let templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

// Rendering the page getting new url from user via input field
app.get("/urls/new", function (req, res){
  res.render("urls_new");
});

// Rendering updating input request page that allow user to update
// the correspondant hyperlink to the URL. Accessing this page from
// urls_index's edit link
app.get("/urls/:id", function (req, res){
  let templateVars = { shortURL: req.params.id, longURL: urlDatabase[req.params.id]};
  res.render("urls_show", templateVars);
});


app.get("/u/:shortURL", function (req, res){
  let longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

// post url received from /urls/new and redirect to that webpage
// provided by user and also generate a new id for that hyperlink
// and save it in the database
app.post("/urls", function (req, res){
  uid = generateRandomString();
  urlDatabase[uid] = req.body.longURL;
  res.redirect(`u/${uid}`);
});

// Updated from database page if user hit delete and redirect back
// to database page with updated database
app.post("/urls/:id/delete", function (req, res){
  delete urlDatabase[req.params.id];
  res.redirect("/urls");
});

// If user requested changed the link paired with id and update in
// database and redirect back to database page with updated database
app.post("/urls/update/:id", function (req, res){
  urlDatabase[req.params.id] = req.body.longURL;
  res.redirect("/urls");
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










