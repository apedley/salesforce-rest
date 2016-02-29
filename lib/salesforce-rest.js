var https = require('https');
var http = require('http');
var querystring = require('querystring');
var _ = require('underscore');
var forceDotComStrategy = require('passport-forcedotcom').Strategy;
var passport = require('passport');

var SFStrategy;

module.exports = {
  _options: {},

  login: function() {
    if (!this._options.key || !this._options.secret) {
      throw new Error('Options not set');
    }

  //   SFStrategy = new forceDotComStrategy({
  //     clientID: this._options.key,
  //     clientSecret: this._options.secret,
  //     callbackURL: this._options.callback,
  //     authorizationURL: this._options.authorize,
  //     tokenURL: this._options.token
  //   }, function(accessToken, refreshToken, profile, done) {
  //     process.nextTick(function() {
  //       this._options.accessToken = accessToken;
  //     })
  //   });
  //   passport.use(SFStrategy);
    
  },


  setOptions: function(options) {
    _.extend(this._options, options);
  },

  setRestOptions: function(accessToken, instanceURL, path) {
    this._options.accessToken = accessToken;
    this._options.instanceURL = instanceURL.replace('https://', '');
    this._options.path = path || '/services/data/v20.0/query?';
  },

  resetOptions: function() {
    this._options = {};
  },

  getOptions: function() {
    return this._options;
  },

  optionsSet: function() {
    return Object.keys(this._options).length > 0;
  },

  get: function(query, callback) {
    if (!this._options.accessToken || !this._options.instanceURL || !this._options.path) {
      throw "Options not set";
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

