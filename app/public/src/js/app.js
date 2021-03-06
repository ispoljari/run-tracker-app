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
import tingle from 'tingle.js';

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

function homeViewController(view, message, anotherUser='') {
  postsController();
  renderPostsPage(view, message, anotherUser);
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

async function renderPostsPage(view,  message, anotherUser) {
  if (view === 'home' && !appState.session.loggedIn) {
    headerView.renderIntroHeading();
  } else if ((view === 'myRuns' || view === 'home' || anotherUser) && appState.session.loggedIn) {
    if (!anotherUser) {
      mainView.renderProfileBanner(appState.login.JWT.user);
    } else {
      mainView.renderProfileBanner(anotherUser, true);
    }
  }

  mainView.renderTitle(message);
  await retrieveAllPostsFromAPI('desc');

  if (appState.posts.retrieved.result.data.length > 0) {
    if (view === 'myRuns') {
        appState.posts.retrieved.result.data = filterPostsByID(appState.posts.retrieved.result.data, appState.login.JWT.user.id);
      } else if (anotherUser) {
        appState.posts.retrieved.result.data = filterPostsByID(appState.posts.retrieved.result.data, anotherUser.id);
      }
  }

  renderPosts(appState.session.postsPage);
  footerView.renderIconsCredit();
  appState.session.currentView = view;
}

async function retrieveAllPostsFromAPI(sort) {
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
      return sortPosts(sort);
    }
  } else if (appState.posts.retrieved.error) {
    return displayFailMessage(`${appState.posts.retrieved.error.message}`);
  } else {
    return displayFailMessage(apiData.infoMessages.unknown);
  }
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
  let loopLimit;
  let remainingPosts;

  if (appState.posts.retrieved.result) {
    remainingPosts = appState.posts.retrieved.result.data.length - (page-1)*10;
  }

  if (remainingPosts) {
    if (remainingPosts <= 10) {
      loopLimit = remainingPosts;
    } else {
      loopLimit = 10;
    }
  
    for (let i=(page-1)*10; i<loopLimit+(page-1)*10; i++) {
      let editable = false;

      if (appState.session.loggedIn) {
        if (appState.posts.retrieved.result.data[i].user.id === appState.login.JWT.user.id) {
          editable = true;
        }
      }

      mainView.renderPosts(appState.posts.retrieved.result.data[i], editable); 
    }
  
    if (remainingPosts > 10) {
      mainView.renderPostLoaderBtn();
    }
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
    detachEventListener([DOMelements.mainContent], 'submit', [submitAddOrEditRunEvent]);
    appState.registeredClickEvents.addNewRunForm = false;
  } else if (appState.registeredClickEvents.posts) {
    detachEventListener([DOMelements.mainContent], 'click', [postClickEvent]);
    appState.registeredClickEvents.posts = false;
  } else if (appState.registeredClickEvents.myProfileClick) {
    detachEventListener([DOMelements.mainContent], 'click', [myProfileClickEvent]);
    appState.registeredClickEvents.myProfileClick = false;
  } else if (appState.registeredClickEvents.myProfileSubmit) {
    detachEventListener([DOMelements.mainContent], 'submit', [myProfileSubmitEvent]);
    appState.registeredClickEvents.myProfileSubmit = false;
  } else if (appState.registeredClickEvents.addNewRunClick ) {
    detachEventListener([DOMelements.mainContent], 'click', [clickDeleteRunEvent]);
    appState.registeredClickEvents.addNewRunClick = false;
  }
}

/* ---------------------------------------- */
/* ------------ POSTS CONTROLLER ---------- */
/* ---------------------------------------- */

function postsController() {
  attachEventListener([DOMelements.mainContent], 'click', [postClickEvent]);
  appState.registeredClickEvents.posts = true;
}


async function postClickEvent(e) {
  e.preventDefault();
  
  if (e.target.closest(`.${DOMstrings.posts.collapsibleContainer}`)) {
    mainView.toggleCollapsiblePost(e.target);
  } else if (e.target.closest(`.${DOMstrings.posts.loadMore}`)) {
    loadMorePostsSubController(e);
  } else if (e.target.closest(`.${DOMstrings.posts.username}`) || e.target.closest(`.${DOMstrings.posts.avatar}`)) {
    if (appState.session.loggedIn) {
      if (e.target.closest(`.${DOMstrings.posts.mainContainer}`).dataset.userId === appState.login.JWT.user.id) {
        myRunsViewSubController();
      } else {
        const userData = harvestUserData(e);
        openSelectedUserPage(userData);
      }
    }
  } else if (e.target.closest(`.${DOMstrings.posts.editable}`)) {
    if (appState.session.loggedIn) {
      if (e.target.closest(`.${DOMstrings.posts.mainContainer}`).dataset.userId === appState.login.JWT.user.id) {
        const postData = await retrievePostData(e);
        if (postData) {
          editSelectedPostController(postData);
        }
      }
    }
  }
}

