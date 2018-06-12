var express = require("express");
var app = express();
var PORT = 8080;

var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/", function (req, res){
  res.end("Hello!");
});

app.listen(PORT, function (){
  console.log(`Example app listening on port ${PORT}!`);
});