import chai from 'chai';
const expect = chai.expect;
// import Destination from '../src/destination'
import Trip from '../src/trip'
import Traveler from '../src/traveler'
import Agent from '../src/agent'
import * as moment from 'moment'

let trip1;
let trip2;
let traveler;
let agent;

describe('Agent', function() {

  beforeEach(() => {
    trip1 = new Trip({
     "id": 1,
     "userID": 1,
     "destinationID": 49,
     "travelers": 2,
     "date": "2018/09/16",
     "duration": 4,
     "status": "pending",
     "suggestedActivities": [],
     "destination":
        {
        "id": 49,
        "destination": "Lima, Peru",
        "estimatedLodgingCostPerDay": 70,
        "estimatedFlightCostPerPerson": 400,
        "image": "https://images.unsplash.com/photo-1489171084589-9b5031ebcf9b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2089&q=80",
        "alt": "overview of city buildings with a clear sky"
        }
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
      "destination":
         {
         "id": 50,
         "destination": "Lima, Peru",
         "estimatedLodgingCostPerDay": 50,
         "estimatedFlightCostPerPerson": 300,
         "image": "https://images.unsplash.com/photo-1489171084589-9b5031ebcf9b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2089&q=80",
         "alt": "overview of city buildings with a clear sky"
         }
    })
    traveler = new Traveler({
     "id": 1,
     "name": "Ham Leadbeater",
     "travelerType": "relaxer",
     "trips": [trip1, trip2]
     })

    agent = new Agent([traveler]);
  })

 it('should be a function', function() {
    expect(Agent).to.be.a('function');
 });

 it('should have travelers', function() {
   expect(agent.travelersInfo).to.deep.equal([traveler]);
 });

 it('should be able to calculate revenue for the last year', function() {
   expect(agent.getRevenue(traveler.trips)).to.equal(130);
 });

 it('should not include revenue for trips in the future', function() {
   let trip3 = new Trip({
    "id": 1,
    "userID": 1,
    "destinationID": 50,
    "travelers": 3,
    "date": "2020/09/16",
    "duration": 8,
    "status": "approved",
    "suggestedActivities": [],
    "destination":
       {
       "id": 50,
       "destination": "Lima, Peru",
       "estimatedLodgingCostPerDay": 50,
       "estimatedFlightCostPerPerson": 300,
       "image": "https://images.unsplash.com/photo-1489171084589-9b5031ebcf9b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2089&q=80",
       "alt": "overview of city buildings with a clear sky"
       }
   })

   traveler.trips = [trip1, trip2, trip3];

   expect(agent.getRevenue(traveler.trips)).to.equal(130);
 });

 it('should know how many travelers are on trips today', function() {
   trip1.date = moment().format('YYYY/MM/DD');
   expect(agent.getTodaysTravelers()).to.equal(2);
 });
})
