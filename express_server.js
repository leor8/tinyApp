/*
  APPLICATION DESCRIPTION:

  Leo Ruan
  2018/06/21
*/

// Requiring the express lib and setting up the port number
var express = require("express");
var app = express();
var PORT = 8080;

var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.set("view engine", "ejs");

app.get("/", function (req, res){
  res.end("Hello!");
});

app.get("/urls", function (req, res){
  let templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});
app.get("/urls.json", function (req, res){
  res.json(urlDatabase);
});

app.get("/hello", function (req, res){
  res.end("<html><body>Hello <b>World</b></body></html>\n");
});


app.listen(PORT, function (){
  console.log(`Example app listening on port ${PORT}!`);
});
















