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
  DOMstrings, 
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
  documentLevelController(); // Register global event listeners
  logoController(); // Open home page
  navMenuController(); // Open/close clicked pages (views), drop-down menus and lists
}

/* ---------------------------------------- */
/* ------ DOCUMENT-LEVEL CONTROLLER ------- */
/* ---------------------------------------- */

function documentLevelController() {
  DOMelements.body.addEventListener('click', e => {
    // Enable closing the dropdown menu by clicking outside of it
    if (headerView.isDropDownListOpen() && !isTargetElementInsideOf(e, DOMstrings.menuDropDownList)) {
      headerView.closeDropDownList();
    }
    // Enable closing the login menu by clicking outside of it
    if(headerView.isLoginMenuOpen() && !isTargetElementInsideOf(e, DOMstrings.loginMenu)) {
      headerView.closeLoginMenu();

      detachEventListener(DOMelements.loginForm, 'submit', loginSubmitEvent);
      appState.registeredClickEvents.logInMenu = false;
    }
  });
}

function isTargetElementInsideOf(event, parent) {
  return event.target.closest('div').classList.contains(parent);
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
        registerViewSubController();
      } else if (targetElement.dataset.menuType === menuIdentifiers.login) {
        loginMenuSubController();
      }
      
      if (targetElement.dataset.menuType !== menuIdentifiers.dropDownList && targetElement.dataset.menuType !== menuIdentifiers.login) {
        appState.session.currentView = targetElement.dataset.menuType;
      }
    }
  });
}

/* ---------------------------------------- */
/* --- AVATAR DROPDOWN LIST SUBCONTROLLER -- */


function dropDownListSubController() {
  headerView.toggleDropDownList();
}

/* -------------------------------------------- */
/* ---- REGISTER VIEW (PAGE) SUB-CONTROLLER --- */

function registerViewSubController() {
  if (appState.session.currentView !== 'register') {
    clearCurrentPage();
    mainView.renderRegistrationForm();
  }
}

/* -------------------------------------------- */
/* ---------- LOGIN MENU SUB-CONTROLLER ------- */

function loginMenuSubController() {
  headerView.toggleLoginMenu();
  if (!appState.registeredClickEvents.logInMenu) {
    logInUserController(); // Process existing user login and open new session
  } else {
    detachEventListener(DOMelements.loginForm, 'submit', loginSubmitEvent);
  }
  // toggle event state
  appState.registeredClickEvents.logInMenu = !appState.registeredClickEvents.logInMenu;
}

/* ---------------------------------------- */
/* --------- LOGIN USER CONTROLLER -------- */
/* ---------------------------------------- */

function logInUserController() {
  attachEventListener(DOMelements.loginForm, 'submit', loginSubmitEvent);
} 

function loginSubmitEvent(e) {
  e.stopPropagation();
  e.preventDefault();
  console.log('Hello!');
}

/* --------- GLOBAL HELP FUNCTIONS ------- */

function detachEventListener(element, eventType, fn) {
  element.removeEventListener(eventType, fn);
}

function attachEventListener(element, eventType, fn) {
  element.addEventListener(eventType, fn);
}