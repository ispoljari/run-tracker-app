/* ---------------------------------------- */
/* ----------- EXPORT DOM CONST's --------- */

export const menuIdentifiers = {
  myRuns: 'myRuns',
  analytics: 'analytics',
  addNewRun: 'addNewRun',
  dropDownList: 'dropDownList',
  register: 'register',
  login: 'login',
}

export const dropDownIdentifiers = {
  myProfile: 'myProfile',
  myRuns: 'myRuns',
  analytics: 'analytics',
  logout: 'logout'
}

export const controledHooksStrings = {
  dropDownToggleVisibility: 'dropDownList--toggle-visibility',
  loginMenuToggleVisibility: 'login--toggle-visibility',
  headingToggleVisibility: 'header__heading--toggle-visibility',
  iconsCreditToggleVisibility: 'credit--toggle-visibility',
  navMenuItemHide: 'menu__item--hidden',
  warningMessageStyle: 'content__user-info--warning',
  addNewRunBackground: 'add-new-run__form--background'
}

export const DOMstrings = {
  menuDropDownList: 'js-dropdown-list',
  loginMenu: 'js-login-menu',
  registerForm : {
    inputFields: {
      firstName: 'registration__input-first-name',
      lastName: 'registration__input-last-name',
      username: 'registration__input-username',
      password: 'registration__input-password',
      repeatPassword: 'registration__input-repeatPassword'
    },
    infoMessage: 'js-content__user-info'
  },
  loginForm: {
    infoMessage: 'js-login__info'
  }
}

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
  navMenuItems: {
    logedOut: {
      register: document.querySelectorAll(`[data-menu-type="${menuIdentifiers.register}"]`)[0],
      login: document.querySelectorAll(`[data-menu-type="${menuIdentifiers.login}"]`)[0]
    },
    logedIn: {
      myRuns: document.querySelectorAll(`[data-menu-type="${menuIdentifiers.myRuns}"]`)[0],
      analytics: document.querySelectorAll(`[data-menu-type="${menuIdentifiers.analytics}"]`)[0],
      addNewRun: document.querySelectorAll(`[data-menu-type="${menuIdentifiers.addNewRun}"]`)[0],
      avatarDropDown: document.querySelectorAll(`[data-menu-type="${menuIdentifiers.dropDownList}"]`)[0],
      dropDownList: {
        myProfile: document.querySelectorAll(`[data-dropdown-type="${dropDownIdentifiers.myProfile}"]`)[0],
        myRuns: document.querySelectorAll(`[data-dropdown-type="${dropDownIdentifiers.myRuns}"]`)[0],
        analytics: document.querySelectorAll(`[data-dropdown-type="${dropDownIdentifiers.analytics}"]`)[0],
        logout: document.querySelectorAll(`[data-dropdown-type="${dropDownIdentifiers.logout}"]`)[0]
      }
    }
  },
  inputFields: {
    login: {
      username: document.querySelector('.login__input-username'),
      password: document.querySelector('.login__input-password')
    }
  }
}

const serverFail = 'Something went wrong. Please refresh the page and try again.';

export const apiData = {
  urls: {
    users: '/api/users/',
    posts:  '/api/posts/',
    auth: '/api/auth/'
  },
  infoMessages: {
    registration: {
      fail: {
        server: serverFail,
        validation: {
          password: 'The passwords are not matching!'
        },
      },
      success: {
        info1: 'Success!',
        info2: 'Loading main page.'
      }
    },
    login: {
      fail: {
        server: {
          unknown: serverFail,
          noUser: 'Login failed! Username or password not correct.'
        }
      }
    }
  }
}