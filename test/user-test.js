import chai from 'chai';
const expect = chai.expect;
import User from '../src/user'

let user

describe('User', function() {
  beforeEach(() => {
    user = new User({username: 'traveler50', password: 'travel2020'})
  })

  it('should be a function', function() {
    expect(User).to.be.a('function');
  });

  it('should be able to verify user', function() {
    expect(user.verifyUser('traveler50', 'travel2020')).to.equal(true);
  });

  it('should be able to deny a user when username is not valid', function() {
    expect(user.verifyUser('travelerz', 'travel2020')).to.equal(false);
  });

  it('should be able to deny a user when password is not valid', function() {
    expect(user.verifyUser('traveler50', 'travelz')).to.equal(false);
  });
});
