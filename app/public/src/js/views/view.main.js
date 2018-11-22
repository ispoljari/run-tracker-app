import {
  DOMelements, 
  controledHooksStrings, 
  menuIdentifiers
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

  DOMelements.mainContent.insertAdjacentHTML('beforeend', htmlString);
}