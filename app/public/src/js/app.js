// Enable live reloading of HTML and CSS while in development mode. 
// Implemented using .env global variables -> Setup with NPM (--env.NODE_ENV=dev) and compiled with webpack (webpack.DefinePlugin) 

if (process.env.NODE_ENV === 'dev') {
  require('../index.html');
  require('../../dist/css/main.css');
}

/* ---------------------------------------- */
/* ------------ IMPORT MODULES ------------ */

// Import 3rd party modules
import * as moment from 'moment';
import jwt from 'jsonwebtoken';

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
import Post from './models/model.post';

// Import /views modules
import * as headerView from './views/view.header';
import * as mainView from './views/view.main';
import * as footerView from './views/view.footer';

/* ---------------------------------------- */
/* ---------------------------------------- */
/* ---------------- APP START ------------- */
/* ---------------------------------------- */
/* ---------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
  documentLevelController(); // Register global event listeners
  navMenuController(); // Open/close clicked pages (views), drop-down menus and lists
  logoController(); 
  homeViewController('home', 'Main Feed');
}, false);

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
/* ---- HOMEPAGE & LOGO CONTROLLER ------- */
/* ---------------------------------------- */

function homeViewController(view, message) {
  postsController(); 
  renderPostsPage(view, message);
}

function logoController() {
  attachEventListener([DOMelements.headerLogo], 'click', [logoClickEvent]);
}

function logoClickEvent(e) {
  if (appState.session.currentView !== 'home') {
    clearCurrentPage();
    homeViewController('home', 'Main Feed');
  }
}

function renderPostsPage(view,  message) {
  if (view === 'home' && !appState.session.loggedIn) {
    headerView.renderIntroHeading();
  } else if (view === 'myRuns' && appState.session.loggedIn) {
    mainView.renderProfileBanner(appState.login.JWT.user);
  }
  mainView.renderTitle(message);
  retrievePostsFromAPI('desc');
  footerView.renderIconsCredit();
  appState.session.currentView = view;
}

async function retrievePostsFromAPI(sort) {
  // create new Post instance
  appState.posts.retrieved = new Post();

  // retrieve all posts from server
  try {
    await appState.posts.retrieved.retrieveAll();
  } catch (error) {
    displayFailMessage(apiData.infoMessages.unknown);    
  }

  if (appState.posts.retrieved.result) {
    if (appState.posts.retrieved.result.status === 200 && appState.posts.retrieved.result.data.length > 0 ) {
      if (appState.session.loggedIn) {
        executeFunctionAfterDOMContentLoaded(DOMelements.mainContent, mainView.adjustFirstPostVerticalOffset, apiData.infoMessages.unknown);
      } 
      displayPosts(sort);
    }
  } else if (appState.posts.retrieved.error) {
    return displayFailMessage(`${appState.posts.retrieved.error.message}`);
  } else {
    return displayFailMessage(apiData.infoMessages.unknown);
  }
}

function displayPosts(sort) {
  sortPosts(sort);
  // render ordered posts (initialy only first page with 10 posts)
  renderPosts(appState.session.postsPage);
}

function sortPosts(method) {

  const sortByDateDesc = function (lhs, rhs) {
    lhs = moment(lhs.date, 'YYYY-MM-DD');
    rhs = moment(rhs.date, 'YYYY-MM-DD');
    return lhs < rhs ? 1 : lhs > rhs ? -1 : 0;
  }

  const sortByDateAsc = function (lhs, rhs) {
    lhs = moment(lhs.date, 'YYYY-MM-DD');
    rhs = moment(rhs.date, 'YYYY-MM-DD');
    return lhs > rhs ? 1 : lhs < rhs ? -1 : 0;
  }

  if (method === 'desc') {
    appState.posts.retrieved.result.data.sort(sortByDateDesc);
  } else if (method === 'asc') {
    appState.posts.retrieved.result.data.sort(sortByDateAsc);
  }
  
}

function renderPosts(page) {
  const remainingPosts = appState.posts.retrieved.result.data.length - (page-1)*10;
  let loopLimit;

  if (remainingPosts <= 10) {
    loopLimit = remainingPosts;
  } else {
    loopLimit = 10;
  }

  for (let i=(page-1)*10; i<loopLimit+(page-1)*10; i++) {
    mainView.renderPosts(appState.posts.retrieved.result.data[i]);  
  }

  if (remainingPosts > 10) {
    mainView.renderPostLoaderBtn();
  }
}

