// Enable live reloading of HTML and CSS while in development mode. 
// Implemented using .env global variables -> Setup with NPM (--env.NODE_ENV=dev) and compiled with webpack (webpack.DefinePlugin) 

if (process.env.NODE_ENV === 'dev') {
  require('../index.html');
  require('../../dist/css/main.css');
}

/* ---------------------------------------- */
/* ------------ IMPORT MODULES ------------ */

// Import faker
import faker from 'faker';

// Import DOM classes and dynamic hooks
import {
  DOMelements, 
  DOMstrings, 
  menuIdentifiers
} from './views/view.static-dom-base';

// Import app state
import {appState} from './state/state.app';

// Import /models modules
import User from './models/model.user';

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
  initializeAppControllers();
}, false);


function initializeAppControllers() {
  documentLevelController(); // Register global event listeners
  logoController(); // Open home page
  navMenuController(); // Open/close clicked pages (views), drop-down menus and lists
}

/* ---------------------------------------- */
/* ------ DOCUMENT-LEVEL CONTROLLER ------- */
/* ---------------------------------------- */

function documentLevelController() {
  attachEventListener([DOMelements.body], 'click', [bodyClickEvent])
}

function bodyClickEvent(e) {
  // Enable closing the dropdown menu by clicking outside of it
  if (headerView.isDropDownListOpen() && !isTargetElementInsideOf(e, DOMstrings.menuDropDownList)) {
    closeDropDownList();
  }
  // Enable closing the login menu by clicking outside of it
  if (headerView.isLoginMenuOpen() && !isTargetElementInsideOf(e, DOMstrings.loginMenu)) {
    closeLoginMenu();
  }
}

function isTargetElementInsideOf(event, parent) {
  if (event.target !==  DOMelements.body) {
    return event.target.closest('div').classList.contains(parent);
  }
}

/* ---------------------------------------- */
/* ------------ LOGO CONTROLLER ----------- */
/* ---------------------------------------- */

function logoController() {
  attachEventListener([DOMelements.headerLogo], 'click', [logoClickEvent]);
}

function logoClickEvent(e) {
  if (appState.session.currentView !== 'home') {
    clearCurrentPage();
    renderHomePage();
  }
  appState.session.currentView = 'home';
}

function renderHomePage() {
  headerView.renderIntroHeading();
  mainView.renderPostsTitle();
  renderMainPosts();
}

function renderMainPosts() {
  mainView.renderPosts();
  footerView.renderIconsCredit();
}

function clearCurrentPage() {
  // Remove current content
  headerView.removeIntroHeading();
  mainView.removeMainContent(); 
  footerView.removeIconsCredit(); // TODO: IF CURR.VIEW = HOME

  // Detach event listeners
  if (appState.registeredClickEvents.registerForm) {
    detachEventListener([DOMelements.mainContent], 'submit', [registerSubmitEvent]);
    appState.registeredClickEvents.registerForm = false;
  }
}

/* ---------------------------------------- */
/* ------- NAVIGATION MENU CONTROLLER ----- */
/* ---------------------------------------- */

function navMenuController() {
  attachEventListener([DOMelements.navMenu], 'click', [navMenuClickEvent]);
}

function navMenuClickEvent(e) {
  e.stopPropagation(); // stop the event bubbling to the top of the DOM tree (body)

  const targetElement = e.target.closest('li');

  if (targetElement) {
    if (targetElement.dataset.menuType === menuIdentifiers.dropDownList) {
      dropDownListSubController();
    } else if (targetElement.dataset.menuType === menuIdentifiers.register) {
      registerViewSubController();
    } else if (targetElement.dataset.menuType === menuIdentifiers.login) {
      loginMenuSubController();
    } else if (targetElement.dataset.menuType === menuIdentifiers.addNewRun) {
      addNewRunViewSubController();
    } else if (targetElement.dataset.menuType === menuIdentifiers.myRuns) {
      myRunsViewSubController();
    } else if (targetElement.dataset.menuType === menuIdentifiers.analytics) {
      analyticsViewSubController();
    }
  }
}

function addNewRunViewSubController() {
  // some code
  console.log('Add new run hello!');

  if (appState.session.currentView !== 'addNewRun') {
    // some code
    appState.session.currentView = 'addNewRun';
  }
}

