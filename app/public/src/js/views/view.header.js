import {
  DOMelements, 
  controledHooksStrings, 
  menuIdentifiers
} from './view.base';

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