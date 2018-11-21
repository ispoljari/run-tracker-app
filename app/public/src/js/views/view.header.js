import {
  DOMelements, 
  controledHooksStrings, 
  menuIdentifiers
} from './view.base';

export const removeIntroHeading = () => {
  DOMelements.introTextHeader.innerHTML = '';
  DOMelements.introTextHeader.classList.remove(controledHooksStrings.introTextHeaderPadding)
}

export const renderIntroHeading = () => {
  const textMarkup = 
  `<h1 class="heading__title">
    Put on your running shoes, go outside and start running! When you're done, come back here and log your activity.
    <br/> 
    <span class="heading__subtitle">
        <span>Run Tracker</span> enables you to easily track and analyze your progress on a weekly basis, and share your activity with other users on the platform.
    </span>
  </h1>`

  DOMelements.introTextHeader.insertAdjacentElement('afterbegin', textMarkup);
  DOMelements.introTextHeader.classList.add(controledHooksStrings.introTextHeaderPadding);
}