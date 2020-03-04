import chai from 'chai';
const expect = chai.expect;
import Destination from '../src/destination'
import Trip from '../src/trip'

let destination
let trip

describe('Trip', function() {
  beforeEach(() => {
    destination = new Destination({
      "id": 49,
      "destination": "Lima, Peru",
      "estimatedLodgingCostPerDay": 70,
      "estimatedFlightCostPerPerson": 400,
      "image": "https://images.unsplash.com/photo-1489171084589-9b5031ebcf9b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2089&q=80",
      "alt": "overview of city buildings with a clear sky"
    })
     trip = new Trip({
      "id": 1,
      "userID": 44,
      "destinationID": 49,
      "travelers": 1,
      "date": "2019/09/16",
      "duration": 8,
      "status": "approved",
      "suggestedActivities": [],
      "destination": destination
    })
  })

  it('should be a function', function() {
    expect(true).to.equal(true);
  });

  it('should have a trip id', function() {
    expect(trip.id).to.equal(1);
  });

  it('should have a user id', function() {
    expect(trip.userID).to.equal(44);
  });

  it('should have a destination id', function() {
    expect(trip.destinationID).to.equal(49);
  });

  it('should have a number of travelers', function() {
    expect(trip.travelers).to.equal(1);
  });

  it('should have a date', function() {
    expect(trip.date).to.equal("2019/09/16");
  });

  it('should have a duration', function() {
    expect(trip.duration).to.equal(8);
  });

  it('should have a status', function() {
    expect(trip.status).to.equal("approved");
  });

  it('should have suggested activities', function() {
    expect(trip.suggestedActivities).to.deep.equal([]);
  });

  it('should have a destination', function() {
    expect(trip.destination).to.equal(destination);
  });

  it('should calculate cost of itself for one traveler', function() {
    expect(trip.calculateTripCost()).to.equal(960);
  });

  it('should calculate cost of itself for more than one traveler', function() {
    trip.travelers = 2;
    expect(trip.calculateTripCost()).to.equal(1360);
  });

});
