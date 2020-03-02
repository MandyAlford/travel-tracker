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
let todaysTravelers = $('#todays-travelers');
let requestTrip = $('#request-trip');

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
        this.displayTripBookingForm(destinationsData);
      })
      // .catch(error => console.log(error.message));
  },

  displayAgentInfo() {
    Promise.all([this.getAllTravelersData(), this.getTripsData(), this.getDestinationsData()])
      .then(data => {

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
        const todaysTravelerCount = agent.getTodaysTravelers();
          this.greetAgent(todaysTravelerCount);
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

  greetAgent(todaysTravelerCount) {
    userGreeting.html(`Welcome, Agent!!!`);
    this.updateAgentDashBoardHeaders(todaysTravelerCount);
  },

  updateAgentDashBoardHeaders(todaysTravelerCount) {
    tripsHeader.text(`Trips pending Approval:`);
    tripsHeader.toggleClass('hidden');
    spendHeader.toggleClass('hidden');
    spendHeader.text(`Your revenue this year:`);
    todaysTravelers.text(`There are ${todaysTravelerCount} travelers on trips today`)
  },

  displayTrips(trips) {
    let tripsToDisplay = trips.map((trip) => {
      return `<li>${trip.destination.destination} - ${trip.status}</li>`
    }).join('')
    tripsHeader.toggleClass('hidden');
    tripsStatus.html(tripsToDisplay);
  },

  displayAllPendingTrips(allTravelers) {
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
  },

  updateTripStatus(event) {
    if($(event.target).hasClass('approve-trip')) {
      console.log('approve!')
    } else if ($(event.target).hasClass('deny-trip')) {
      console.log('deny!')
    }
  },

  displayCost(traveler) {
    spendHeader.toggleClass('hidden');
    totalSpend.html(`\$ ${Math.round(traveler.calculateTotalTripsCost())}`);
  },

  displayTripBookingForm(destinationsData) {
    debugger
    let dropDownElement = this.getDestinationsHtml(destinationsData);
    requestTrip.html(`<form action="trip-request" id='trip-request'>
       <h2>Where to next?</h2>
       <h3>Request your next trip!</h3>
       <label for="trip-start">Choose your trip start date:</label>
       <input type="date" id="trip-start" name="trip-start"
              value="2020/03/02"
              min="2020/03/02" max="2022/12/31">
       <label for="destinations">Choose your destination:</label>
       <select id="destinations" name="destinations">${dropDownElement}
       </select>
       <label for="number-of-travelers">Total number of travelers:</label>
       <input type="number" id="number-of-travelers" name="traveler-number" min="1" max="10">
       <button class='book-trip' type='button'>Request your trip</button>
    </form>`);
  },

  getDestinationsHtml(destinationsData) {
    let dropDownElement =  destinationsData.reduce((acc, destination) => {
      acc += `<option value="${destination.id}">${destination.destination}</option>`
        // debugger
      return acc;

    }, '')
    return dropDownElement;
  }
};

export default domUpdates;
