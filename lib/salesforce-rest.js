var https = require('https');
var http = require('http');
var querystring = require('querystring');
var _ = require('underscore');


module.exports = {
  _options: {},

  // Take information set in options and obtains an access token.
  // Returns access token
  login: function(callback) {
    if (!this._options.key || !this._options.secret || !this._options.hostName ||
        !this._options.username || !this._options.password || !this._options.tokenPath ||
        !this._options.userSecurityToken) {
      throw new Error('Options not set');
    }

    // Need to append user Security Token to password
    var postData = querystring.stringify({
      grant_type: 'password',
      client_id: this._options.key,
      client_secret: this._options.secret,
      username: this._options.username,
      password: this._options.password + this._options.userSecurityToken
    });
    var options = {
      hostname: this._options.hostName,
      path: this._options.tokenPath,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': postData.length
      }
    }
    var that = this;
    var req = https.request(options, function(res) {
      var data = "";
      res.on('data', function(chunk) {
        data += chunk;
      });
      res.on('end', function() {
        // set the options
        data = JSON.parse(data);

        that.setRestOptions(data.access_token, data.instance_url);
        // run callback
        callback(null, data);
      });
    });

    req.write(postData);
    req.end();
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
      throw new Error("Options not set");
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
        callback(null, data);
      });
      _res.on('error', function(e) {
        callback(new Error(), null);
      });
    });
    _req.end();    
  },

  post: function(path, data, callback) {
    if (!this._options.basePostSite || !this._options.accessToken || !path) {
      throw new Error("Options not set");
    }

    data = JSON.stringify(data);

    var options = {
      host: this._options.basePostSite,
      path: path,
      method: 'POST',
      headers: {
        'Authorization': 'OAuth ' + this._options.accessToken,
        'Content-Length': Buffer.byteLength(data),
        'Content-Type': 'application/json;charset=UTF-8'
      }
    }

    var req = https.request(options, function(res) {
      var data = "";
      res.on('data', function(chunk) {
        data += chunk;
      });
      res.on('end', function() {
        // run callback
        callback(null, data);
      });
      res.on('error', function(e) {
        callback(new Error('Error: ' + e), null);
      })
    });

    req.write(data);
    req.end();
  }
}

