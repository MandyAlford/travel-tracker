// This is the JavaScript entry file - your code begins here
// Do not delete or rename this file ********
import domUpdates from './domUpdates';
import scripts from './scripts';
import Destination from './destination';
import Trip from './trip';
import User from './user';
import Agent from './agent';
import Traveler from './traveler';

import $ from 'jquery';
import './css/base.scss';

import './images/turing-logo.png'

console.log('This is the JavaScript entry file - your code begins here.');

// for event listeners
let userName = $('#user-name')
let userPassword = $('#user-password')
let loginButton = $('#login-button')

loginButton.on('click', (event) => {
  // if (userName.val() === 'agency' && userPassword.val() === 'travel2020') {
    // console.log('an agent logged in')
    // domUpdates.displayAgentInfo()
  // } else if (userName.val() === 'traveler50' && userPassword.val() === 'travel2020') {
    // console.log('a traveler logged in')
    domUpdates.displayTravelerInfo()
  // } else {
  //   console.log('error')
  // }
})
