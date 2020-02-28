class Destination {
  constructor(destinationsData) {
    this.id = destinationsData.id;
    this.destination = destinationsData.destination;
    this.estimatedLodgingCostPerDay = destinationsData.estimatedLodgingCostPerDay;
    this.estimatedFlightCostPerPerson = destinationsData.estimatedFlightCostPerPerson;
    this.image = destinationsData.image;
    this.alt = destinationsData.alt;
  }

}

export default Destination;
