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
  iconsCredit: document.querySelector('.js-credit'),
  loginForm: document.querySelector('.js-login__form'),
  registerForm: document.querySelector('.js-registration'),
  inputFields: {
    login: {
      username: document.querySelector('.login__input-username'),
      password: document.querySelector('.login__input-password')
    },
    register: {
      firstName: document.querySelector('.registration__input-first-name'),
      lastName: document.querySelector('.registration__input-last-name'),
      username: document.querySelector('.registration__input-username'),
      password: document.querySelector('.registration__input-password'),
      repeatPassword: document.querySelector('.registration__input-repeatPassword')
    }
  }
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
  navigationItemsToggleVisibility: 'menu__item--hidden'
}