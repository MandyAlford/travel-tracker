import User from './user'

class Traveler extends User {
  constructor(usersData) {
    super();
    this.id = usersData.id;
    this.name = usersData.name;
    this.travelerType = usersData.travelerType;
    this.trips = usersData.trips;
    this.username = 'traveler50'
    this.password = 'travel2020'
  }

  calculateTotalTripsCost() {
    let tripsSubtotal = this.trips.map((trip) => {
      return trip.calculateTripCost();
    }).reduce((acc, tripCost) => {
      acc += tripCost
      return acc;
    }, 0)
    return tripsSubtotal* 1.10;
  }

  findAllPendingTrips() {
    return this.trips.filter((trip) => {
      return trip.status === 'pending'
    })
  }
}

export default Traveler;
