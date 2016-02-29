var expect = require('chai').expect;
var salesforceRest = require('../lib/salesforce-rest');
var config = require('./config');

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
  });

});
