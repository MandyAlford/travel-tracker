import chai from 'chai';
const expect = chai.expect;
import User from '../src/user'
import Traveler from '../src/traveler'


describe('User', function() {
  it('should be a function', function() {
    expect(User).to.be.a('function');
  });

  it('should be able to verify user', function() {
    let user = new Traveler({})
    expect(user.verifyUser('traveler50', 'travel2020')).to.equal(true);
  });

  it('should be able to deny a user when username is not valid', function() {
    let user = new Traveler({})
    expect(user.verifyUser('travelerz', 'travel2020')).to.equal(false);
  });

  it('should be able to deny a user when password is not valid', function() {
    let user = new Traveler({})
    expect(user.verifyUser('traveler50', 'travelz')).to.equal(false);
  });
});
