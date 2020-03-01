import $ from 'jquery';
import Traveler from './traveler';
import Trip from './trip';
import Destination from './destination';

let summaryView = $('#summary-view');
let userGreeting = $('#user-greeting');
let tripsStatus = $('#trips-status');
let tripsHeader = $('#trips-header');
let spendHeader = $('#spend-header');
let totalSpend = $('#total-spend');

let domUpdates = {
  displayTravelerInfo() {
    Promise.all([this.getTravelerData(), this.getTripsData(), this.getDestinationsData()])
      .then(data => {
        this.greetUser(data[0])
        const travelerData = data[0];
        const tripsData = data[1];
        const destinationsData = data[2];
        const traveler = this.instantiateTraveler(travelerData, tripsData, destinationsData)
        this.displayTrips(traveler.trips);
        this.displayCost(traveler);
      })
      // .catch(error => console.log(error.message));
  },

  displayAgentInfo() {
    Promise.all([this.getAllTravelersData(), this.getTripsData(), this.getDestinationsData()])
      .then(data => {
        this.greetAgent();
        const allTravelersData = data[0];
        const tripsData = data[1];
        const destinationsData = data[2];
        const allTravelers = allTravelersData.map((travelerData) => {
          return this.instantiateTraveler(travelerData, tripsData, destinationsData)
        })
        this.displayAllPendingTrips(allTravelers);
      })
  },

  instantiateTraveler(travelerData, tripsData, destinationsData) {
    const userTripData = tripsData.filter((tripData) => {
      return tripData.userID == travelerData.id
    })
    const trips = userTripData.map((tripData) => {
      const currentDestinationData = destinationsData.find((destinationsData) => {
        return destinationsData.id === tripData.destinationID
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

  getAllTravelersData(){
    return fetch('https://fe-apps.herokuapp.com/api/v1/travel-tracker/1911/travelers/travelers')
      .then(response => response.json())
      .then(data => data.travelers)
      .catch(error => console.log(error.message));
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

  greetAgent() {
    userGreeting.html(`Welcome, Agent!!!`);
    tripsHeader.text(`Trips pending Approval:`);
    tripsHeader.toggleClass('hidden');
    spendHeader.toggleClass('hidden');
  },

  displayTrips(trips) {
    let tripsToDisplay = trips.map((trip) => {
      return `<li>${trip.destination.destination} - ${trip.status}</li>`
    }).join('')
    tripsHeader.toggleClass('hidden');
    tripsStatus.html(tripsToDisplay)
  },

  displayAllPendingTrips(allTravelers) {
    // get all pending trips
    //generate html elements
    //toggle hidden class
    //insert into html
    const allPendingTripData = this.getAllPendingTrips(allTravelers)

  },

  getAllPendingTrips(allTravelers) {

  },

  displayCost(traveler) {
    spendHeader.toggleClass('hidden');
    totalSpend.html(`\$ ${traveler.calculateTotalTripsCost()}`);
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
