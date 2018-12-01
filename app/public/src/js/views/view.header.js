import {
  DOMelements, 
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

export const getLoginUsername = () => {
  return DOMelements.inputFields.login.username.value;
}

export const getLoginPassword = () => {
  return DOMelements.inputFields.login.password.value;
}

export const clearLoginUsername = () => {
  DOMelements.inputFields.login.username.value = '';
}

export const clearLoginPassword = () => {
  DOMelements.inputFields.login.password.value = '';
}