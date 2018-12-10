import * as moment from 'moment';

import {
  DOMelements,
  DOMstrings,
  controledHooksStrings
} from './view.dom-base';

// Main page

export const removeMainContent = () => {
  DOMelements.mainContent.innerHTML = '';
}

export const renderTitle = (message) => {
  const htmlString = 
  `<div class="content__heading-posts">
    <h2>${message}</h2>
   </div>`

  appendHtmlToMainContent(htmlString);
}

export const renderMessage = (message, position='beforeend') => {
  const htmlString = 
  `<div class="content__user-info js-content__user-info content__user-info--center">
    <h2>${message}</h2>
   </div>`

  appendHtmlToMainContent(htmlString, position);
}

export const removeMessage = () => {
  DOMelements.mainContent.removeChild(document.querySelector(`.${DOMstrings.infoMessage}`));
}

export const styleWarningMessage = () => {
  const warningMessage = document.querySelector(`.${DOMstrings.infoMessage}`);
  if (!warningMessage.classList.contains(controledHooksStrings.warningMessageStyle)) {
    warningMessage.classList.add(controledHooksStrings.warningMessageStyle);
  }
}

export const warningMessageExists = () => {
  if (document.querySelector(`.${DOMstrings.registerForm.infoMessage}`)) {
    return document.querySelector(`.${DOMstrings.registerForm.infoMessage}`).classList.contains(controledHooksStrings.warningMessageStyle);
  } else {
    return false;
  }
}

export const renderDotsAnimation = () => {
  const htmlString = 
  `<div class="content__info-dots">
    <span>.</span><span>.</span><span>.</span>
   </div>`

  appendHtmlToMainContent(htmlString);
}

export const renderPosts = (post) => {
  const formatedDate = moment(post.date, 'YYYY-MM-DD').format('LL');
  const formatedTime = moment(post.time, 'HH:mm').format('hh:mm A');

  const runHours = post.durationHours ? `${post.durationHours}hrs` : '';
  const runMinutes = post.durationMinutes ? `${post.durationMinutes}min` : '';
  const runSeconds = post.durationSeconds ? `${post.durationSeconds}s` : '';

  let avrSpeedRaw;
  if (post.distanceValue) {
    avrSpeedRaw = Math.round(((post.durationHours*60 + post.durationMinutes + post.durationSeconds/60) / post.distanceValue) * 100) / 100;
  } else {
    avrSpeedRaw = 0;
  }
  
  let minPartAvrSpeed = Math.floor(avrSpeedRaw);
  let secPartAvrSpeed = Math.round((avrSpeedRaw - Math.floor(avrSpeedRaw))*60);

  const displayAvrMinSpeed = minPartAvrSpeed > 0 ? `${minPartAvrSpeed}:` : '';

  let displayAvrSecSpeed;
  if (secPartAvrSpeed < 10) {
    displayAvrSecSpeed = secPartAvrSpeed > 0 ? `0${secPartAvrSpeed}` : '';
  } else {
    displayAvrSecSpeed = secPartAvrSpeed > 0 ? `${secPartAvrSpeed}` : '';
  }


  const htmlString = 
  `<div class="content__post js-content__post">
    <div class="post-collapsible js-post-collapsible">
      <a href="#">
        <span class="js-post-collapsible__symbol">&#10133;</span>
      </a>
    </div>
    <div class="post-avatar">
      <img src="svg/monsters/monster-${post.user.avatar}.svg" alt="An image of a random monster">
    </div>
    <div class="post-info">
      <div class="post-header">
        <div class="post-header__user">
          <a href="#">
            <h3>@${post.user.displayName}</h3>
          </a>
        </div>
        <div class="post-header__datetime">
          <p>${formatedDate} at ${formatedTime}</p>
        </div>
      </div>
      <div class="post-data">
        <div class="post-data__title">
          <h4>${post.title}</h4>
        </div>
        <div class="post-data__distance post-data__distance--style-results">
          <p>Distance</p>
          <p>${post.distanceValue}${post.distanceUnit}</p>
        </div>
        <div class="post-data__time post-data__distance--style-results">
          <p>Run Time</p>
          <p>${runHours}${runMinutes}${runSeconds}</p>
        </div>
        <div class="post-data__average-speed post-data__distance--style-results">
          <p>Pace</p><p>${displayAvrMinSpeed}${displayAvrSecSpeed}/km</p>
        </div>
      </div>
      <div class="post-additional js-post-additional">
        <div class="post-additional__description">
          <h4>Description</h4>
          <p>${post.description}</p>
        </div>
      </div>
    </div>
  </div>`

  appendHtmlToMainContent(htmlString);
}

