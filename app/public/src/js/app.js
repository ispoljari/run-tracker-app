// $(startApp);

// function startApp() {
//   registerEventListeners();
// }

// function registerEventListeners() {
//   profileMenuListener();
// }

// function profileMenuListener() {
//   $('.js-avatar').on('click', function(event) {
//     event.stopPropagation();
//     toggleProfileMenu();
//   });

//   $('body').on('click', () => {
//     if (isProfileMenuOpen()) {
//       closeProfileMenu();
//     }
//   });
// }

// function toggleProfileMenu() {
//   $('.js-profile-options').toggleClass('profile-options--toggle-visibility');
// }

// function isProfileMenuOpen() {
//   return $('.js-profile-options').hasClass('profile-options--toggle-visibility');
// }

// function closeProfileMenu() {
//   $('.js-profile-options').removeClass('profile-options--toggle-visibility');
// }

import {obj} from './test';

const nums = [1,2,3];

console.log(obj.a);
console.log(obj.b);
console.log(obj.c);
console.log(obj.d);
console.log(obj.e());
console.log(obj.sumNumbers(...nums));