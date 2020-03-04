import chai from 'chai';
const expect = chai.expect;

import Destination from '../src/destination'


let destination

describe('Destination', function() {

  beforeEach(() => {
    destination = new Destination({
      "id": 1,
      "destination": "Lima, Peru",
      "estimatedLodgingCostPerDay": 70,
      "estimatedFlightCostPerPerson": 400,
      "image": "https://images.unsplash.com/photo-1489171084589-9b5031ebcf9b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2089&q=80",
      "alt": "overview of city buildings with a clear sky"
    })
  });

  it('should be a function', function() {
     expect(Destination).to.be.a('function');
  });

  it('should have an id', function() {
    expect(destination.id).to.equal(1);
  });

  it('should have destination name', function() {
    expect(destination.destination).to.equal('Lima, Peru');
  });

  it('should have an estimated loding cost per day', function() {
    expect(destination.estimatedLodgingCostPerDay).to.equal(70);
  });

  it('should have an estimated flight cost per person', function() {
    expect(destination.estimatedFlightCostPerPerson).to.equal(400);
  });

  it('should have an image', function() {
    expect(destination.image).to.equal("https://images.unsplash.com/photo-1489171084589-9b5031ebcf9b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2089&q=80");
  });

  it('should have an image alt tag', function() {
    expect(destination.alt).to.equal("overview of city buildings with a clear sky");
  });
})