function clearCurrentPage() {
  if (appState.session.currentView === 'home') {
    headerView.removeIntroHeading();
    // footerView.removeIconsCredit(); 
  } else if (appState.session.currentView === 'addNewRun') {
    mainView.removeNewRunFormBackground();
  }

  appState.session.postsPage = 1; // reset posts current page
  mainView.removeMainContent(); 

  // Detach event listeners
  if (appState.registeredClickEvents.registerForm) {
    detachEventListener([DOMelements.mainContent], 'submit', [registerSubmitEvent]);
    appState.registeredClickEvents.registerForm = false;
  } else if (appState.registeredClickEvents.addNewRunForm) {
    detachEventListener([DOMelements.mainContent], 'submit', [submitNewRunEvent]);
    appState.registeredClickEvents.addNewRunForm = false;
  } else if (appState.registeredClickEvents.posts) {
    detachEventListener([DOMelements.mainContent], 'click', [postClickEvent]);
    appState.registeredClickEvents.posts = false;
  }
}

/* ---------------------------------------- */
/* ------------ POSTS CONTROLLER ---------- */
/* ---------------------------------------- */

function postsController() {
  attachEventListener([DOMelements.mainContent], 'click', [postClickEvent]);
  appState.registeredClickEvents.posts = true;
}


function postClickEvent(e) {
  e.preventDefault();
  
  if (e.target.closest(`.${DOMstrings.posts.collapsibleContainer}`)) {
    mainView.toggleCollapsiblePost(e.target);
  } else if (e.target.closest(`.${DOMstrings.posts.loadMore}`)) {
    loadMorePostsSubController(e);
  }
}

/* ------------------------------------------- */
/* ------- LOAD MORE POSTS SUBCONTROLLER ----- */

function loadMorePostsSubController(e) {
  let currentLoaderElement = e.target.closest(`.${DOMstrings.posts.loadMore}`);
  
  mainView.hideLoaderElement(currentLoaderElement);

  appState.session.postsPage++;
  renderPosts(appState.session.postsPage);
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
  if (appState.session.currentView !== 'addNewRun') {
    clearCurrentPage();
    executeFunctionAfterDOMContentLoaded(DOMelements.mainContent, addNewRunController, apiData.infoMessages.login.fail.server.unknown);    
    mainView.renderNewRunForm();
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
    executeFunctionAfterDOMContentLoaded(DOMelements.mainContent, registerNewUserController, apiData.infoMessages.unknown);
    
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
      return displayFailMessage(apiData.infoMessages.registration.fail.validation.password);
    }

    // Create a new user instance
    appState.register.user = new User(newUser);

    // Delete all data from newUser
    deleteAllObjectProperties(newUser);

    // POST new user to server
    try {
      await appState.register.user.createNew();
    } catch (error) {
      displayFailMessage(apiData.infoMessages.unknown);
    }

    if (appState.register.user.result) {
      appState.register.user.result.status === 201 ? 
      formSubmitSuccessfullyExecuted('registration', apiData.infoMessages.registration.success.info1, apiData.infoMessages.registration.success.info2) 
      : displayFailMessage(apiData.infoMessages.unknown);
    } else if (appState.register.user.error) {
      return displayFailMessage(`${appState.register.user.error.message}!`);
    } else {
      return displayFailMessage(apiData.infoMessages.unknown);
    }

    // Delete all data from appState.register.user
    deleteAllObjectProperties(appState.register.user);
  }

  // TODO: ENABLE USER TO DELETE ACCOUNT
}

function formSubmitSuccessfullyExecuted(type, ...messages) {
  if (type === 'registration') {
    mainView.clearRegistrationFormData();
  } else if (type === 'addNewRun') {
    mainView.clearNewRunFormData();
  }

  clearCurrentPage();
  transitionRegistrationSuccessMessage(messages, true);
}

function transitionRegistrationSuccessMessage(messages, animate = false) {
  renderMainViewMessages(messages, animate);

  setTimeout(()=> {
    clearCurrentPage();
    homeViewController('home', 'Main Feed');
  }, 1000);
}

