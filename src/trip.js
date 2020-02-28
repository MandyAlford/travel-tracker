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
  }

}

export default Trip;