/* ------------------------------------------- */
/* ------- EDIT SELECTED POST CONTROLLER ----- */

async function retrievePostData(e) {
  const postID = e.target.closest(`.${DOMstrings.posts.mainContainer}`).dataset.postId;

  const retrievedPost = new Post({id: postID});

  try {
    await retrievedPost.retrieveSingleByID();
  } catch (error) {
    displayFailMessage(apiData.infoMessages.unknown);;
  }

  if (retrievedPost.result) {
    if (retrievedPost.result.status === 200) {
       return retrievedPost.result.data;
    } else {
      return displayFailMessage(apiData.infoMessages.unknown);
    }
  } else if (retrievedPost.error) {
    return displayFailMessage(`${retrievedPost.error.message}!`);
  } else {
    return displayFailMessage(apiData.infoMessages.unknown);
  }
}

function editSelectedPostController(post) {
  if (appState.session.currentView !== post.id) {
    clearCurrentPage();
    executeFunctionAfterDOMContentLoaded(DOMelements.mainContent, submitEditedPostForm, apiData.infoMessages.login.fail.server.unknown);    
    mainView.renderNewRunForm('Edit Run', post);
    appState.session.currentView = post.id;
  }
}

function submitEditedPostForm() {
  attachEventListener([DOMelements.mainContent], 'click', [clickDeleteRunEvent]);
  attachEventListener([DOMelements.mainContent], 'submit', [submitAddOrEditRunEvent]); 
  
  appState.registeredClickEvents.addNewRunForm = true;
  appState.registeredClickEvents.addNewRunClick = true;
}

function clickDeleteRunEvent(e) {
  if (e.target.closest(`.${DOMstrings.addNewRunForm.buttons.deleteContainer}`)) {
    const modal = new tingle.modal({
      footer: true,
      stickyFooter: false,
      closeMethods: []
    });
  
    modal.setContent('<h1>Are you sure you whish to delete this post?</h1>');
  
    modal.addFooterBtn('NO', 'tingle-btn tingle-btn--primary', function() {
      modal.close();
    });
  
    modal.addFooterBtn('YES. DELETE POST', 'tingle-btn tingle-btn--danger', async function() {
      deletePostFromDB();
      modal.close();
    });
    
    modal.open();
  }
}

async function deletePostFromDB() {
  const post = new Post({id: appState.session.currentView});

    try {
      await post.deleteByID();
    } catch (error) {
      displayFailMessage(apiData.infoMessages.unknown);;
    }

    if (post.result) {
      if (post.result.status === 204) {
        formSubmitSuccessfullyExecuted('addNewRun', apiData.infoMessages.addNewRun.success.info4, apiData.infoMessages.addNewRun.success.info2)
      } else {
        return displayFailMessage(apiData.infoMessages.unknown);
      }
    } else if (post.error) {
      return displayFailMessage(`${post.error.message}!`);
    } else {
      return displayFailMessage(apiData.infoMessages.unknown);
    }
}

/* ------------------------------------------- */
/* ----------- OPEN ANOTHER USERS PAGE ------- */

function harvestUserData(e) {
  return {
    id: e.target.closest(`.${DOMstrings.posts.mainContainer}`).dataset.userId,
    displayName: e.target.closest(`.${DOMstrings.posts.mainContainer}`).querySelector(`.${DOMstrings.posts.username}`).dataset.userDisname,
    avatar: e.target.closest(`.${DOMstrings.posts.mainContainer}`).querySelector(`.${DOMstrings.posts.avatar}`).dataset.userAvatar,
    name: 'placeholder'
  }
}

