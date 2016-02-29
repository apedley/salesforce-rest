var https = require('https');
var http = require('http');
var querystring = require('querystring');


// var request = require('request');
// var forceDotComStrategy = require('passport-forcedotcom').Strategy;
// var passport = require('passport');


module.exports = {
  // login: function() {
  //   return 'login';
  // },
  
  get: function(accessToken, instanceURL, query, callback, path) {
    path = path || '/services/data/v20.0/query?';
    var queryString = querystring.stringify({q: query});

    var options = {
      host: instanceURL.replace('https://', ''),
      method: 'GET',
      json: true,
      headers: {
        'Authorization': 'OAuth '+accessToken,
        'Cache-Control':'no-cache,no-store,must-revalidate'
      }
    }

    var _req = https.request(options, function(_res) {
      _res.on('data', function(data) {
        callback(true, data);
      });
    });

    _req.on('error', function(e) {
      callback(false, e);
    })
    _req.end();
  },
  post: function() {
    return 'post';
  }
}
