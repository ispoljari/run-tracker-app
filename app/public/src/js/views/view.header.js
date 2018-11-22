import {
  DOMelements, 
  controledHooksStrings, 
  menuIdentifiers
} from './view.base';

export const removeIntroHeading = () => {
  DOMelements.heading.classList.add(controledHooksStrings.headingToggleVisibility);
  DOMelements.heading.style.padding = 0;
}

export const renderIntroHeading = () => {
  DOMelements.heading.classList.remove(controledHooksStrings.headingToggleVisibility);
  DOMelements.heading.style.padding = '5px';
}