/* ---------------------------------------- */
/* -- AVATAR DROPDOWN LIST SUBCONTROLLER -- */

function dropDownListSubController() {
  headerView.toggleDropDownList();

  if (!appState.registeredClickEvents.dropDownList) {
    dropDownListController(); // Process existing user login and open new session
  } else {
    detachEventListener(    [DOMelements.navMenuItems.logedIn.dropDownList.myProfile,
      DOMelements.navMenuItems.logedIn.dropDownList.myRuns,
      DOMelements.navMenuItems.logedIn.dropDownList.analytics,
      DOMelements.navMenuItems.logedIn.dropDownList.logout],
      'click',
      [myProfileViewSubController,
      myRunsViewSubController,
      analyticsViewSubController,
      logoutSubController]);
  }
  // toggle event state
  appState.registeredClickEvents.dropDownList = !appState.registeredClickEvents.dropDownList;
}

/* -------------------------------------------- */
/* ---- REGISTER VIEW (PAGE) SUB-CONTROLLER --- */

function registerViewSubController() {
  if (appState.session.currentView !== 'register') {
    clearCurrentPage();

    mainView.renderRegistrationForm();
    registerNewUserController(); // Process existing user login and open new session
    appState.session.currentView = 'register';
  }
}

/* -------------------------------------------- */
/* ---------- LOGIN MENU SUB-CONTROLLER ------- */

function loginMenuSubController() {
  headerView.toggleLoginMenu();
  if (!appState.registeredClickEvents.logInMenu) {
    logInUserController(); // Process existing user login and open new session
  } else {
    detachEventListener([DOMelements.loginForm], 'submit', [loginSubmitEvent]);
  }
  // toggle event state
  appState.registeredClickEvents.logInMenu = !appState.registeredClickEvents.logInMenu;
}

/* ---------------------------------------- */
/* ----- REGISTER NEW USER CONTROLLER ----- */
/* ---------------------------------------- */

function registerNewUserController() {
  attachEventListener([DOMelements.mainContent], 'submit', [registerSubmitEvent]);
  appState.registeredClickEvents.registerForm = true;
}

async function registerSubmitEvent(e) {
  e.preventDefault();

  // Load data entered into the registration form
  const newUser = await mainView.getRegistrationFormData();

  newUser.name = `${newUser.firstName} ${newUser.lastName}`
  newUser.displayName = faker.name.firstName(); // Assign a random display name during registration
  newUser.avatar = Math.floor(Math.random()*30) + 1; // Assign a random avatar index during registration

  if (newUser) {
    // ADDITIONAL VALIDATION OF INPUT DATA
    // Check if password and repeat password are the same
    
    if (newUser.password !== newUser.repeatPassword) {
      return console.log('The passwords are not matching.'); // TODO: Display warning message to the user
    }

    // Create a new user instance
    appState.register.user = new User(newUser);

    // Delete all data from newUser
    deleteAllObjectProperties(newUser);

    // POST new user to server
    try {
      await appState.register.user.createNew();
    } catch(error) {
      console.log(`A register submit event error occured! Message: ${error}`);; //TODO:
    }

    if (appState.register.user.result) {
      console.log(`Registration was successful! The response object is ${appState.register.user.result}`);
    } else if (appState.register.user.error) {
      console.info(`STATUS ${appState.register.user.error.code}: ${appState.register.user.error.message}`);
    }

    // Delete all data from appState.register.user
    deleteAllObjectProperties(appState.register.user);
  }


  // TODO: CLEAR INPUT FIELDS
}

/* ---------------------------------------- */
/* --------- LOGIN USER CONTROLLER -------- */
/* ---------------------------------------- */

function logInUserController() {
  attachEventListener([DOMelements.loginForm], 'submit', [loginSubmitEvent]);
} 

function loginSubmitEvent(e) {
  e.stopPropagation();
  e.preventDefault();

  const username = headerView.getLoginUsername();
  const password = headerView.getLoginPassword();

  if (username === appState.session.logginCredentials.username && password === appState.session.logginCredentials.password) {
    appState.session.loggedIn = true;
    clearInputFields(headerView.clearLoginUsername, headerView.clearLoginPassword);
    closeLoginMenu();
    enterLoggedInSessionMode();
  } else {
    console.log('Your credentials are invalid.') // TODO: Display error message to the user
  }
}

