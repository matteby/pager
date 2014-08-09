"use strict";

var jwt = require('jsonwebtoken');
var config = require('./config');

var database2 = {
    clients: {
        officialApiClient: { secret: "C0FFEE" },
        pagerApiClient: { secret: "none" }
    },
    users: {
        demoAdmin: { password: "demo", admin: true  },
        demoUser: { password: "demo", admin: false  },
    }
};

exports.validateClient = "allow public clients";

exports.grantUserToken = function (allCredentials, req, cb) {
	var password = allCredentials.password;
	var username = allCredentials.username;

  if(database2.users[username] && database2.users[username]['password'] == password)
  {
    // We are sending the profile inside the token
    var token = jwt.sign({username: username, admin: database2.users[username]['admin']}, config.JWT_SECRET, config.JWT_OPTIONS);

    // Call back with the token so Restify-OAuth2 can pass it on to the client.
    return cb(null, token);
  }
    
  // Call back with `false` to signal the username/password combination did not authenticate.
  // Calling back with an error would be reserved for internal server error situations.
  cb(null, false);
};

exports.authenticateToken = function (token, req, cb) {
  jwt.verify(token, config.JWT_SECRET, config.JWT_OPTIONS, function(err, decoded) {
    if (err){
      return cb(null, false);
    }
    cb(null, decoded.username);
  });
};