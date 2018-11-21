// Enable live reloading of HTML and CSS while in development mode. 
// Implemented using .env global variables -> Setup with NPM (--env.NODE_ENV=dev) and compiled with webpack (webpack.DefinePlugin) 

if (process.env.NODE_ENV === 'dev') {
  require('../index.html');
  require('../../dist/css/main.css');
}

/* ---------------------------------------- */
/* ------------ IMPORT MODULES ------------ */

import {
  DOMelements, 
  controledHooksStrings, 
  menuIdentifiers
} from './views/view.base';

import * as navMenuView from './views/view.nav-menu';
import * as headerView from './views/view.header';

/* ---------------------------------------- */
/* ---------------------------------------- */
/* ------------ APP CONTROLLER ------------ */
/* ---------------------------------------- */
/* ---------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
  registerEventListeners();
}, false);


function registerEventListeners() {
  logoController();
  navMenuController();
}

/* ---------------------------------------- */
/* ------------ LOGO CONTROLLER ----------- */
/* ---------------------------------------- */

function logoController() {
  DOMelements.headerLogo.addEventListener('click', e => {
    clearHomePage();
    renderHomePage();
  });
}

function clearHomePage() {
  // If 
  headerView.removeIntroHeading();
}

function renderHomePage() {
  // TODO: 
  // --> If Logged Out

  // Render Header components
  headerView.renderIntroHeading();

  // Render Main Content Components


  // TODO: 
  // 1) If Logged In

}

/* ---------------------------------------- */
/* ------- NAVIGATION MENU CONTROLLER ----- */
/* ---------------------------------------- */

function navMenuController() {
  DOMelements.navMenu.addEventListener('click', e => {
    e.stopPropagation(); // stop the event bubbling to the top of the DOM tree (body)

    const targetElement = e.target.closest('li');

    if (targetElement) {

      if (targetElement.dataset.menuType === menuIdentifiers.dropDownList) {
        dropDownListSubController();
      } else if (targetElement.dataset.menuType === menuIdentifiers.register) {
        registerSubController();
      }

    }
  });
}

/* ---------------------------------------- */
/* ------ DROPDOWN LIST SUBCONTROLLER ----- */


function dropDownListSubController() {
  navMenuView.toggleDropDownList();

  // Enable closing the dropdown menu by clicking outside of it
  DOMelements.body.addEventListener('click', () => {
    if (navMenuView.isDropDownListOpen()) {
      navMenuView.closeDropDownList();
    }
  });
}

/* -------------------------------------------- */
/* ------- REGISTER BUTTON SUB-CONTROLLER ----- */

function registerSubController() {
 headerView.removeIntroHeading();
}