function closeLoginMenu() {
  headerView.closeLoginMenu();
  detachEventListener([DOMelements.loginForm], 'submit', [loginSubmitEvent]);
  appState.registeredClickEvents.logInMenu = false;
}

function enterLoggedInSessionMode() {
  hideLoggedOutMenuItems();
  showLoggedInMenuItems();
  clearCurrentPage();
  renderHomePage();
}

function hideLoggedOutMenuItems() {
  headerView.hideLoginButton();
  headerView.hideRegisterButton();
}

function showLoggedInMenuItems() {
  headerView.showMyRunsButton();
  headerView.showAnalyticsButton();
  headerView.showAddNewRunButton();
  headerView.showAvatarDropDownListButton();
}

/* ---------------------------------------- */
/* --- AVATAR DROPDOWN LIST CONTROLLER ---- */
/* ---------------------------------------- */

function dropDownListController() {
  attachEventListener([DOMelements.navMenuItems.logedIn.dropDownList.myProfile,
  DOMelements.navMenuItems.logedIn.dropDownList.myRuns,
  DOMelements.navMenuItems.logedIn.dropDownList.analytics,
  DOMelements.navMenuItems.logedIn.dropDownList.logout],
  'click',
  [myProfileViewSubController,
   myRunsViewSubController,
   analyticsViewSubController,
   logoutSubController]);
}

function myProfileViewSubController() {
  // some code
  console.log('My Profile Hello!');

  if (appState.session.currentView !== 'myProfile') {
    // some code
    appState.session.currentView = 'myProfile';
  }
}

function myRunsViewSubController() {
  // some code
  console.log('My Runs Hello!');

  if (appState.session.currentView !== 'myRuns') {
    clearCurrentPage();
    mainView.renderProfileBanner();
    mainView.renderMyRunsTitle();
    renderMainPosts(); // TODO: Render only logged users posts
    appState.session.currentView = 'myRuns';
  }
  closeDropDownList();
}

function analyticsViewSubController() {
  // some code
  console.log('Analytics Hello!');

  if (appState.session.currentView !== 'analytics') {
    // some code
    appState.session.currentView = 'analytics';
  }
}

function logoutSubController() {
  appState.session.loggedIn = false;
  closeDropDownList();
  exitLoggedInSessionMode();
}

function closeDropDownList() {
  headerView.closeDropDownList();
  detachEventListener(    [DOMelements.navMenuItems.logedIn.dropDownList.myProfile,
  DOMelements.navMenuItems.logedIn.dropDownList.myRuns,
  DOMelements.navMenuItems.logedIn.dropDownList.analytics,
  DOMelements.navMenuItems.logedIn.dropDownList.logout],
  'click',
  [myProfileViewSubController,
  myRunsViewSubController,
  analyticsViewSubController,
  logoutSubController]);
  appState.registeredClickEvents.dropDownList = false;
}

function exitLoggedInSessionMode() {
  showLoggedOutMenuItems();
  hideLoggedInMenuItems();
  clearCurrentPage();
  renderHomePage();
}

function showLoggedOutMenuItems() {
  headerView.showLoginButton();
  headerView.showRegisterButton();
}

function hideLoggedInMenuItems() {
  headerView.hideMyRunsButton();
  headerView.hideAnalyticsButton();
  headerView.hideAddNewRunButton();
  headerView.hideAvatarDropDownListButton();
}

/* --------- GLOBAL HELP FUNCTIONS ------- */

function detachEventListener(elements, eventType, fns) {
  if (elements.length === fns.length) {
    let i = 0;
    elements.forEach(element => {
      element.removeEventListener(eventType, fns[i]);
      i++;
    });
  }
}

function attachEventListener(elements, eventType, fns) {
  if (elements.length === fns.length) {
    let i = 0;
    elements.forEach(element => {
      element.addEventListener(eventType, fns[i]);
      i++;
    });
  }
}

function clearInputFields(...fnArr) {
  fnArr.forEach(fn => {
    fn();
  })
}

function deleteAllObjectProperties(obj) {
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      delete obj[key];
    }
  }
}