import {
  DOMelements, 
  controledHooksStrings, 
  menuIdentifiers
} from './view.base';

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