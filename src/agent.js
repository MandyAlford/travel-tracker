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
  getTodaysTravelers() {
    let todaysTravelers = this.travelersInfo.reduce((acc, traveler) => {
      const today = moment().format('YYYY/MM/DD');
      traveler.trips.forEach((trip) => {
        if(trip.date === today) {
          acc += trip.travelers;
        }
      })
      return acc;
    }, 0)
    return todaysTravelers;
  }
}

export default Agent;
