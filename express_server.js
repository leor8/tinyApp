/*
  APPLICATION DESCRIPTION:

  Leo Ruan
  2018/06/21
*/

//Requiring the express lib and setting up the port number
var express = require("express");
const bodyParser = require("body-parser");
var app = express();
var PORT = 8080;

// Database for saving all unique id with the corresponding link
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

// Printing out the database
app.get("/urls", function (req, res){
  let templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

// getting url input by user
app.get("/urls/new", function (req, res){
  res.render("urls_new");
});

// get url typed in the link
app.get("/urls/:id", function (req, res){
  let templateVars = { shortURL: req.params.id };
  res.render("urls_show", templateVars);
});

// PUT url received from /urls/new
app.post("/urls", function (req, res){
  var uid = generateRandomString();
  urlDatabase[uid] = req.body.longURL;
  res.send(urlDatabase[uid]);
});


app.listen(PORT, function (){
  console.log(`Example app listening on port ${PORT}!`);
});


/*
  FUNCTIONS
*/


function generateRandomString(){
  return Math.random().toString(36).substring(6);
}










