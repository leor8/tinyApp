/*
  APPLICATION DESCRIPTION:
    Tiny App is used for shortening longer URLs and manipulate those URLs
    Starting with registering an account with your email and password, wihch
    upon complete will bring you to your interface. You can add/edit/delete
    from your interface and simply use the logout button on the top left side to exit.
  Leo Ruan
  2018/06/21
*/
//Requiring the express lib and setting up the port number
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cookieSession = require("cookie-session");
const bcrypt = require("bcryptjs");
const helpers = require("./helperFunctions.js");
const PORT = 8080;

// Setting ejs and bodyParser
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieSession({
  name: "cookies",
  keys: ["user_id"]
}));
//app.use("X-HTTP-Method-Override");

// Database for saving all unique id with the corresponding link
// Database will be updated if user add/update/delete any elements
let urlDatabase = {
  "b2xVn2": {
    url: "http://www.lighthouselabs.ca"
  },
  "9sm5xK": {
    url: "http://www.google.com"
  }
};

let users = {};
/*
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  This is the start for all GET requests.
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
// Public page where wether user logged in or not can all access
// but no control over links will be granted. This .get request
// will render urls_public
app.get("/public", function(req, res) {
  let cookieID = req.session.user_id;
  let templateVars = {
    urls: urlDatabase,
    usersObject: users[cookieID]
  };
  res.render("urls_public", templateVars);
});

// Rendering the database page (urls_index.ejs) with current database
// Only logged in users can access this page and only their own
// links will be displayed.
app.get("/urls", function(req, res) {
  let cookieID = req.session.user_id;
  if (!cookieID) { // if user is not logged in, will be redirect to login page
    res.redirect("/login");
  } else {
    let currUserData = helpers.urlsForUser(cookieID, urlDatabase);
    let templateVars = {
      urls: currUserData,
      usersObject: users[cookieID]
    };

    res.render("urls_index", templateVars);
  }
});

// Rendering the page getting new url from user via input field
// Only logged in user will have access to this page, other users will
// be redirected to login page.
app.get("/urls/new", function(req, res) {
  let cookieID = req.session.user_id;
  if (!cookieID) { // if user is not logged in, will be redirect to login page
    res.redirect("/login");
  } else {
    let templateVars = {
      usersObject: users[cookieID]
    };
    res.render("urls_new", templateVars);
  }
});

// This is the get call dedicated to rendering login page. This
// page has public access
app.get("/login", function(req, res) {
  let cookieID = req.session.user_id;
  let templateVars = {
    usersObject: users[cookieID]
  };
  res.render("urls_login", templateVars);
});

// Rendering updating input request page that allow user to update
// the correspondant hyperlink to the URL. Accessing this page from
// urls_index's edit link
app.get("/urls/:id", function(req, res) {
  let cookieID = req.session.user_id;
  let templateVars = {
    shortURL: req.params.id,
    longURL: urlDatabase[req.params.id],
    usersObject: users[cookieID]
  };
  res.render("urls_show", templateVars);
});

// This get method is for processing, it turns shortURL
// generated and put them into database and redirect to
// the longURL website
app.get("/u/:shortURL", function(req, res) {
  if (!req.session.user_id) {
    res.redirect("/login");
  } else {
    let longURL = urlDatabase[req.params.shortURL];
    res.redirect(longURL);
  }
});

// This get method returns a page with a form with emal
// and password for registering.
app.get("/register", function(req, res) {
  let cookieID = req.session.user_id;
  let templateVars = {
    usersObject: users[cookieID]
  };
  res.render("usr_register", templateVars);
});

/*
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  This is the end of all GET requests.
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/

/*
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  This is the start of all POST requests.
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/

// post url received from /urls/new and redirect to that webpage
// provided by user and also generate a new id for that hyperlink
// and save it in the database
app.post("/urls", function(req, res) {
  let uid = "";
  uid = helpers.generateRandomString();
  urlDatabase[uid] = {
    url: req.body.longURL,
    userID: req.session.user_id
  };
  res.redirect("/urls");
});

// Updated from database page if user hit delete and redirect back
// to database page with updated database
app.post("/urls/:id/delete", function(req, res) {
  if (urlDatabase[req.params.id].userID === req.session.user_id) {
    delete urlDatabase[req.params.id];
  }
  res.redirect("/urls");
});

// If user requested changed the link paired with id and update in
// database and redirect back to database page with updated database
app.post("/urls/update/:id", function(req, res) {
  if (urlDatabase[req.params.id].userID === req.session.user_id) {
    urlDatabase[req.params.id].url = req.body.longURL;
  }
  res.redirect("/urls");
});

// This post handles user id input that store the id into
// cookies
app.post("/login", function(req, res) {
  /*
  helper function (register)
  */
  let userId = helpers.loginCheck(req.body.password, req.body.email, users, bcrypt);
  if (userId) {
    req.session.user_id = userId;
    res.redirect("/urls");
  } else {
    helpers.generateError(403, "Your email address or password does not match the record!", res);
  }
});

// This post is for handling when user logout, and redirect
// back to login back after user has logged out
app.post("/logout", function(req, res) {
  req.session = null;
  res.redirect("/login");
});

// This post handles what is being passed from register from
// if user inputs are valid, a cookie will be set up and redirect
// to user interface page
app.post("/register", function(req, res) {
  // Error Handling
  let message = "";
  if (helpers.isEmpty(req.body.email) || helpers.isEmpty(req.body.password)) {
    message = "ERROR: NO PASSWORD OR EMAIL ENTERED.";
    helpers.generateError(400, message, res);
  } else if (helpers.ifEmailExits(req.body.email, users)) {
    message = "ERROR: EMAIL ALREADY IN USE.";
    helpers.generateError(400, message, res);
  } else {
    let userId = helpers.generateRandomString();
    let updatedPassword = bcrypt.hashSync(req.body.password, 10);
    users[userId] = {
      id: userId,
      email: req.body.email,
      password: updatedPassword
    };
    req.session.user_id = users[userId].id;
    res.redirect("/urls");
  }

});

/*
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  This is the end of all POST requests.
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/

// Even handler
app.listen(PORT, function() {
  console.log(`Example app listening on port ${PORT}!`);
});


