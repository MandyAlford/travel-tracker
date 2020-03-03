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
// let tripStartDate = $('#trip-start');
// let destinationInput = $('#destinations');
// let travelerNumber = $('#number-of-travelers');

tripsStatus.on('click', (event) => domUpdates.updateTripStatus(event));
// $(requestTrip).change((event) => {domUpdates.displayDestinationPicture(event);
// });

let domUpdates = {

  displayTravelerInfo() {
    Promise.all([this.getTravelerData(), this.getTripsData(), this.getDestinationsData()])
      .then(data => {
        this.greetUser(data[0])
        const travelerData = data[0];
        const tripsData = data[1];
        this.destinationsData = data[2];
        const traveler = this.instantiateTraveler(travelerData, tripsData, this.destinationsData)
        this.displayTrips(traveler.trips);
        this.displayCost(traveler);
        this.displayTripBookingForm(this.destinationsData);
        $('.book-trip').on('click', (event) => this.makeTripRequest(event));
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
        <label for="trip-durations">Trip duration:</label>
        <input type="number" id="trip-duration" name="duration" min="1" max="10">
       <button class='book-trip' type='button'>Request your trip</button>
    </form>
    <section id="cost-estimate"></section>`);

    $('#destinations').on('change', this.calculateTripCost.bind(this));
    $('#number-of-travelers').on('change', this.calculateTripCost.bind(this));
    $('#trip-durations').on('change', this.calculateTripCost.bind(this));
    // this.displayDestinationPicture(destinationsData);
  },

  calculateTripCost(event) {
    let destinationId = parseInt($('#destinations').val());
    let destinationInformation = this.destinationsData.find((destination) => {
      return destination.id === destinationId;
    });
    this.displayDestinationPicture(destinationId);

    let trip = new Trip(
      {
        destination: {
          estimatedFlightCostPerPerson: destinationInformation.estimatedFlightCostPerPerson,
          estimatedLodgingCostPerDay: destinationInformation.estimatedLodgingCostPerDay,
        },
        travelers: parseInt($('#number-of-travelers').val()),
        duration: parseInt($('#trip-duration').val()),
      }
    )
    let cost = trip.calculateTripCost()
    let totalCost = Math.round(cost * 1.1)
    if(this.checkTotalCost(totalCost) === true) {
      $('#cost-estimate').text(`Please enter a value in all fields`)
    } else {
      $('#cost-estimate').text(`Cost for this trip would be $${totalCost}`)
    }
  },

  checkTotalCost(totalCost) {
    return isNaN(totalCost);
 },

  getDestinationsHtml(destinationsData) {
    let dropDownElement =  destinationsData.reduce((acc, destination) => {
      acc += `<option value="${destination.id}">${destination.destination}</option>`
      return acc;

    }, '')
    return dropDownElement;
  },

  displayDestinationPicture(destinationId) {
  let currentDestination = this.destinationsData.find((destination) => {
    return destination.id === destinationId
  });

  $('#destination-images').html(` <img id='${currentDestination.id}' class='destination-image' src="${currentDestination.image}" alt="${currentDestination.alt}">`)

 // $('#destination-images').html(this.getDestinationImagesHtml(destinationsData));
 },

 // getDestinationImagesHtml(destinationsData) {
 //   let imagesHtml = destinationsData.reduce((acc, destination) => {
 //     acc += ` <img id='${destination.id}' class='destination-image' src="${destination.image}" alt="${destination.alt}">`
 //     return acc;
 //   }, '')
 //   return imagesHtml;
  // debugger
 // },

  makeTripRequest(event) {
    // debugger
    // let tripInfo
    // if(tripStartDate.length > 0 && travelerNumber.length > 0) {
    // console.log(dateInfo);
    // debugger

      let tripInfo = {
        'id': Date.now(),
        'userID': 50,
        'destinationID': parseInt($('#destinations option:selected').val()),
        'travelers': parseInt($('#number-of-travelers').val()),
        'date': moment($('#trip-start').val()).format('YYYY/MM/DD'),
        'duration': parseInt($('#trip-duration').val()),
        'status': 'pending',
        'suggestedActivities': []
      }
    // } else {
    //   alert( "All fields required to book trip!" )
    // }
    this.submitNewTripRequest(tripInfo)
  },

  submitNewTripRequest(tripInfo) {
    fetch(
      'https://fe-apps.herokuapp.com/api/v1/travel-tracker/1911/trips/trips',
      {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(tripInfo)
      }
    )
      .then(response => response.json())
      .then(data => {this.displayTravelerInfo()})
      .catch(error => console.log(error.message));
  },



};

export default domUpdates;
