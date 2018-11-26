import {
  DOMelements, 
  controledHooksStrings
} from './view.base';

export const removeIconsCredit = () => {
  if (!DOMelements.iconsCredit.classList.contains(controledHooksStrings.iconsCreditToggleVisibility)) {
    DOMelements.iconsCredit.classList.add(controledHooksStrings.iconsCreditToggleVisibility);
  }
}

export const renderIconsCredit = () => {
  if (DOMelements.iconsCredit.classList.contains(controledHooksStrings.iconsCreditToggleVisibility)) {
    DOMelements.iconsCredit.classList.remove(controledHooksStrings.iconsCreditToggleVisibility);
  }
}