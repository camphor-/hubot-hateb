var chai = require('chai');
var sinon = require('sinon');
chai.use = require('sinon-chai');

var expect = chai.expect;

describe('hateb', function() {
  beforeEach(function() {
    this.robot = {
      respond: sinon.spy(),
      hear: sinon.spy()
    };
    return require('../src/hateb')(this.robot);
  });
  it('registers a respond listener', function() {
    return expect(this.robot.respond).to.have.been.calledWith(/hubot hateb ranking/);
  });
  it('registers a hear listener', function() {
    return expect(this.robot.hear).to.have.been.calledWith(/orly/);
  });
});
