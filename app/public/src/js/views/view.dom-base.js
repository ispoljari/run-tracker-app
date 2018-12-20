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
  addNewRunBackground: 'add-new-run__form--background',
  postsCollapsibleToggleVisibility: 'content__post--active',
  modalAdjustPadding: 'tingle-modal-box__content--adjust-padding',
  modalAdjustWidth: 'tingle-modal-box--adjust-width',
  modalAdjustTopMargin: 'tingle-modal-box--adjust-topMargin'
}

export const DOMstrings = {
  menuDropDownList: 'js-dropdown-list',
  menuDropDownAvatarImg: 'js-menu__avatar',
  menuDropDownUserName: 'js-dropdown-list__user-name',
  loginMenu: 'js-login-menu',
  mainViewWarningMessage: 'js-content__user-info',
  registerForm : {
    inputFields: {
      firstName: 'registration__input-first-name',
      lastName: 'registration__input-last-name',
      username: 'registration__input-username',
      password: 'registration__input-password',
      repeatPassword: 'registration__input-repeatPassword'
    },
  },
  loginForm: {
    infoMessage: 'js-login__info'
  },
  addNewRunForm: {
    inputFields: {
      runTitle: 'js-add-new-run__title',
      distance: {
        value: 'js-add-new-run__distance-value',
        unit: 'js-add-new-run__distance-unit'
      },
      duration: {
        hours: 'js-add-new-run__duration-hours',
        minutes: 'js-add-new-run__duration-minutes',
        seconds: 'js-add-new-run__duration-seconds'
      },
      runType: 'js-add-new-run__run-type',
      date: 'js-add-new-run__date',
      time: 'js-add-new-run__time',
      description: 'js-add-new-run__description',
      privacy: 'js-add-new-run__privacy'
    }
  },
  myProfileForm: {
    inputFields: {
      fullName: 'js-myProfile__full-name-input',
      displayName: 'js-myProfile__display-name-input'
    },
    buttons: {
      changeAvatar: 'js-myProfile__change-avatar-button'
    },
    container: {
      avatarImg: 'js-profile-banner__avatar',
      saveChangesForm: 'js-myProfile__form-saveChanges',
      deleteAccount: 'js-myProfile__form-deleteAccount'
    }
  },
  posts: {
    mainContainer: 'js-content__post',
    collapsibleContainer: 'js-post-collapsible',
    collapsibleSymbol: 'js-post-collapsible__symbol',
    additional: 'js-post-additional',
    loadMore: 'js-main-content__loader',
    username: 'js-post-header__user',
    avatar: 'js-post-avatar',
    title: 'js-post-data__title',
    editable: 'js-post-data__editable'
  },
  modal: {
    outerBox: 'tingle-modal-box',
    content: 'tingle-modal-box__content'
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
    unknown: serverFail, 
    registration: {
      fail: {
        validation: {
          password: 'The passwords are not matching!'
        },
      },
      success: {
        info1: 'Registration successful!',
        info2: 'Loading main page.'
      }
    },
    login: {
      fail: {
        server: {
          noUser: 'Login failed! Username or password not correct.'
        }
      }
    },
    addNewRun: {
      fail: {
        validation: {
          duration: 'Total duration time must be greater than 0s.',
          date: 'Required date format is yyyy-mm-dd.',
          time: 'Required time format is hh:ss.',
          dateDiff: 'Please choose a date which is not in the future.',
          timeDiff: 'Please choose a time which is not in the future.',
          description: 'Description should have 10 characters minimum.'
        }
      }, 
      success: {
        info1: 'Post successfully submited!',
        info2: 'Loading main page.'
      }
    },
    deleteAccount: {
      success: {
        info1: 'Account successfully deleted!',
        info2: 'Loading main page.'
      }
    }
  }
}