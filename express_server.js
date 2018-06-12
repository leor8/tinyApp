/*
  APPLICATION DESCRIPTION:

  Leo Ruan
  2018/06/21
*/

// Requiring the express lib and setting up the port number
var express = require("express");
const bodyParser = require("body-parser");
var app = express();
var PORT = 8080;

var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res){
  res.end("Hello!");
});

app.get("/urls", function (req, res){
  let templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", function (req, res){
  res.render("urls_new");
});

app.get("/urls/:id", function (req, res){
  let templateVars = { shortURL: req.params.id };
  res.render("urls_show", templateVars);
});


app.listen(PORT, function (){
  console.log(`Example app listening on port ${PORT}!`);
});
















