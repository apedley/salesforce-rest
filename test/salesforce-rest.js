var expect = require('chai').expect;
var salesforceRest = require('../lib/salesforce-rest');
var config = require('./config');
var Promise = require('bluebird');
var querystring = require('querystring');
var _ = require('underscore');

describe('salesforceRest', function() {
  var id;
  describe('options', function() {
    it('starts not set', function() {
      expect(salesforceRest.optionsSet()).to.be.false;
    });

    it('sets options', function() {
      salesforceRest.setRestOptions('abcdef', 'https://something.org');
      salesforceRest.setOptions({
        key: '123',
        secret:'1234'
      });
      expect(salesforceRest.optionsSet()).to.be.true;
    });

    it('gets options', function() {
      var options = salesforceRest.getOptions();
      expect(options.accessToken).to.equal('abcdef');
      expect(options.instanceURL).to.equal('something.org');
      expect(options.path).to.equal('/services/data/v20.0/query?');
      expect(options.key).to.equal('123');
      expect(options.secret).to.equal('1234');
    });
  });

  describe('login', function() {
    it('does not login if options are not set', function() {
      salesforceRest.resetOptions();
      expect(function(){salesforceRest.login()}).to.throw(Error);
    });

    it('logs in', function() {
      salesforceRest.setOptions(config);
      salesforceRest.login(function(error, data) {
        expect(data).to.have.property('access_token');
        var options = salesforceRest.getOptions();
        expect(options).to.have.property('accessToken');
      });
    });
  });

  describe('get', function() {
    beforeEach(function() {
      salesforceRest.resetOptions();
    });

    it('does not run query when options are not set', function() {
      var getFunction = function() {
        salesforceRest.get('Select Name FROM User', function(){});
      }

      expect(getFunction).to.throw(Error);
    });

    it('runs query after login', function(done) {
      this.timeout(5000);
      salesforceRest.setOptions(config);

      var loginPromise = Promise.promisify(salesforceRest.login, {context: salesforceRest});

      loginPromise().then(function(rest){
      })
      .then(function() {
        salesforceRest.get('Select Name FROM User', function(error, data) {
          expect(error).to.be.null;
          
          expect(Object.keys(data).length).to.be.gt(0);
          done();
        });
      })
      .catch(function(e) {
        console.error(e);
      });
    });
  });

  describe('post', function() {
    it('does not post if options are not set', function() {

      salesforceRest.resetOptions();
      var postFunction = function() {
        salesforceRest.post('/services/data/v20.0/sobjects/Contact/');
      }
      expect(postFunction).to.throw(Error);
    });

    it('posts after login', function(done) {
      this.timeout(5000);
      salesforceRest.setOptions(config);

      var loginPromise = Promise.promisify(salesforceRest.login, {context: salesforceRest});

      var postData = {
          "FirstName": "Buddy",
          "LastName": "Testman",
      }
      loginPromise().then(function(rest){})
      .then(function() {
        salesforceRest.post('/services/data/v20.0/sobjects/Contact/', postData, function(error, data) {
          expect(error).to.be.null;
          data = JSON.parse(data);
          expect(data.success).to.be.true;
          done();
        })
      })
      .catch(function(e){
        console.error(e);
        done();
      })
    });
  });

  describe('put', function() {
    var query = "SELECT Id from Contact WHERE FirstName = 'Buddy' LIMIT 1";
    

    before(function(done) {
      salesforceRest.get(query, function(error, data) {
        if (error) {
          throw new Error('error getting id');
        }
        expect(error).to.be.null;

        id = data.records[0].Id;
        done();
      })
    });

    it('does not update if options are not set', function(done) {
      var url = salesforceRest.getOptions().instanceURL;
      
      var putFunction = function() {
        salesforceRest.put(query);
      }
      expect(putFunction).to.throw(Error);
      salesforceRest.setOptions({instanceURL: url});
      done();
    });

    it('updates a record', function(done) {
      this.timeout(5000);
      salesforceRest.put('Contact', id, {LastName: 'Redman'}, function(error, data) {
        expect(error).to.be.null;
        var confirmQuery = "SELECT LastName from Contact WHERE Id = '" + id + "'";

        salesforceRest.get(confirmQuery, function(error, data) {
          expect(error).to.be.null;
          expect(data.records[0].LastName).to.be.eql('Redman');
          done();
        });
      });
    });
  });

  describe('delete', function() {
    it ('does not delete record if options, id, or object name are not set', function() {
      var deleteFunction = function() {
        salesforceRest.delete();
      }
      expect(deleteFunction).to.throw(Error);
      var accessToken = salesforceRest.getOptions().accessToken;
      salesforceRest.setOptions({accessToken: null});
      deleteFunction = function() {
        salesforceRest.delete('test', '2');
      }
      expect(deleteFunction).to.throw(Error);
      salesforceRest.setOptions({accessToken: accessToken});
    });

    it ('deletes record', function(done) {
      this.timeout(5000);
      salesforceRest.delete('Contact', id, function(error, data) {
        expect(error).to.be.null;
        var confirmQuery = "SELECT Name from Contact WHERE Id = '" + id + "'";

        salesforceRest.get(confirmQuery, function(error, data) {
          expect(error).to.be.null;
          expect(data.totalSize).to.be.equal(0);
          done();
        });
      });
    });
  });
});
