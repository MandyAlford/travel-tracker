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
  const traveler = new Traveler({username: 'traveler50', password: 'travel2020'})
  const agent = new Agent({username: 'agency', password: 'travel2020'})
  const username = $('#user-name').val()
  const password = $('#user-password').val()

  if (agent.verifyUser(username, password)) {
    console.log('an agent logged in')
    domUpdates.displayAgentInfo()
  } else if (traveler.verifyUser(username, password)) {
    console.log('a traveler logged in')
    domUpdates.displayTravelerInfo()
  } else {
    console.log('error')
  }
})
