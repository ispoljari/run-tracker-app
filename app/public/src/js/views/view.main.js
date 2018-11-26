import {
  DOMelements
} from './view.base';

export const removeMainContent = () => {
  DOMelements.mainContent.innerHTML = '';
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
            <h2>John Smith</h2>
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

export const renderRegistrationForm = () => {
  const htmlString = 
  `<form action="#" class="registration js-registration">
    <div class="registration__container">
      <fieldset>
        <div class="registration__legend">
          <legend>Create New Account:</legend>
        </div>

        <div class="registration__first-name">
          <label>
            First Name:
            <input type="text" placeholder="John" name="first-name" class="registration__input-first-name" required>
          </label>
        </div>

        <div class="registration__last-name">
          <label>
            Last Name:
            <input type="text" placeholder="Smith" name="last-name" class="registration__input-last-name" required>
          </label>
        </div>

        <div class="registration__email">
          <label>
            Email (username):
            <input type="email" name="email" placeholder="john.smith@gmail.com" class="registration__input-username" required>
          </label>
        </div>
        
        <div class="registration__password">
          <label>
            Password:
            <input type="password" name="password" placeholder="abcd1234" class="registration__input-password" required>
          </label>
        </div>

        <div class="registration__password-confirm">
          <label>
            Confirm Password:
            <input type="password" placeholder="abcd1234" name="password-confirm" class="registration__input-repeatPassword" required>
          </label>
        </div>
      </fieldset>

      <button type="submit" class="registration__submit btn-style">Submit</button>
    </div>
  </form>`

  appendHtmlToMainContent(htmlString);
}

function appendHtmlToMainContent(html) {
  DOMelements.mainContent.insertAdjacentHTML('beforeend', html);
}