function displayFailMessage(...messages) {
  if (!mainView.warningMessageExists()) {
    renderMainViewMessages(messages, false, 'afterbegin');
    mainView.styleWarningMessage();
  }
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

  // Remove existing warning messages
  if (headerView.warningMessageExists()) {
    headerView.removeLoginFailMessage();
  }

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
      failedLogin(apiData.infoMessages.login.fail.server.unknown);
    }


    if (appState.login.user.result) {
      appState.login.user.result.status === 200 
      && appState.login.user.result.data.authToken ? 
      successfullLogin() 
      : failedLogin(apiData.infoMessages.unknown);
    } else if (appState.login.user.error) {
      if (appState.login.user.error.toLowerCase() === 'unauthorized') {
        return failedLogin(`${apiData.infoMessages.login.fail.server.noUser}`);
      } else {
        return failedLogin(`${appState.login.user.error}`);
      }
    } else {
      return failedLogin(apiData.infoMessages.unknown);
    }
  }
}

function successfullLogin() {
  closeLoginMenu();
  enterLoggedInSessionMode();
}

function failedLogin(message) {
  if (!headerView.warningMessageExists()) {
    headerView.renderLoginFailMessage(message);
  }
}

function closeLoginMenu() {
  headerView.closeLoginMenu();
  headerView.clearLoginFormData();
  if (headerView.warningMessageExists()) {
    headerView.removeLoginFailMessage();
  }
  detachEventListener([DOMelements.loginForm], 'submit', [loginSubmitEvent]);
  appState.registeredClickEvents.logInMenu = false;
}

function enterLoggedInSessionMode() {
  appState.session.loggedIn = true;
  extractUserDataFromJWT();
  hideLoggedOutMenuItems();
  updateDropDownListElements();
  showLoggedInMenuItems();
  clearCurrentPage();
  homeViewController('home', 'Main Feed');
}

