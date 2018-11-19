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

import string from './test';

console.log(string());