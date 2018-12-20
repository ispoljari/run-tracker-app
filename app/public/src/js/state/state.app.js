/* ---------------------------------------- */
/* ------------ EXPORT APP STATE ---------- */

export const appState = {
  session: {
    currentView: 'home',
    loggedIn: false,
    postsPage: 1
  },
  registeredClickEvents: {
    logInMenu: false,
    registerForm: false,
    addNewRunForm: false,
    addNewRunClick: false,
    dropDownList: false,
    posts: false,
    sort: false,
    myProfileClick: false,
    myProfileSubmit: false
  },
  register: {},
  login: {},
  user: {},
  posts: {
    displayed: 0,
    loaders: 0
  },
  mutationObserver: {}
}