function extractUserDataFromJWT() {
  appState.login.JWT = jwt.decode(appState.login.user.result.data.authToken);
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

function updateDropDownListElements() {
  headerView.updateDropDownListUsername(appState.login.JWT.user.name);
  headerView.updateDropDownListAvatar(appState.login.JWT.user.avatar);
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
  if (appState.session.currentView !== 'myProfile') {
    clearCurrentPage();
    renderMyProfilePage();
    appState.session.currentView = 'myProfile';
  }
  closeDropDownList();
}

function renderMyProfilePage() {
  executeFunctionAfterDOMContentLoaded(DOMelements.mainContent,myProfileDOMLoadedSetupFunctions);

  mainView.renderProfileBanner(appState.login.JWT.user);
  mainView.renderMyProfileSaveDeleteButtons();
}

function myProfileDOMLoadedSetupFunctions() {
  mainView.enableProfileBannerInputFields();
  mainView.showChangeAvatarButton();
  changeAvatarSubController();
  saveProfileChangesController();
  deleteAccountController();
}

function myRunsViewSubController() {
  if (appState.session.currentView !== 'myRuns') {
    clearCurrentPage();
    homeViewController('myRuns', 'My Runs'); // TODO: Render only logged users posts
  }
  closeDropDownList();
}

function analyticsViewSubController() {
  if (appState.session.currentView !== 'analytics') {
    appState.session.currentView = 'analytics';
  }
}

function logoutSubController() {
  appState.session.loggedIn = false;
  deleteAllObjectProperties(appState.login);
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
  homeViewController('home', 'Main Feed');
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

/* ---------------------------------------- */
/* ------ CHANGE AVATAR SUBCONTROLLER ----- */

function changeAvatarSubController() {
  // some code
}

/* ---------------------------------------- */
/* ---- SAVE PROFILE CHANGES CONTROLLER --- */
/* ---------------------------------------- */

function saveProfileChangesController() {
  // some code
}

/* ---------------------------------------- */
/* ------ DELETE ACCOUNT CONTROLLER ------- */
/* ---------------------------------------- */

function deleteAccountController() {
  // some code
}

/* ---------------------------------------- */
/* -------- ADD NEW RUN CONTROLLER -------- */
/* ---------------------------------------- */

function addNewRunController() {
  attachEventListener([DOMelements.mainContent], 'submit', [submitNewRunEvent]);
  appState.registeredClickEvents.addNewRunForm = true;
}

async function submitNewRunEvent(e) {
  e.stopPropagation();
  e.preventDefault();

  // Remove existing warning messages
  if (mainView.warningMessageExists()) {
    mainView.removeMessage();
  }

  // 2) read values from input fields
  const newPost = mainView.getNewRunFormData();

  if (newPost) {

    // 2.1) validate input data
    const durationValidator = validateTotalDurationTime(newPost.duration);
    if (durationValidator) {
      return displayFailMessage(durationValidator);
    }
    
    const dateValidator = validateDateFormat(newPost.date);
    if (dateValidator) {
      return displayFailMessage(dateValidator);
    }

    const timeValidator = validateTimeFormat(newPost.time);
    if (timeValidator) {
      return displayFailMessage(timeValidator);
    }

    const dateDiffValidator = compareToCurrentDate(newPost.date);
    if (dateDiffValidator) {
      return displayFailMessage(dateDiffValidator);
    }

    const timeDiffValidator = compareToCurrentTime(newPost.date, newPost.time);
    if (timeDiffValidator) {
      return displayFailMessage(timeDiffValidator);
    }

    const descriptionValidator = validateDescription(newPost.description);
    if (descriptionValidator) {
      return displayFailMessage(descriptionValidator);
    }
  
    // 3) create a new instance of Post object
    appState.posts.created = new Post(newPost);

    // 3.1) Delete newPost object
    deleteAllObjectProperties(newPost);

    // 4) create new post using provided JWT token
    try {
      await appState.posts.created.createNew();
    } catch (error) {
      displayFailMessage(apiData.infoMessages.unknown);
    }
  
    // 5) read and store the returned data
    if (appState.posts.created.result) {
      appState.posts.created.result.status === 201 
      && appState.posts.created.result.data ? 
      formSubmitSuccessfullyExecuted('addNewRun', apiData.infoMessages.addNewRun.success.info1, apiData.infoMessages.addNewRun.success.info2) : displayFailMessage(apiData.infoMessages.unknown);
    } else if (appState.posts.created.error) {
      return displayFailMessage(`${appState.posts.created.error.message}`);
    } else {
      return displayFailMessage(apiData.infoMessages.unknown);
    }

    deleteAllObjectProperties(appState.posts.created);
  }
}

function validateTotalDurationTime(duration) {
  return (duration.hours + duration.minutes + duration.seconds) === 0 ? apiData.infoMessages.addNewRun.fail.validation.duration : false;
}

function validateDateFormat(date) {
  return !moment(date, 'YYYY-MM-DD').isValid() ? apiData.infoMessages.addNewRun.fail.validation.date : false;
}

function validateTimeFormat(time) {
  return !moment(time, 'HH:mm', true).isValid() ? apiData.infoMessages.addNewRun.fail.validation.time : false;
}

function compareToCurrentDate(date) {
  const selectedDate = moment(date, 'YYYY-MM-DD');
  const currentDateTime = moment();

  if (selectedDate.diff(currentDateTime, 'years')>0 || 
      selectedDate.diff(currentDateTime, 'months')>0 || 
      Math.ceil(selectedDate.diff(currentDateTime, 'days', true))>0
      ) {
    return apiData.infoMessages.addNewRun.fail.validation.dateDiff;
  } else {
    return false;
  }

}

function compareToCurrentTime(date, time) {
  const selectedDate = moment(date, 'YYYY-MM-DD');
  const selectedTime = moment(time, 'HH:mm');
  const currentDateTime = moment();

  if (selectedDate.diff(currentDateTime, 'years')===0 && 
      selectedDate.diff(currentDateTime, 'months')===0 && 
      Math.ceil(selectedDate.diff(currentDateTime, 'days', true)) === 0
      ) {
        if (selectedTime.diff(currentDateTime, 'hours')>0 || 
            selectedTime.diff(currentDateTime, 'minutes')>0) {
          return apiData.infoMessages.addNewRun.fail.validation.timeDiff;
        } else {
          return false;
        }
      }

}

function validateDescription(description) {
  return description.length < 10 ? apiData.infoMessages.addNewRun.fail.validation.description : false;
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

function executeFunctionAfterDOMContentLoaded(element, func, msg='Something went wrong!') {
  attachMutationObserver(element)
      .then(result => {
        appState.mutationObserver.result = result;
        func();
      })
      .then(()=> {
        appState.mutationObserver.result.observer.disconnect();
        deleteAllObjectProperties(appState.mutationObserver);
      })
      .catch(error => {
        clearCurrentPage();
        displayFailMessage(msg);
      });
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