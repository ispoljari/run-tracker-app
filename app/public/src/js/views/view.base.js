/* ---------------------------------------- */
/* ----------- EXPORT DOM CONST's --------- */

export const DOMelements = {
  body: document.body,
  navMenu: document.querySelector('.js-header__nav'),
  menuDropDownList: document.querySelector('.js-dropdown-list'),
  loginMenu: document.querySelector('.js-login-menu'),
  heading: document.querySelector('.js-header__heading'),
  headerLogo: document.querySelector('.js-header__logo'),
  mainContent: document.querySelector('.js-main-content'),
  iconsCredit: document.querySelector('.js-credit')
}

export const DOMstrings = {
  menuDropDownList: 'js-dropdown-list',
  loginMenu: 'js-login-menu'
}

export const menuIdentifiers = {
  myRuns: 'myRuns',
  analytics: 'analytics',
  addNewRun: 'addNewRun',
  dropDownList: 'dropDownList',
  register: 'register',
  login: 'login'
}

export const controledHooksStrings = {
  dropDownToggleVisibility: 'dropDownList--toggle-visibility',
  loginMenuToggleVisibility: 'login--toggle-visibility',
  headingToggleVisibility: 'header__heading--toggle-visibility',
  iconsCreditToggleVisibility: 'credit--toggle-visibility',
}