export const toggleCollapsiblePost = (element) => {
  const postsMainContainer = element.closest(`.${DOMstrings.posts.mainContainer}`);
  const postsCollapsibleSymbol = element.closest(`.${DOMstrings.posts.collapsibleContainer}`).querySelector(`.${DOMstrings.posts.collapsibleSymbol}`);
  const postsAdditionalInfo = postsMainContainer.querySelector(`.${DOMstrings.posts.additional}`);
  
  postsMainContainer.classList.toggle(controledHooksStrings.postsCollapsibleToggleVisibility);
  
  if (postsAdditionalInfo.style.display === 'block') {
    postsAdditionalInfo.style.display = 'none';
    postsCollapsibleSymbol.innerHTML = '&#10133;';
  } else {
    postsAdditionalInfo.style.display = 'block';
    postsCollapsibleSymbol.innerHTML = '&#10134;';
  }
}

// Register page

export const renderRegistrationForm = () => {
  const htmlString = 
  `<form action="#" class="registration js-registration">
    <div class="registration__container">
      <fieldset>
        <div class="registration__legend">
          <legend>Create New Account</legend>
        </div>

        <div class="registration__first-name">
          <label>
            First Name
            <input type="text" pattern="[A-Za-zšŠđĐčČćĆžŽ]+" title="Only letters A-Z are allowed" placeholder="John" name="first-name" class="registration__input-first-name" required>
          </label>
        </div>

        <div class="registration__last-name">
          <label>
            Last Name
            <input type="text" pattern="[A-Za-zšŠđĐčČćĆžŽ]+" title="Only letters A-Z are allowed" placeholder="Smith" name="last-name" class="registration__input-last-name" required>
          </label>
        </div>

        <div class="registration__email">
          <label>
            Email (username)
            <input type="email" name="email" placeholder="john.smith@gmail.com" class="registration__input-username" required>
          </label>
        </div>
        
        <div class="registration__password">
          <label>
            Password
            <input type="password" name="password" placeholder="abcd1234" pattern=".{10,72}" title="10 characters minimum, 72 characters maximum" class="registration__input-password" required>
          </label>
        </div>

        <div class="registration__password-confirm">
          <label>
            Confirm Password
            <input type="password" placeholder="abcd1234" pattern=".{10,72}" title="10 characters minimum, 72 characters maximum" name="password-confirm" class="registration__input-repeatPassword" required>
          </label>
        </div>
      </fieldset>

      <button type="submit" class="registration__submit btn-style">Submit</button>
    </div>
  </form>`

  appendHtmlToMainContent(htmlString);
}

export const getRegistrationFormData = () => {  
  return {
    firstName: document.querySelector(`.${DOMstrings.registerForm.inputFields.firstName}`).value,
    lastName: document.querySelector(`.${DOMstrings.registerForm.inputFields.lastName}`).value,
    username: document.querySelector(`.${DOMstrings.registerForm.inputFields.username}`).value,
    password: document.querySelector(`.${DOMstrings.registerForm.inputFields.password}`).value,
    repeatPassword: document.querySelector(`.${DOMstrings.registerForm.inputFields.repeatPassword}`).value
  }
}

export const clearRegistrationFormData = () => {
  document.querySelector(`.${DOMstrings.registerForm.inputFields.firstName}`).value = '',
  document.querySelector(`.${DOMstrings.registerForm.inputFields.lastName}`).value = '',
  document.querySelector(`.${DOMstrings.registerForm.inputFields.username}`).value = '',
  document.querySelector(`.${DOMstrings.registerForm.inputFields.password}`).value = '',
  document.querySelector(`.${DOMstrings.registerForm.inputFields.repeatPassword}`).value = ''
}

