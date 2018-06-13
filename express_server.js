/*
  APPLICATION DESCRIPTION:

  Leo Ruan
  2018/06/21
*/

//Requiring the express lib and setting up the port number
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
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

// Default GET
app.get("/", function (req, res){
  res.end("Hello!");
});

// Rendering the database page (urls_index.ejs) with current database
app.get("/urls", function (req, res){
  let templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

// Rendering the page getting
app.get("/urls/new", function (req, res){
  res.render("urls_new");
});

// get url typed in the link
app.get("/urls/:id", function (req, res){
  let templateVars = { shortURL: req.params.id, longURL: urlDatabase[req.params.id]};
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", function (req, res){
  let longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

// PUT url received from /urls/new
app.post("/urls", function (req, res){
  uid = generateRandomString();
  urlDatabase[uid] = req.body.longURL;
  res.redirect(`u/${uid}`);
});

app.post("/urls/:id/delete", function (req, res){
  delete urlDatabase[req.params.id];
  res.redirect("/urls");
});

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










