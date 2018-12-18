import {
  DOMelements,
  DOMstrings, 
  controledHooksStrings
} from './view.dom-base';

// Navigation menu buttons (show/hide)

export const hideRegisterButton = () => {
  DOMelements.navMenuItems.logedOut.register.classList.add(controledHooksStrings.navMenuItemHide);
}

export const showRegisterButton = () => {
  DOMelements.navMenuItems.logedOut.register.classList.remove(controledHooksStrings.navMenuItemHide);
}

export const hideLoginButton = () => {
  DOMelements.navMenuItems.logedOut.login.classList.add(controledHooksStrings.navMenuItemHide);
}

export const showLoginButton = () => {
  DOMelements.navMenuItems.logedOut.login.classList.remove(controledHooksStrings.navMenuItemHide);
}

export const showMyRunsButton = () => {
  DOMelements.navMenuItems.logedIn.myRuns.classList.remove(controledHooksStrings.navMenuItemHide);
}

export const hideMyRunsButton = () => {
  DOMelements.navMenuItems.logedIn.myRuns.classList.add(controledHooksStrings.navMenuItemHide);
}

export const showAnalyticsButton = () => {
  DOMelements.navMenuItems.logedIn.analytics.classList.remove(controledHooksStrings.navMenuItemHide);
}

export const hideAnalyticsButton = () => {
  DOMelements.navMenuItems.logedIn.analytics.classList.add(controledHooksStrings.navMenuItemHide);
}

export const showAddNewRunButton = () => {
  DOMelements.navMenuItems.logedIn.addNewRun.classList.remove(controledHooksStrings.navMenuItemHide);
}

export const hideAddNewRunButton = () => {
  DOMelements.navMenuItems.logedIn.addNewRun.classList.add(controledHooksStrings.navMenuItemHide);
}

export const updateDropDownListAvatar = (avatar) => {
  DOMelements.navMenu.querySelector(`.${DOMstrings.menuDropDownAvatarImg}`).src=`svg/monsters/monster-${avatar}.svg`;
  DOMelements.navMenu.querySelector(`.${DOMstrings.menuDropDownAvatarImg}`).dataset.avatarIndex = avatar;
}

export const updateDropDownListUsername = (name) => {
  DOMelements.menuDropDownList.querySelector(`.${DOMstrings.menuDropDownUserName}`).getElementsByTagName("p")[0].textContent = name;
}

export const showAvatarDropDownListButton = () => {
  DOMelements.navMenuItems.logedIn.avatarDropDown.classList.remove(controledHooksStrings.navMenuItemHide);
}

export const hideAvatarDropDownListButton = () => {
  DOMelements.navMenuItems.logedIn.avatarDropDown.classList.add(controledHooksStrings.navMenuItemHide);
}

// Navigation avatar drop-down menu

export const toggleDropDownList = () => {
  DOMelements.menuDropDownList.classList.toggle(controledHooksStrings.dropDownToggleVisibility);
}

export const isDropDownListOpen = () => {
  return DOMelements.menuDropDownList.classList.contains(controledHooksStrings.dropDownToggleVisibility);
}

export const closeDropDownList = () => {
  DOMelements.menuDropDownList.classList.remove(controledHooksStrings.dropDownToggleVisibility);
}

// Intro heading (logged out)

export const removeIntroHeading = () => {
  if (!DOMelements.heading.classList.contains(controledHooksStrings.headingToggleVisibility)) {
    DOMelements.heading.classList.add(controledHooksStrings.headingToggleVisibility);
  }
  DOMelements.heading.style.padding = 0;
}

export const renderIntroHeading = () => {
  if (DOMelements.heading.classList.contains(controledHooksStrings.headingToggleVisibility)) {
    DOMelements.heading.classList.remove(controledHooksStrings.headingToggleVisibility);
  }
  DOMelements.heading.style.padding = '5px';
}

// Login menu

export const toggleLoginMenu = () => {
  DOMelements.loginMenu.classList.toggle(controledHooksStrings.loginMenuToggleVisibility);
}

export const isLoginMenuOpen = () => {
  return DOMelements.loginMenu.classList.contains(controledHooksStrings.loginMenuToggleVisibility);
}

export const closeLoginMenu = () => {
  DOMelements.loginMenu.classList.remove(controledHooksStrings.loginMenuToggleVisibility);
}

export const getLoginFormData = () => {
  return {
    username: DOMelements.inputFields.login.username.value,
    password: DOMelements.inputFields.login.password.value
  }
}

export const clearLoginFormData = () => {
  DOMelements.inputFields.login.username.value = '';
  DOMelements.inputFields.login.password.value = '';
}

export const renderLoginFailMessage = (message) => {
  const htmlString =
  `
  <div class="login__info js-login__info">
    <h2>${message}</h2>
  </div>`

   DOMelements.loginMenu.insertAdjacentHTML('afterbegin', htmlString);
}

export const removeLoginFailMessage = () => {
  DOMelements.loginMenu.removeChild(document.querySelector(`.${DOMstrings.loginForm.infoMessage}`));
}

export const warningMessageExists = () => {
  return DOMelements.loginMenu.contains(document.querySelector(`.${DOMstrings.loginForm.infoMessage}`));
}