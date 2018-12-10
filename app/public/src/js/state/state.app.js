/* ---------------------------------------- */
/* ------------ EXPORT APP STATE ---------- */

export const appState = {
  session: {
    currentView: 'home',
    logginCredentials: {
      username: 'demo@run-tracker.test',
      password: 'demo123456'
    },
    loggedIn: false
  },
  registeredClickEvents: {
    logInMenu: false,
    registerForm: false,
    addNewRunForm: false,
    dropDownList: false,
    posts: false
  },
  register: {},
  login: {},
  posts: {},
  mutationObserver: {}
}