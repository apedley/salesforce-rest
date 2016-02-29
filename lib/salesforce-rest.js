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
  _options: {},

  setOptions: function(accessToken, instanceURL, path) {
    this._options.accessToken = accessToken;
    this._options.instanceURL = instanceURL.replace('https://', '');
    this._options.path = path || '/services/data/v20.0/query?';
  },

  get: function(query, callback) {
    if (!this._options.accessToken || !this._options.instanceURL || !this._options.path) {
      throw "Error: Options not set";
    }
    var queryString = querystring.stringify({q: query});
    var options = {
      host: this._options.instanceURL,
      method: 'GET',
      path: this._options.path + queryString,
      json: true,
      headers: {
        'Authorization': 'OAuth ' + this._options.accessToken,
        'Cache-Control':'no-cache,no-store,must-revalidate'
      }
    }
    var _req = https.request(options, function(_res) {
      var data = "";
      _res.on('data', function(chunk) {
        data += chunk;
      });
      _res.on('end', function() {
        callback(true, data);
      });
      _res.on('error', function(e) {
        callback(false, e);
      });
    });
    _req.end();    
  },

  post: function() {
    return 'post';
  }
}
