/* ---------------------------------------- */
/* ------------ IMPORT MODULES ------------ */

import {
  DOMelements, 
  controledHooksStrings, 
  menuIdentifiers
} from './view.base';

export const toggleDropDownList = () => {
  DOMelements.menuDropDownList.classList.toggle(controledHooksStrings.dropDownToggleVisibility);
}

export const isDropDownListOpen = () => {
  return DOMelements.menuDropDownList.classList.contains(controledHooksStrings.dropDownToggleVisibility);
}

export const closeDropDownList = () => {
  DOMelements.menuDropDownList.classList.remove(controledHooksStrings.dropDownToggleVisibility);
}