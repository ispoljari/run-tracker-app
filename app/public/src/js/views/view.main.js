import {
  DOMelements,
  DOMstrings,
  controledHooksStrings
} from './view.dom-base';

// Main page

export const removeMainContent = () => {
  DOMelements.mainContent.innerHTML = '';
}

export const renderPostsTitle = () => {
  const htmlString = 
  `<div class="content__heading-posts">
    <h2>Recent Posts</h2>
   </div>`

  appendHtmlToMainContent(htmlString);
}

export const renderMyRunsTitle = () => {
  const htmlString = 
  `<div class="content__heading-posts">
    <h2>My Runs</h2>
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

export const renderPosts = () => {
  const htmlString = 
  `<div class="content__post">
    <div class="post-avatar">
      <img src="svg/monsters/monster-15.svg" alt="An image of a random monster">
    </div>
    <div class="post-info">
      <div class="post-header">
        <div class="post-header__user">
          <a href="#">
            <h3>John Smith</h3>
          </a>
        </div>
        <div class="post-header__datetime">
          <p>20th October 2018. at 19:45</p>
        </div>
      </div>
      <div class="post-data">
        <div class="post-data__distance post-data__distance--style-results">
          <p>Distance</p>
          <p>4.1 km</p>
        </div>
        <div class="post-data__time post-data__distance--style-results">
          <p>Run Time</p>
          <p>28m</p>
        </div>
        <div class="post-data__average-speed post-data__distance--style-results">
          <p>Average speed</p> <p>6:49/km</p>
        </div>
      </div>
    </div>
  </div>`

  appendHtmlToMainContent(htmlString);
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
              <input type="text" placeholder="Relaxing Afternoon Run" name="title" id="title__input" required/>
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
              <input type="number" min="0.01" max="9999" placeholder="0" value="0" name="distance-value" id="distance__value-input" required/>
            </div>
            <div class="distance__unit">
              <label for="distance__unit-select" class="distance__unit-label"></label>
              <select name="distance-unit" id="distance__unit-select" required>
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
              <input type="number" min="0" max="9999" placeholder="0" value="0" step="1" name="duration-hours"  id="duration__hours-input" required/>
            </div>
            <div class="duration__minutes">
              <label for="duration__minutes-input" class="duration__minutes-label">min</label>
              <input type="number" min="0" max="59" placeholder="00" value="00" step="1"  name="duration-minutes"  id="duration__minutes-input" required/>
            </div>
            <div class="duration__seconds">
              <label for="duration__seconds-input" class="duration__seconds-label">s</label>
              <input type="number" min="0" max="59" placeholder="00" value="00" step="1" name="duration-seconds"  id="duration__seconds-input" required/>
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
              <select name="run-type" id="run-type__select" required>
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
              <input type="date" value="2018-12-08" pattern="[0-9]{4}-[0-9]{2}-[0-9]{2} name="date"  id="date-input" required/>
            </div>
            <div class="time">
              <label for="time-input" class="time-label"></label>
              <input type="time" value="10:00" name="time"  id="time-input" required/>
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
                <textarea placeholder="How did you feel during the run? Did it rain, or was it sunny? Where did you run?" name="description" id="description__input"></textarea>
              </div>
          </fieldset>	
        </div>
      </div>
    </div>

    <div class="row vertical-offset-row">
      <div class="form-inner-container">
        <div class="col-12">
          <fieldset class="privacy">
            <legend>Privacy</legend>
            <div class="privacy__container">
              <label for="privacy__select" class="privacy__label"></label>
              <select name="privacy" id="privacy__select" required>
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

// Help functions

function appendHtmlToMainContent(html, position='beforeend') {
  DOMelements.mainContent.insertAdjacentHTML(position, html);
}