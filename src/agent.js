import User from './user'
import * as moment from 'moment';

class Agent extends User {
  constructor(allTravelers) {
    super();
    this.travelersInfo = allTravelers;
  }
  getRevenue() {
    let totalTripsCost = this.travelersInfo.reduce((acc, traveler) => {
      traveler.trips.forEach((trip) => {
        const tripDate = moment(trip.date)
        const oneYearAgo = moment().subtract(1, 'years')
        const now = moment()
        if(tripDate.isAfter(oneYearAgo) && tripDate.isBefore(now)) {
        acc += trip.calculateTripCost();
        }
      })
      return acc;
    }, 0)
    return totalTripsCost * .1;
  }
}

export default Agent;
