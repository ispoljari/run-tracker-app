import {
  DOMelements, 
  controledHooksStrings, 
  menuIdentifiers
} from './view.base';

export const removeIconsCredit = () => {
  DOMelements.iconsCredit.classList.add(controledHooksStrings.iconsCreditToggleVisibility);
}

export const renderIconsCredit = () => {
  DOMelements.iconsCredit.classList.remove(controledHooksStrings.iconsCreditToggleVisibility);
}