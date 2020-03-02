import $ from 'jquery';
import Traveler from './traveler';
import Trip from './trip';
import Destination from './destination';
import Agent from '../src/agent'
import moment from 'moment'

let summaryView = $('#summary-view');
let userGreeting = $('#user-greeting');
let tripsStatus = $('#trips-status');
let tripsHeader = $('#trips-header');
let spendHeader = $('#spend-header');
let totalSpend = $('#total-spend');

tripsStatus.on('click', (event) => domUpdates.updateTripStatus(event));

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
        // debugger
        const agent = new Agent(allTravelers)
        totalSpend.text(`$${Math.round(agent.getRevenue())}`);
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
    this.updateAgentDashBoardHeaders();
  },

  updateAgentDashBoardHeaders() {
    tripsHeader.text(`Trips pending Approval:`);
    tripsHeader.toggleClass('hidden');
    spendHeader.toggleClass('hidden');
    spendHeader.text(`Your revenue this year:`);
  },

  displayTrips(trips) {
    let tripsToDisplay = trips.map((trip) => {
      return `<li>${trip.destination.destination} - ${trip.status}</li>`
    }).join('')
    tripsHeader.toggleClass('hidden');
    tripsStatus.html(tripsToDisplay);
  },

  displayAllPendingTrips(allTravelers) {
    // get all pending trips
    // const allTravelersWithPendingTrips = this.getAllTravelersWithPendingTrips(allTravelers)
    //generate html elements
    const allPendingTripHtml = allTravelers.reduce((acc1, traveler) => {
      const allTripDataForTraveler = traveler.trips.reduce((acc2, trip) => {
        if (trip.status === 'pending') {
          const listElement = `<li>${traveler.name} - ${trip.destination.destination} - ${trip.status} <button class='approve-trip' type='button'>Approve</button><button class='deny-trip' type='button'>Deny</button></li>`
          acc2 += listElement
        }
        return acc2
      }, '')
      acc1 += allTripDataForTraveler
      return acc1
    }, '')
    tripsStatus.html(allPendingTripHtml);
    //toggle hidden class
    //insert into html
// debugger

  },

  updateTripStatus(event) {
    if($(event.target).hasClass('approve-trip')) {
      console.log('approve!')
    } else if ($(event.target).hasClass('deny-trip')) {
      console.log('deny!')
    }
  },
  // getAllTravelersWithPendingTrips(allTravelers) {
  //   return allTravelers.filter((traveler) => {
  //     return traveler.findAllPendingTrips().length > 0
  //   })
  // },

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
