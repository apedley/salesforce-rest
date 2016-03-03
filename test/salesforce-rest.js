var expect = require('chai').expect;
var salesforceRest = require('../lib/salesforce-rest');
var config = require('./config');
var Promise = require('bluebird');

describe('salesforceRest', function() {

  describe('options', function() {
    it('should start not set', function() {
      expect(salesforceRest.optionsSet()).to.be.false;
    });

    it('should set options', function() {
      salesforceRest.setRestOptions('abcdef', 'https://something.org');
      salesforceRest.setOptions({
        key: '123',
        secret:'1234'
      });
      expect(salesforceRest.optionsSet()).to.be.true;
    });

    it('should get options', function() {
      var options = salesforceRest.getOptions();
      expect(options.accessToken).to.equal('abcdef');
      expect(options.instanceURL).to.equal('something.org');
      expect(options.path).to.equal('/services/data/v20.0/query?');
      expect(options.key).to.equal('123');
      expect(options.secret).to.equal('1234');
    });
  });

  describe('login', function() {
    it('should not continue if options are not set', function() {
      salesforceRest.resetOptions();
      expect(function(){salesforceRest.login()}).to.throw(Error);
    });

    it('should login', function() {
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

    it('should not run query when options are not set', function() {
      var getFunction = function() {
        salesforceRest.get('Select Name FROM User', function(){});
      }

      expect(getFunction).to.throw(Error);
    });

    it('should run query after login', function() {

      salesforceRest.setOptions(config);

      var loginPromise = Promise.promisify(salesforceRest.login, {context: salesforceRest});

      loginPromise().then(function(rest){
      })
      .then(function() {
        salesforceRest.get('Select Name FROM User', function(error, data) {
          expect(error).to.be.null;
          data = JSON.parse(data);
          expect(Object.keys(data).length).to.be.gt(0);
        });
      })
      .catch(function(e) {
        console.error(e);
      });
    });
  });

  describe('post', function() {
    it('should not post if options are not set', function() {
      
    });

    it('should post after login', function() {

    });
  });
});
