import chai from 'chai';
const expect = chai.expect;
import Destination from '../src/destination'
import Trip from '../src/trip'

describe('Trip', function() {
  it('should be a function', function() {
    expect(true).to.equal(true);
  });

  it('should have a destination', function() {
    const destination = new Destination({
      "id": 49,
      "destination": "Lima, Peru",
      "estimatedLodgingCostPerDay": 70,
      "estimatedFlightCostPerPerson": 400,
      "image": "https://images.unsplash.com/photo-1489171084589-9b5031ebcf9b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2089&q=80",
      "alt": "overview of city buildings with a clear sky"
    })
    const trip = new Trip({
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
    expect(trip.destination).to.equal(destination);
  });

  it('should calculate cost of itself for one traveler', function() {
    const destination = new Destination({
      "id": 49,
      "destination": "Lima, Peru",
      "estimatedLodgingCostPerDay": 70,
      "estimatedFlightCostPerPerson": 400,
      "image": "https://images.unsplash.com/photo-1489171084589-9b5031ebcf9b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2089&q=80",
      "alt": "overview of city buildings with a clear sky"
    })
    const trip = new Trip({
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
    expect(trip.calculateTripCost()).to.equal(960);
  });

  it('should calculate cost of itself for more than one traveler', function() {
    const destination = new Destination({
      "id": 49,
      "destination": "Lima, Peru",
      "estimatedLodgingCostPerDay": 70,
      "estimatedFlightCostPerPerson": 400,
      "image": "https://images.unsplash.com/photo-1489171084589-9b5031ebcf9b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2089&q=80",
      "alt": "overview of city buildings with a clear sky"
    })
    const trip = new Trip({
      "id": 1,
      "userID": 44,
      "destinationID": 49,
      "travelers": 2,
      "date": "2019/09/16",
      "duration": 8,
      "status": "approved",
      "suggestedActivities": [],
      "destination": destination
    })
    expect(trip.calculateTripCost()).to.equal(1360);
  });

});
