import User from './user'

class Agent extends User {
  constructor(allTravelers) {
    super();
    this.travelersInfo = allTravelers;
  }
  getRevenue() {
    let totalTripsCost = this.travelersInfo.reduce((acc, traveler) => {
      traveler.trips.forEach((trip) => {
        acc += trip.calculateTripCost();
      })
      return acc;
    }, 0)
    return totalTripsCost * .1;
  }
}

export default Agent;

// 2380
