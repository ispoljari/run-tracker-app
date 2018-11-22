// Enable live reloading of HTML and CSS while in development mode. 
// Implemented using .env global variables -> Setup with NPM (--env.NODE_ENV=dev) and compiled with webpack (webpack.DefinePlugin) 

if (process.env.NODE_ENV === 'dev') {
  require('../index.html');
  require('../../dist/css/main.css');
}

/* ---------------------------------------- */
/* ------------ IMPORT MODULES ------------ */

// Import DOM classes and dynamic hooks
import {
  DOMelements, 
  controledHooksStrings, 
  menuIdentifiers
} from './views/view.base';

// Import app state
import {appState} from './state/state.app';

// Import /views modules
import * as navMenuView from './views/view.nav-menu';
import * as headerView from './views/view.header';
import * as mainView from './views/view.main';
import * as footerView from './views/view.footer';

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
    if (appState.session.currentView !== 'home') {
      clearCurrentPage();
      renderHomePage();
    }
    appState.session.currentView = 'home';
  });
}

function renderHomePage() {
  if (appState.session.loggedIn === false) {
    headerView.renderIntroHeading();
  }

  mainView.renderPosts();
  footerView.renderIconsCredit();
}

function clearCurrentPage() {
  if (appState.session.currentView === 'home' && appState.session.loggedIn === false) {
    headerView.removeIntroHeading();
  }

  mainView.removeMainContent();
  footerView.removeIconsCredit();
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
        clearCurrentPage();
        registerSubController();
      }
      
      if (targetElement.dataset.menuType !== menuIdentifiers.dropDownList) {
        appState.session.currentView = targetElement.dataset.menuType;
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
  // some code
}

