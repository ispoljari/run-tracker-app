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
  documentLevelController();
  logoController();
  navMenuController();
}

/* ---------------------------------------- */
/* ------ DOCUMENT-LEVEL CONTROLLER ------- */
/* ---------------------------------------- */

function documentLevelController() {
  DOMelements.body.addEventListener('click', e => {
    // Enable closing the dropdown menu by clicking outside of it
    if (headerView.isDropDownListOpen() && !e.target.closest('div').classList.contains('dropdown-list')) {
      headerView.closeDropDownList();
    }
    // Enable closing the login menu by clicking outside of it
    if(headerView.isLoginMenuOpen() && !e.target.closest('div').classList.contains('login-menu')) {
      headerView.closeLoginMenu();
    }
  });
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
  headerView.removeIntroHeading();
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
        registerSubController();
      } else if (targetElement.dataset.menuType === menuIdentifiers.login) {
        loginSubController();
      }
      
      if (targetElement.dataset.menuType !== menuIdentifiers.dropDownList && targetElement.dataset.menuType !== menuIdentifiers.login) {
        appState.session.currentView = targetElement.dataset.menuType;
      }
    }
  });
}

/* ---------------------------------------- */
/* ------ DROPDOWN LIST SUBCONTROLLER ----- */


function dropDownListSubController() {
  headerView.toggleDropDownList();
}

/* -------------------------------------------- */
/* ------- REGISTER BUTTON SUB-CONTROLLER ----- */

function registerSubController() {
  if (appState.session.currentView !== 'register') {
    clearCurrentPage();
    mainView.renderRegistrationForm();
  }
}

/* -------------------------------------------- */
/* ------- LOGIN BUTTON SUB-CONTROLLER ----- */

function loginSubController() {
  headerView.toggleLoginMenu();
}