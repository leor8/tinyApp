/*
  HELPER FUNCTIONS
*/
module.exports = {
  generateRandomString: function() {
    // this function returns a random 6 digits string with random number + a to z
    return Math.random().toString(36).substring(6);
  },

  urlsForUser: function(currID, urlDatabase) {
    // This function will go through all the datas in the urlDatabase
    // and return an object with all the links that was created
    // by currID, returns an empty object if none found
    let matchingLinks = {};
    for (let url in urlDatabase) {
      if (urlDatabase[url].userID === currID) {
        matchingLinks[url] = urlDatabase[url];
      }
    }

    return matchingLinks;
  },

  loginCheck: function(userPassword, userEmail, users, bcrypt) {
    // This function checks the inputs from loging page if that
    // matches with userdatabase, return true if found, false otherwise
    for (var user in users) {
      if (userEmail == users[user].email) {
        if (bcrypt.compareSync(userPassword, users[user].password)) {
          return users[user].id;
        }
      }
    }
    return false;
  },

  isEmpty: function(aString) {
    // This function checks if a string getting passed in is empty or
    // not. Returns true if is empty
    return aString === "";
  },

  ifEmailExits: function(email, users) {
    // This function checks if given email does already exist in
    // the userdatabase. Returns true if it exits, false otherwise
    for (var eachUser in users) {
      if (users[eachUser].email === email) {
        return true;
      }
    }

    return false;
  },

  generateError: function(errCode, errMessage, res) {
    // This function will be called when the server will return an
    // error, errCode will be specified with an error message.
    res.status(errCode);
    res.send(errMessage);
  }
}