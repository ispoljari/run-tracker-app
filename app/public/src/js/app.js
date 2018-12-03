// Enable live reloading of HTML and CSS while in development mode. 
// Implemented using .env global variables -> Setup with NPM (--env.NODE_ENV=dev) and compiled with webpack (webpack.DefinePlugin) 

if (process.env.NODE_ENV === 'dev') {
  require('../index.html');
  require('../../dist/css/main.css');
}

/* ---------------------------------------- */
/* ------------ IMPORT MODULES ------------ */

// Import DOM elements and dynamic hooks
import {
  DOMelements, 
  DOMstrings, 
  menuIdentifiers,
  apiData
} from './views/view.dom-base';

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
/* ---------- APP SUPERCONTROLLER --------- */
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
  attachEventListener([DOMelements.body], 'click', [bodyClickEvent]);
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
}

function renderHomePage() {
  headerView.renderIntroHeading();
  mainView.renderPostsTitle();
  mainView.renderPosts();
  footerView.renderIconsCredit();
  appState.session.currentView = 'home';
}

function clearCurrentPage() {
  if (appState.session.currentView === 'home') {
    headerView.removeIntroHeading();
    footerView.removeIconsCredit(); 
  }

  mainView.removeMainContent(); 

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
    detachEventListener([DOMelements.navMenuItems.logedIn.dropDownList.myProfile,
      DOMelements.navMenuItems.logedIn.dropDownList.myRuns,
      DOMelements.navMenuItems.logedIn.dropDownList.analytics,
      DOMelements.navMenuItems.logedIn.dropDownList.logout],
      'click',
      [myProfileViewSubController,
      myRunsViewSubController,
      analyticsViewSubController,
      logoutSubController]
      );
  }
  // toggle event state
  appState.registeredClickEvents.dropDownList = !appState.registeredClickEvents.dropDownList;
}

/* -------------------------------------------- */
/* ---- REGISTER VIEW (PAGE) SUB-CONTROLLER --- */

function registerViewSubController() {
  if (appState.session.currentView !== 'register') {
    clearCurrentPage();
    attachMutationObserver(DOMelements.mainContent)
      .then(result => {
        appState.mutationObserver.result = result;
        registerNewUserController(); 
      })
      .then(()=> {
        appState.mutationObserver.result.observer.disconnect();
        deleteAllObjectProperties(appState.mutationObserver);
      })
      .catch(error => {
        clearCurrentPage();
        failedRegistration(apiData.infoMessages.registration.fail.server);
      });
    
    mainView.renderRegistrationForm();
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

  // Remove existing warning messages
  if (mainView.warningMessageExists()) {
    mainView.removeMessage();
  }

  const newUser = mainView.getRegistrationFormData();

  newUser.name = `${newUser.firstName} ${newUser.lastName}`;
  newUser.displayName = newUser.firstName;
  newUser.avatar = Math.floor(Math.random()*30) + 1; // Assign a random avatar index during registration

  if (newUser) {
    
    // Check if password and repeat password are the same
    if (newUser.password !== newUser.repeatPassword) {
      return failedRegistration(apiData.infoMessages.registration.fail.validation.password);
    }

    // Create a new user instance
    appState.register.user = new User(newUser);

    // Delete all data from newUser
    deleteAllObjectProperties(newUser);

    // POST new user to server
    try {
      await appState.register.user.createNew();
    } catch (error) {
      failedRegistration(apiData.infoMessages.registration.fail.server);
    }

    if (appState.register.user.result) {
      appState.register.user.result.status === 201 ? 
      successfulRegistration(apiData.infoMessages.registration.success.info1, apiData.infoMessages.registration.success.info2) 
      : failedRegistration(apiData.infoMessages.registration.fail.server);
    } else if (appState.register.user.error) {
      return failedRegistration(`${appState.register.user.error.message}!`);
    } else {
      return failedRegistration(apiData.infoMessages.registration.fail.server);
    }

    // Delete all data from appState.register.user
    deleteAllObjectProperties(appState.register.user);
  }

  // TODO: ENABLE USER TO DELETE ACCOUNT
  // TODO: ENABLE USER TO CHANGE PASSWORD IF FORGOTEN
}

function successfulRegistration(...messages) {
  mainView.clearRegistrationFormData();
  clearCurrentPage();
  transitionSuccessMessageForUser(messages, true);
}

function failedRegistration(...messages) {
  console.clear(); 
  if (!mainView.warningMessageExists()) {
    renderRegistrationFailMessageForUser(messages, false, 'afterbegin');
  }
}

function transitionSuccessMessageForUser(messages, animate = false) {
  renderMainViewMessages(messages, animate);

  setTimeout(()=> {
    clearCurrentPage();
    renderHomePage();
  }, 1200);
}

function renderRegistrationFailMessageForUser(messages, animate = false, position) {
  renderMainViewMessages(messages, animate, position);
  mainView.styleWarningMessage();
}

function renderMainViewMessages(messages, animate, position='') {
  if (messages.length > 0) {
    messages.forEach(message => {
      if (position) {
        mainView.renderMessage(message, position);
      } else {
        mainView.renderMessage(message);
      }
    });
  }

  if (animate) {
    mainView.renderDotsAnimation();
  }

}

/* ---------------------------------------- */
/* --------- LOGIN USER CONTROLLER -------- */
/* ---------------------------------------- */

function logInUserController() {
  attachEventListener([DOMelements.loginForm], 'submit', [loginSubmitEvent]);
} 

async function loginSubmitEvent(e) {
  e.stopPropagation();
  e.preventDefault();

  const existingUser = headerView.getLoginFormData();

  if (existingUser) {

    // Create a new user instance
    appState.login.user = new User(existingUser);

    // Delete all data from newUser
    deleteAllObjectProperties(existingUser);

    // POST new user to server
    try {
      await appState.login.user.login();
    } catch (error) {
      // failedLogin(apiData.infoMessages.login.fail.server); //TODO:
      console.log(error);
    }

    console.log(appState.login.user);

    // if (appState.login.user.result) {
    //   appState.login.user.result.status === 200 
    //   && appState.login.user.result.data.authToken ? 
    //   successfullLogin() 
    //   : failedLogin(apiData.infoMessages.registration.fail.server);
    // } else if (appState.login.user.error) {
    //   // return failedLogin(`${appState.register.user.error.message}!`);
    // } else {
    //   // return failedLogin(apiData.infoMessages.registration.fail.server);
    // }
  }
}

function successfullLogin() {
  headerView.clearLoginFormData();
  closeLoginMenu();
  enterLoggedInSessionMode();
}

function failedLogin(...messages) {
  console.clear(); 
  if (!mainView.warningMessageExists()) {
    renderRegistrationFailMessageForUser(messages, false, 'afterbegin');
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
    mainView.renderPosts();  // TODO: Render only logged users posts
    footerView.renderIconsCredit();
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
  detachEventListener([DOMelements.navMenuItems.logedIn.dropDownList.myProfile,
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

function deleteAllObjectProperties(obj) {
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      delete obj[key];
    }
  }
}

function attachMutationObserver(observedElement) {
  const config = {childList: true}
  
  return new Promise((resolve, reject) => {
    const observer = new MutationObserver(callback);
    function callback(mutationRecord) {
      mutationRecord.forEach(record => {
        if (record.addedNodes.length > 0) {
          resolve({
            observer,
            mutationRecord
          });
        }
      });
      reject();
    }

    observer.observe(observedElement, config);
  });
}