import $ from 'jquery';
import Traveler from './traveler';
import Trip from './trip';
import Destination from './destination';
import Agent from '../src/agent'
import moment from 'moment'


$('#trips-status').on('click', (event) => domUpdates.updateTripStatus(event));

let domUpdates = {

  displayTravelerInfo(travelerId = 50) {
    Promise.all([this.getTravelerData(travelerId), this.getTripsData(), this.getDestinationsData()])
      .then(data => {
        this.greetUser(data[0])
        const travelerData = data[0];
        const tripsData = data[1];
        this.destinationsData = data[2];
        const traveler = this.instantiateTraveler(travelerData, tripsData, this.destinationsData)
        this.displayTrips(traveler.trips);
        this.displayCost(traveler);
        this.displayTripBookingForm(this.destinationsData);
        debugger
        $('.book-trip').on('click', (event) => this.makeTripRequest(event, traveler.id));
      })
      .catch(error => console.log(error.message));
  },

  displayAgentInfo() {
    Promise.all([this.getAllTravelersData(), this.getTripsData(), this.getDestinationsData()])
      .then(data => {

        const allTravelersData = data[0];
        const tripsData = data[1];
        const destinationsData = data[2];
        this.allTravelers = allTravelersData.map((travelerData) => {
          return this.instantiateTraveler(travelerData, tripsData, destinationsData)
        })
        this.displayAllPendingTrips(this.allTravelers);
        const agent = new Agent({allTravelers: this.allTravelers})
        $('#total-spend').text(`$${Math.round(agent.getRevenue())}`);
        const todaysTravelerCount = agent.getTodaysTravelers();
        this.greetAgent(todaysTravelerCount);
      })
  },

  showTravelerInfo(traveler) {
    this.displayAllPendingTrips([traveler]);
    this.displayAllApprovedTripsHtml([traveler]);
    this.displayCost(traveler);
    $('#spend-header').text(`${traveler.name}'s total spend this year:`);
    $('#trips-header').text(`${traveler.name}'s trips:`);
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

  getTravelerData(travelerId) {
    return fetch(`https://fe-apps.herokuapp.com/api/v1/travel-tracker/1911/travelers/travelers/${travelerId}`)
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
    $('#user-greeting').html(`Welcome, ${data.name}!!!`);
    $('#summary-view').addClass('dashboard');
    $('#right-dashboard').addClass('dashboard');
  },

  greetAgent(todaysTravelerCount) {
    $('#user-greeting').html(`Welcome, Agent!!!`);
    this.updateAgentDashBoardHeaders(todaysTravelerCount);
  },

  updateAgentDashBoardHeaders(todaysTravelerCount) {
    $('#trips-header').text(`Trips pending Approval:`);
    $('#trips-header').removeClass('hidden');
    $('#spend-header').removeClass('hidden');
    $('#spend-header').text(`Your revenue this year:`);
    $('#todays-travelers').text(`There are ${todaysTravelerCount} travelers on trips today`);
    this.showUserSearch();
    $('#summary-view').addClass('dashboard');
    $('#right-dashboard').addClass('dashboard')
  },

  showUserSearch() {
    $('#right-dashboard').html(`<section id='search'>
             <h3> Search for traveler by name: <h3>
               <input id='user-search' class='search' type='text' placeholder='Traveler name'>
               <section id='user-account-info'></section>  <button id='search-button'>Search for Traveler</button>
           </section>`)
    $('#search-button').on('click', this.findTravelerInfo.bind(this));
  },

  findTravelerInfo() {
    let name = $('#user-search').val();
    let nameToSearch = name.toUpperCase();
    let searchedTraveler = this.allTravelers.find((traveler) => {
      let travelerName = traveler.name.toUpperCase();
      let travelerNames = travelerName.split(' ');

      return travelerNames.includes(nameToSearch)
    })
    this.showTravelerInfo(searchedTraveler)
  },

  displayTrips(trips) {
    let tripsToDisplay = trips.map((trip) => {
      return `<li>${trip.destination.destination} - ${trip.status}</li>`
    }).join('')
    $('#trips-header').removeClass('hidden');
    $('#trips-status').html(tripsToDisplay);
  },

  displayAllPendingTrips(allTravelers) {
    const allPendingTripHtml = allTravelers.reduce((acc1, traveler) => {
      const allTripDataForTraveler = traveler.trips.reduce((acc2, trip) => {
        if (trip.status === 'pending') {
          const listElement = `<li>${traveler.name} - ${trip.destination.destination} - ${trip.status} <button class='approve-trip' type='button' trip-id=${trip.id}>Approve</button><button class='deny-trip' type='button' trip-id=${trip.id}>Deny</button></li>`
          acc2 += listElement
        }
        return acc2
      }, '')
      acc1 += allTripDataForTraveler
      return acc1
    }, '')
    $('#trips-status').html(allPendingTripHtml);
  },

  displayAllApprovedTripsHtml(allTravelers) {
    const allPendingTripHtml = allTravelers.reduce((acc1, traveler) => {
      const allTripDataForTraveler = traveler.trips.reduce((acc2, trip) => {
        if (trip.status === 'approved') {
          const listElement = `<li>${traveler.name} - ${trip.destination.destination} - ${trip.status}</li>`
          acc2 += listElement
        }
        return acc2
      }, '')
      acc1 += allTripDataForTraveler
      return acc1
    }, '')
    $('#trips-status').append(allPendingTripHtml);
  },

  updateTripStatus(event) {
    const tripId = parseInt(event.target.getAttribute('trip-id'));

    if($(event.target).hasClass('approve-trip')) {
      let tripInfo = {
        'id': tripId,
        'status': 'approved'
      }

      this.approveTripRequest(tripInfo);
    } else if ($(event.target).hasClass('deny-trip')) {
      let tripInfo = {
        'id': tripId
      }
      this.deleteTripRequest(tripInfo);
    }
  },

  deleteTripRequest(tripInfo) {
    fetch(
      'https://fe-apps.herokuapp.com/api/v1/travel-tracker/1911/trips/trips',
      {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(tripInfo)
      }
    )
    .then(response => response.json())
    .then(data => {this.displayAgentInfo()})
    .catch(error => console.log(error.message));
  },

  approveTripRequest(tripInfo) {
    fetch(
      'https://fe-apps.herokuapp.com/api/v1/travel-tracker/1911/trips/updateTrip',
      {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(tripInfo)
      }
    )
      .then(response => response.json())
      .then(data => {this.displayAgentInfo()})
      .catch(error => console.log(error.message));
  },

  displayCost(traveler) {
    $('#spend-header').removeClass('hidden');
    $('#total-spend').html(`\$ ${Math.round(traveler.calculateTotalTripsCost())}`);
  },

  displayTripBookingForm(destinationsData) {
    let dropDownElement = this.getDestinationsHtml(destinationsData);
    $('#request-trip').html(`<form action="trip-request" id='trip-request'>
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
    $('#trip-duration').on('change', this.calculateTripCost.bind(this));
  },

  calculateTripCost() {
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
 },

  makeTripRequest(event, travelerId) {
      let tripInfo = {
        'id': Date.now(),
        'userID': travelerId,
        'destinationID': parseInt($('#destinations option:selected').val()),
        'travelers': parseInt($('#number-of-travelers').val()),
        'date': moment($('#trip-start').val()).format('YYYY/MM/DD'),
        'duration': parseInt($('#trip-duration').val()),
        'status': 'pending',
        'suggestedActivities': []
      }
    this.submitNewTripRequest(tripInfo, travelerId)
  },

  submitNewTripRequest(tripInfo, travelerId) {
    fetch(
      'https://fe-apps.herokuapp.com/api/v1/travel-tracker/1911/trips/trips',
      {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(tripInfo)
      }
    )
      .then(response => response.json())
      .then(data => {this.displayTravelerInfo(travelerId)})
      .catch(error => console.log(error.message));
  },
};

export default domUpdates;
