// This is the JavaScript entry file - your code begins here
// Do not delete or rename this file ********
import domUpdates from './domUpdates';
import Destination from './destination';
import Trip from './trip';
import User from './user';
import Agent from './agent';
import Traveler from './traveler';

import $ from 'jquery';
import './css/base.scss';

import './images/turing-logo.png'


// for event listeners
const loginButton = $('#login-button')

loginButton.on('click', (event) => {
  const allTravelers = createAllTravelers()
  const agent = new Agent({username: 'agency', password: 'travel2020'})

  const username = $('#user-name').val()
  const password = $('#user-password').val()

  const traveler = allTravelers.find((traveler) => {
    return traveler.username === username;
  })

  if (agent.verifyUser(username, password)) {
    console.log('an agent logged in')
    domUpdates.displayAgentInfo()
  } else if (traveler.verifyUser(username, password)) {
    console.log('a traveler logged in')
    domUpdates.displayTravelerInfo(traveler.id)
  } else {
    console.log('error')
  }
})

const createAllTravelers = () => {
  let allTravelers = []
  for(var i = 1; i <=50; i++) {
    allTravelers.push(new Traveler({id: i, username: `traveler${i}`, password: 'travel2020'}))
  }
  return allTravelers
}
