import chai from 'chai';
const expect = chai.expect;
import Destination from '../src/destination'
import Trip from '../src/trip'
import Traveler from '../src/traveler'

describe('Traveler', function() {
  it('should be a function', function() {
    expect(true).to.equal(true);
  });
})

it('should be able to calculate total money spent on all trips including agent fees', function() {

  const destination1 = new Destination({
    "id": 49,
    "destination": "Lima, Peru",
    "estimatedLodgingCostPerDay": 70,
    "estimatedFlightCostPerPerson": 400,
    "image": "https://images.unsplash.com/photo-1489171084589-9b5031ebcf9b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2089&q=80",
    "alt": "overview of city buildings with a clear sky"
  })
  const trip1 = new Trip({
    "id": 1,
    "userID": 44,
    "destinationID": 49,
    "travelers": 2,
    "date": "2019/09/16",
    "duration": 4,
    "status": "approved",
    "suggestedActivities": [],
    "destination": destination1
  })
  const destination2 = new Destination({
    "id": 49,
    "destination": "Lima, Peru",
    "estimatedLodgingCostPerDay": 50,
    "estimatedFlightCostPerPerson": 300,
    "image": "https://images.unsplash.com/photo-1489171084589-9b5031ebcf9b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2089&q=80",
    "alt": "overview of city buildings with a clear sky"
  })
  const trip2 = new Trip({
    "id": 1,
    "userID": 44,
    "destinationID": 49,
    "travelers": 3,
    "date": "2019/09/16",
    "duration": 8,
    "status": "approved",
    "suggestedActivities": [],
    "destination": destination2
  })

  const traveler = new Traveler({
    "id": 1,
    "name": "Ham Leadbeater",
    "travelerType": "relaxer",
    "trips": [trip1, trip2]
    })
  expect(traveler.calculateTotalTripsCost()).to.equal(2618);
});