// My Runs page

export const renderProfileBanner = () => {
  const htmlString = 
  `<div class="content__profile-banner">
    <div class="profile-banner__inner-container">
      <div class="profile-banner__avatar-img">
        <img src="svg/monsters/monster-1.svg" alt="An image of a random monster">
      </div>
      <div class="profile-banner__info">
        <div class="profile-info__full-name">
          <h2>Wolfgang A. Mozart</h2>
        </div>
        <div class="profile-info__display-name">
          <p>@dementor</p>
        </div>
      </div>
    </div>
  </div>`

  appendHtmlToMainContent(htmlString);
}

// Add new run page

export const renderNewRunForm = () => {

  const htmlString = 
  `<form class="add-new-run">
    <div class="row">
      <div class="form-inner-container">
        <div class="col-12">
          <h2>Add New Run</h2>
        </div>
      </div>
    </div>

    <div class="row vertical-offset-row">
      <div class="form-inner-container">
        <div class="col-12">
          <fieldset class="title">
            <legend>Title</legend>
            <div class="title__container">
              <label for="title__input" class="title__label"></label>
              <input type="text" placeholder="Relaxing Afternoon Run" name="title" id="title__input" class="js-add-new-run__title" required/>
            </div>
          </fieldset>	
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-12">
        <hr class="horizontal-ruler">
      </div>
    </div>
    
    <div class="row">
      <div class="form-inner-container">
        <div class="col-6">
          <fieldset class="distance">
            <legend>Distance</legend>
            <div class="distance__value">
              <label for="distance__value-input" class="distance__value-label"></label>
              <input type="number" min="0.01" max="9999" step="0.01" placeholder="0" value="0" name="distance-value" id="distance__value-input" class="js-add-new-run__distance-value" required/>
            </div>
            <div class="distance__unit">
              <label for="distance__unit-select" class="distance__unit-label"></label>
              <select name="distance-unit" id="distance__unit-select" class="js-add-new-run__distance-unit" required>
                <option value="">Select Unit Type</option>
                <option value="km">kilometers</option>
                <option value="m" selected>meters</option>
                <option value="mi">miles</option>
                <option value="yd">yards</option>
              </select>
            </div>
          </fieldset>
        </div>

        <div class="col-6 vertical-offset-column">
          <fieldset class="duration">
            <legend>Duration</legend>
            <div class="duration__hours">
              <label for="duration__hours-input" class="duration__hours-label">hr</label>
              <input type="number" min="0" max="9999" placeholder="0" value="0" step="1" name="duration-hours"  id="duration__hours-input" class="js-add-new-run__duration-hours" required/>
            </div>
            <div class="duration__minutes">
              <label for="duration__minutes-input" class="duration__minutes-label">min</label>
              <input type="number" min="0" max="59" placeholder="00" value="00" step="1"  name="duration-minutes"  id="duration__minutes-input" class="js-add-new-run__duration-minutes" required/>
            </div>
            <div class="duration__seconds">
              <label for="duration__seconds-input" class="duration__seconds-label">s</label>
              <input type="number" min="0" max="59" placeholder="00" value="00" step="1" name="duration-seconds"  id="duration__seconds-input" class="js-add-new-run__duration-seconds" required/>
            </div>
          </fieldset>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-12">
        <hr class="horizontal-ruler">
      </div>
    </div>

    <div class="row">
      <div class="form-inner-container">
        <div class="col-6">
          <fieldset class="run-type">
            <legend>Run Type</legend>
            <div class="run-type__container">
              <label for="run-type__select" class="run-type__label"></label>
              <select name="run-type" id="run-type__select" class="js-add-new-run__run-type" required>
                <option value="">Select Run Type</option>
                <option value="race">Race</option>
                <option value="workout" selected>Workout</option>
              </select>
            </div>
          </fieldset>
        </div>
        <div class="col-6 vertical-offset-column">
          <fieldset class="date-time">
            <legend>Date & Time</legend>
            <div class="date">
              <label for="date-input" class="date-label"></label>
              <input type="date" value="2018-12-08" pattern="[0-9]{4}-[0-9]{2}-[0-9]{2} name="date"  id="date-input" class="js-add-new-run__date" required/>
            </div>
            <div class="time">
              <label for="time-input" class="time-label"></label>
              <input type="time" value="10:00" name="time"  id="time-input" class="js-add-new-run__time" required/>
            </div>	
          </fieldset>					
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-12">
        <hr class="horizontal-ruler">
      </div>
    </div>

    <div class="row">
      <div class="form-inner-container">
        <div class="col-12">
          <fieldset class="description">
              <legend>Description</legend>
              <div class="description__container">
                <label for="description__input" class="description__label"></label>
                <textarea placeholder="How did you feel during the run? Did it rain, or was it sunny? Where did you run?" name="description" id="description__input" class="js-add-new-run__description"></textarea>
              </div>
          </fieldset>	
        </div>
      </div>
    </div>

    <div class="row vertical-offset-row future-development--hiden">
      <div class="form-inner-container">
        <div class="col-12">
          <fieldset class="privacy">
            <legend>Privacy</legend>
            <div class="privacy__container">
              <label for="privacy__select" class="privacy__label"></label>
              <select name="privacy" id="privacy__select" class="js-add-new-run__privacy" required>
                <option value="">Select Privacy Type</option>
                <option value="you">Only You</option>
                <option value="everyone" selected>Everyone</option>
              </select>
            </div>
          </fieldset>
        </div>
      </div>
    </div> 

    <div class="row">
      <div class="col-12">
        <hr class="horizontal-ruler">
      </div>
    </div>

    <div class="row">
      <div class="form-inner-container">
        <div class="col-12">
          <button type="submit" class="new-run__submit btn-style">Create</button>
        </div>
      </div>
    </div>
    
  </form>`

  appendHtmlToMainContent(htmlString);
  DOMelements.mainContent.classList.add(controledHooksStrings.addNewRunBackground);
}

