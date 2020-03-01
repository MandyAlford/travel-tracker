import chai from 'chai';
const expect = chai.expect;
import Destination from '../src/destination'
import Trip from '../src/trip'
import Traveler from '../src/traveler'

let destination1;
let trip1;
let destination2;
let trip2;
let traveler;



describe('Traveler', function() {
  beforeEach(() => {
     destination1 = new Destination({
      "id": 49,
      "destination": "Lima, Peru",
      "estimatedLodgingCostPerDay": 70,
      "estimatedFlightCostPerPerson": 400,
      "image": "https://images.unsplash.com/photo-1489171084589-9b5031ebcf9b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2089&q=80",
      "alt": "overview of city buildings with a clear sky"
    })
     trip1 = new Trip({
      "id": 1,
      "userID": 1,
      "destinationID": 49,
      "travelers": 2,
      "date": "2019/09/16",
      "duration": 4,
      "status": "pending",
      "suggestedActivities": [],
      "destination": destination1
    })
     destination2 = new Destination({
      "id": 50,
      "destination": "Lima, Peru",
      "estimatedLodgingCostPerDay": 50,
      "estimatedFlightCostPerPerson": 300,
      "image": "https://images.unsplash.com/photo-1489171084589-9b5031ebcf9b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2089&q=80",
      "alt": "overview of city buildings with a clear sky"
    })
     trip2 = new Trip({
      "id": 1,
      "userID": 1,
      "destinationID": 50,
      "travelers": 3,
      "date": "2019/09/16",
      "duration": 8,
      "status": "approved",
      "suggestedActivities": [],
      "destination": destination2
    })

     traveler = new Traveler({
      "id": 1,
      "name": "Ham Leadbeater",
      "travelerType": "relaxer",
      "trips": [trip1, trip2]
      })
  })

  it('should be a function', function() {
    expect(true).to.equal(true);
  });

  it('should be able to calculate total money spent on all trips including agent fees', function() {
    expect(traveler.calculateTotalTripsCost()).to.equal(2618);
  });

  it('should be able to find all pending trips', function() {
    expect(traveler.findAllPendingTrips()).to.deep.equal([trip1]);
  })
})
