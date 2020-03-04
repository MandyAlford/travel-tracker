import chai from 'chai';
const expect = chai.expect;
import User from '../src/user'


describe('User', function() {
  it('should be a function', function() {
    expect(User).to.be.a('function');
  });

  it('should be able to verify user', function() {
    let user = new User()
    user.verifyUser()
    expect(User).to.be.a('function');
  });
});
