import $ from 'jquery';
import Traveler from './traveler';
import Trip from './trip';
import Destination from './destination';

let summaryView = $('#summary-view');
let userGreeting = $('#user-greeting');
let tripsStatus = $('#trips-status');
let tripsHeader = $('#trips-header');

let domUpdates = {
  displayTravelerInfo() {
    Promise.all([this.getTravelerData(), this.getTripsData(), this.getDestinationsData()])
      .then(data => {
        this.greetUser(data[0])
        const traveler = this.instantiateTraveler(data)
        this.displayTrips(traveler.trips);
        this.displayCost(traveler.trips)''
      })
      // .catch(error => console.log(error.message));
  },

  instantiateTraveler(data) {
    const travelerData = data[0];
    const tripsData = data[1];
    const destinationsData = data[2];
    const userTripData = tripsData.filter((tripData) => {
      return tripData.userID == travelerData.id
    })
    const trips = userTripData.map((tripData) => {
      const currentDestinationData = destinationsData.find((destinationData) => {
        return destinationData.id === tripData.destinationID
      })
      const destination = new Destination(currentDestinationData)
      tripData.destination = destination
      const currentTrip = new Trip(tripData)
      return currentTrip
    })
    travelerData.trips = trips
    let traveler = new Traveler(travelerData)
    return traveler;
  },

  getTravelerData() {
    return fetch('https://fe-apps.herokuapp.com/api/v1/travel-tracker/1911/travelers/travelers/50')
      .then(response => response.json())
      .then(data => data)
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

  greetUser(data) {
    userGreeting.html(`Welcome, ${data.name}!!!`)
  },

  displayTrips(trips) {
    let tripsToDisplay = trips.map((trip) => {
      return `<li>${trip.destination.destination} - ${trip.status}</li>`
    }).join('')
    tripsHeader.toggleClass('hidden');
    tripsStatus.html(tripsToDisplay)
  },

  displayCost(trips) {
    
  },

  // getTripDisplayData(tripsData, destinationsData) {
  //   let user50Trips = tripsData.filter((trip) => {
  //     return trip.userID === 50
  //   })
  //   let user50Destinations = user50Trips.map((trip) => {
  //     let destinationName = destinationsData.find((destination) => {
  //       return trip.destinationID === destination.id
  //     }).destination
  //     return {destination: destinationName, status: trip.status}
  //   })
  //   return user50Destinations;
  // },
};

export default domUpdates;