function openSelectedUserPage(user) {
  if (appState.session.currentView !== user.id) {
    clearCurrentPage();
    homeViewController(user.id, `@${user.displayName}'s runs`, user);
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
    mainView.renderNewRunForm('Add New Run');
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
  registerMyProfileEventListeners();
}

function myRunsViewSubController() {
  if (appState.session.currentView !== 'myRuns') {
    clearCurrentPage();
    homeViewController('myRuns', 'My Runs');
  }
  closeDropDownList();
}

function analyticsViewSubController() {
  // TO BE DEVELOPED
}

function logoutSubController(type='') {
  appState.session.loggedIn = false;
  deleteAllObjectProperties(appState.login);
  closeDropDownList();
  exitLoggedInSessionMode(type);
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

function exitLoggedInSessionMode(type) {
  showLoggedOutMenuItems();
  hideLoggedInMenuItems();
  
  if (type !== 'deleteAccount') {
    clearCurrentPage();
    homeViewController('home', 'Main Feed');
  }

  if (type === 'deleteAccount') {
    formSubmitSuccessfullyExecuted('',apiData.infoMessages.deleteAccount.success.info1, apiData.infoMessages.deleteAccount.success.info2);
  }
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

/* ------ REGISTER MY PROFILE EVENT LISTENERS ----- */

function registerMyProfileEventListeners() {
  attachEventListener([DOMelements.mainContent], 'click', [myProfileClickEvent]);
  appState.registeredClickEvents.myProfileClick = true;
  attachEventListener([DOMelements.mainContent], 'submit', [myProfileSubmitEvent]);
  appState.registeredClickEvents.myProfileClick = true;
  appState.registeredClickEvents.myProfileSubmit = true;
}

function myProfileClickEvent(e) {  
  if (isTargetElementInsideOf(e, DOMstrings.myProfileForm.container.avatarImg)){
    changeAvatarSubController(e);
  } 
}

function myProfileSubmitEvent(e) {
  if (isTargetElementInsideOf(e, DOMstrings.myProfileForm.container.saveChangesForm)){
    saveProfileChangesController(e);
  } else if (isTargetElementInsideOf(e, DOMstrings.myProfileForm.container.deleteAccount)) {
    deleteAccountController(e);
  }
}

/* ---------------------------------------- */
/* ------ CHANGE AVATAR SUBCONTROLLER ----- */

function changeAvatarSubController(e) {
  e.preventDefault();

  const modal = new tingle.modal({
    footer: false,
    stickyFooter: false,
    closeMethods: ['escape', 'button'],
    beforeOpen: function() {
      mainView.adjustModalWithAvatarsStyle();
      mainView.populateModalWithAvatars();
    },
    onClose: function() {
      detachEventListener([document.querySelector(`.${DOMstrings.modal.outerBox}`)], 'click', [selectAvatarSubController]);
    },
    onOpen: function() {
      attachEventListener([document.querySelector(`.${DOMstrings.modal.outerBox}`)], 'click', [selectAvatarSubController]);
    },
  });

  modal.setContent('');
  modal.open();

  function selectAvatarSubController(e) {
    e.preventDefault();
  
    const targetElement = e.target;
    if (e.target.dataset.avatarIndex) {
      mainView.changeAvatarImg(targetElement.dataset.avatarIndex)   
      modal.close();
    }
  }
}


/* ---------------------------------------- */
/* ---- SAVE PROFILE CHANGES CONTROLLER --- */
/* ---------------------------------------- */

async function saveProfileChangesController(e) {
  e.preventDefault();

   // Remove existing warning messages
   if (mainView.warningMessageExists()) {
    mainView.removeMessage();
  }

  const updatedUser = mainView.getMyProfileFormData();
  updatedUser.id = appState.login.JWT.user.id;

  if (updatedUser) {
    // Create a new updated user instance
    appState.user.updated = new User(updatedUser);

    // Delete all data from newUser
    deleteAllObjectProperties(updatedUser);

    // POST new user to server
    try {
      await appState.user.updated.update();
    } catch (error) {
      displayFailMessage(apiData.infoMessages.unknown);
    }

    if (appState.user.updated.result) {
      appState.user.updated.result.status === 201 ? 
      userUpdateSuccessfullyExecuted() 
      : displayFailMessage(apiData.infoMessages.unknown);
    } else if (appState.user.updated.error) {
      return displayFailMessage(`${appState.user.updated.error.message}!`);
    } else {
      return displayFailMessage(apiData.infoMessages.unknown);
    }

    // Delete all data from appState.register.user
    deleteAllObjectProperties(appState.user.updated);
  }
}

function userUpdateSuccessfullyExecuted() {
  appState.login.JWT.user = JSON.parse(JSON.stringify(appState.user.updated.result.data));
  
  updateDropDownListElements();
}

/* ---------------------------------------- */
/* ------ DELETE ACCOUNT CONTROLLER ------- */
/* ---------------------------------------- */

function deleteAccountController(e) {
  e.preventDefault();

  let method,
      modalMessage,
      demoUser;

  if (appState.login.JWT.user.username === 'demo@user.com') {
    method = ['escape', 'button']; 
    modalMessage = '<h1>Deletion of demo user account is not allowed.</h1>'
    demoUser = true;
  } else {
    method = [];
    modalMessage = '<h1>This action will result in permanent deletion of your account. Are you sure you whish to proceed?</h1>';
    demoUser = false;
  }

  const modal = new tingle.modal({
    footer: true,
    stickyFooter: false,
    closeMethods: method
  });

  modal.setContent(modalMessage);

  if (!demoUser) {
    modal.addFooterBtn('NO', 'tingle-btn tingle-btn--primary', function() {
      modal.close();
    });
  
    modal.addFooterBtn('YES. DELETE ACCOUNT', 'tingle-btn tingle-btn--danger', async function() {
      await deleteLoggedUserPosts();
      await deleteUserFromDB();
      modal.close();
    });
  }

  modal.open();
}

async function deleteLoggedUserPosts() {
  await retrieveAllPostsFromAPI('desc');

  appState.posts.myRuns = filterPostsByID(appState.posts.retrieved.result.data, appState.login.JWT.user.id);

  if (appState.posts.myRuns.length > 0) {
    await deletePostsFromDB(appState.posts.myRuns);
  }

  return deleteAllObjectProperties(appState.posts);
}

function filterPostsByID(posts, ID) {
  return posts.filter(post => post.user.id === ID);
}

async function deleteUserFromDB() {
  const loggedUser = new User({id: appState.login.JWT.user.id});

  try {
    await loggedUser.deleteByID();
  } catch (error) {
    displayFailMessage(apiData.infoMessages.unknown);;
  }

  if (loggedUser.result) {
    if (loggedUser.result.status === 204) {
      logoutSubController('deleteAccount');
    } else {
      return displayFailMessage(apiData.infoMessages.unknown);
    }
  } else if (loggedUser.error) {
    return displayFailMessage(`${loggedUser.error.message}!`);
  } else {
    return displayFailMessage(apiData.infoMessages.unknown);
  }
}

async function deletePostsFromDB(posts) {
  const postsLen = posts.length;

  for (let i=0; i<postsLen; i++) {
    const post = new Post({id: posts[i].id});

    try {
      await post.deleteByID();
    } catch (error) {
      displayFailMessage(apiData.infoMessages.unknown);;
    }

    if (post.result) {
      if (post.result.status === 204) {
        continue;
      } else {
        return displayFailMessage(apiData.infoMessages.unknown);
      }
    } else if (post.error) {
      return displayFailMessage(`${post.error.message}!`);
    } else {
      return displayFailMessage(apiData.infoMessages.unknown);
    }
  }
}

/* ---------------------------------------- */
/* -------- ADD NEW RUN CONTROLLER -------- */
/* ---------------------------------------- */

function addNewRunController() {
  attachEventListener([DOMelements.mainContent], 'submit', [submitAddOrEditRunEvent]);
  appState.registeredClickEvents.addNewRunForm = true;
}

async function submitAddOrEditRunEvent(e) {
  e.stopPropagation();
  e.preventDefault();

  // Remove existing warning messages
  if (mainView.warningMessageExists()) {
    mainView.removeMessage();
  }

  // 2) read values from input fields
  const newPost = mainView.getNewRunFormData();
  if (appState.session.currentView !== 'addNewRun') {
    newPost.id = appState.session.currentView;
  }

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
      if (appState.session.currentView === 'addNewRun') {
        await appState.posts.created.createNew();
      } else {
        await appState.posts.created.updateByID();
      }
    } catch (error) {
      displayFailMessage(apiData.infoMessages.unknown);
    }

    let statusMessage,
        returnCondition,
        info1,
        info2;

    if (appState.session.currentView === 'addNewRun') {
      statusMessage = 201;
      returnCondition = appState.posts.created.result.data;
      info1 = apiData.infoMessages.addNewRun.success.info1;
      info2 = apiData.infoMessages.addNewRun.success.info2;
    } else {
      statusMessage = 204;
      returnCondition = true;
      info1 = apiData.infoMessages.addNewRun.success.info3;
      info2 = apiData.infoMessages.addNewRun.success.info2;
    }
  
    // 5) read and store the returned data
    if (appState.posts.created.result) {
      appState.posts.created.result.status === statusMessage 
      && returnCondition ? 
      formSubmitSuccessfullyExecuted('addNewRun', info1, info2) : displayFailMessage(apiData.infoMessages.unknown);
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