export const removeNewRunFormBackground = () => {
  DOMelements.mainContent.classList.remove(controledHooksStrings.addNewRunBackground);
}

export const getNewRunFormData = () => {  
  return {
    runTitle: document.querySelector(`.${DOMstrings.addNewRunForm.inputFields.runTitle}`).value,
    distance: {
      value: parseInt(document.querySelector(`.${DOMstrings.addNewRunForm.inputFields.distance.value}`).value, 10),
      unit: document.querySelector(`.${DOMstrings.addNewRunForm.inputFields.distance.unit}`).value
    },
    duration: {
      hours: parseInt(document.querySelector(`.${DOMstrings.addNewRunForm.inputFields.duration.hours}`).value, 10),
      minutes: parseInt(document.querySelector(`.${DOMstrings.addNewRunForm.inputFields.duration.minutes}`).value, 10),
      seconds: parseInt(document.querySelector(`.${DOMstrings.addNewRunForm.inputFields.duration.seconds}`).value, 10)
    },
    runType: document.querySelector(`.${DOMstrings.addNewRunForm.inputFields.runType}`).value,
    date: document.querySelector(`.${DOMstrings.addNewRunForm.inputFields.date}`).value,
    time: document.querySelector(`.${DOMstrings.addNewRunForm.inputFields.time}`).value,
    description:  document.querySelector(`.${DOMstrings.addNewRunForm.inputFields.description}`).value,
    privacy:  document.querySelector(`.${DOMstrings.addNewRunForm.inputFields.privacy}`).value
  }
}

// export const clearNewRunFormData = () => {
//   document.querySelector(`.${DOMstrings.registerForm.inputFields.firstName}`).value = '',
//   document.querySelector(`.${DOMstrings.registerForm.inputFields.lastName}`).value = '',
//   document.querySelector(`.${DOMstrings.registerForm.inputFields.username}`).value = '',
//   document.querySelector(`.${DOMstrings.registerForm.inputFields.password}`).value = '',
//   document.querySelector(`.${DOMstrings.registerForm.inputFields.repeatPassword}`).value = ''
// }

// Help functions

function appendHtmlToMainContent(html, position='beforeend') {
  DOMelements.mainContent.insertAdjacentHTML(position, html);
}