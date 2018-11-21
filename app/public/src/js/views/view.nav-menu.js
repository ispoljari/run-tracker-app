/* ---------------------------------------- */
/* ------------ IMPORT MODULES ------------ */

import {
  DOMelements, 
  controlHooksStrings, 
  menuIdentifiers
} from './view.base';

export const toggleDropDownList = () => {
  DOMelements.menuDropDownList.classList.toggle(controlHooksStrings.dropDownToggleVisibility);
}

export const isDropDownListOpen = () => {
  return DOMelements.menuDropDownList.classList.contains(controlHooksStrings.dropDownToggleVisibility);
}

export const closeDropDownList = () => {
  DOMelements.menuDropDownList.classList.remove(controlHooksStrings.dropDownToggleVisibility);
}