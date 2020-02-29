class Destination {
  constructor(destinationsData) {
    try {
      this.id = destinationsData.id;
      this.destination = destinationsData.destination;
      this.estimatedLodgingCostPerDay = destinationsData.estimatedLodgingCostPerDay;
      this.estimatedFlightCostPerPerson = destinationsData.estimatedFlightCostPerPerson;
      this.image = destinationsData.image;
      this.alt = destinationsData.alt;
    } catch(err) {
      this.id = 666;
      this.destination = 'hell';
      this.estimatedLodgingCostPerDay = 1;
      this.estimatedFlightCostPerPerson = 2;
      this.image = 'https://images.app.goo.gl/y2D2bgEd2ne6257Q6';
      this.alt = 'literally hell';
    }
  }
}

export default Destination;
