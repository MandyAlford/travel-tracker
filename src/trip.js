class Trip {
  constructor(tripsData) {
    this.id = tripsData.id;
    this.userID = tripsData.userID;
    this.destinationID = tripsData.destinationID;
    this.travelers = tripsData.travelers;
    this.date = tripsData.date;
    this.duration = tripsData.duration;
    this.status = tripsData.status;
    this.suggestedActivities = tripsData.suggestedActivities;
    this.destination = tripsData.destination;
  }
  calculateTripCost() {
    return ((this.travelers * this.destination.estimatedFlightCostPerPerson) + (this.duration * this.destination.estimatedLodgingCostPerDay))
  }
}

export default Trip;
