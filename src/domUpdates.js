import $ from 'jquery';

let summaryView = $('#summary-view');

let domUpdates = {
  greetUser(data) {
    summaryView.html(`Welcome, ${data.name}!!!`)
  },

  displayTravelerInfo() {
    this.callApiAndGreetUser()
    this.callApiAndDisplayTrips()
  },

  callApiAndGreetUser() {
    fetch('https://fe-apps.herokuapp.com/api/v1/travel-tracker/1911/travelers/travelers/50')
      .then(response => response.json())
      .then(data => {
        domUpdates.greetUser(data)
      })
      .catch(error => console.log(error.message));
  },

  callApiAndDisplayTrips() {
    Promise.all([this.getTripsData(), this.getDestinationsData()])
      .then(data => {
        let tripsData = data[0];
        let destinationsData = data[1];
        this.displayTrips(tripsData, destinationsData)
      })
      .catch(error => console.log(error.message));
  },

  getTripsData() {
    return fetch('https://fe-apps.herokuapp.com/api/v1/travel-tracker/1911/trips/trips')
      .then(response => response.json())
      .then(data => data.trips)
      .catch(error => console.log(error.message));
  },

  getDestinationsData() {
    return fetch('https://fe-apps.herokuapp.com/api/v1/travel-tracker/1911/destinations/destinations')
      .then(response => response.json())
      .then(data => data.destinations)
      .catch(error => console.log(error.message));
  },

  displayTrips(tripsData, destinationsData) {
    let displayData = getTripDisplayData(tripsData, destinationsData);

    displayData.forEach((tripData) => {
      
    })
  },

  getTripDisplayData(tripsData, destinationsData) {
    let user50Trips = tripsData.filter((trip) => {
      return trip.userID === 50
    })
    let user50Destinations = user50Trips.map((trip) => {
      let destinationName = destinationsData.find((destination) => {
        return trip.destinationID === destination.id
      }).destination
      return {destination: destinationName, status: trip.status}
    })
    return user50Destinations;
  }
};

export default domUpdates;
