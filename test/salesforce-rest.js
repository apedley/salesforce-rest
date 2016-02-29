var expect = require('chai').expect;
var salesforceRest = require('../lib/salesforce-rest');

describe('salesforceRest', function() {
  it('has a function get', function() {
    expect(salesforceRest.get).to.be.a('function');
  });
  it('has a function post', function() {
    expect(salesforceRest.post).to.be.a('function');
  });
  describe('get', function() {
    it('returns get', function() {
    });
  });
});