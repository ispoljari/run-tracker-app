import {
  DOMelements, 
  controledHooksStrings,
  menuIdentifiers 
} from './view.base';

// Navigation menu buttons (show/hide)

export const hideRegisterButton = () => {
  document.querySelectorAll(`[data-menu-type="${menuIdentifiers.register}"]`)[0].classList.add(controledHooksStrings.navigationItemsToggleVisibility);
}

export const hideLoginButton = () => {
  document.querySelectorAll(`[data-menu-type="${menuIdentifiers.login}"]`)[0].classList.add(controledHooksStrings.navigationItemsToggleVisibility);
}

export const showMyRunsButton = () => {
  document.querySelectorAll(`[data-menu-type="${menuIdentifiers.myRuns}"]`)[0].classList.remove(controledHooksStrings.navigationItemsToggleVisibility);
}

export const showAnalyticsButton = () => {
  document.querySelectorAll(`[data-menu-type="${menuIdentifiers.analytics}"]`)[0].classList.remove(controledHooksStrings.navigationItemsToggleVisibility);
}

export const showAddNewRunButton = () => {
  document.querySelectorAll(`[data-menu-type="${menuIdentifiers.addNewRun}"]`)[0].classList.remove(controledHooksStrings.navigationItemsToggleVisibility);
}

export const showAvatarDropDownListButton = () => {
  document.querySelectorAll(`[data-menu-type="${menuIdentifiers.dropDownList}"]`)[0].classList.remove(controledHooksStrings.navigationItemsToggleVisibility);
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