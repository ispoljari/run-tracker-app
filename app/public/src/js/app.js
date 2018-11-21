/*  ------ JQUERY ----- */ 

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



/*  ------ PURE JS ----- */ 

// App Controller

// Enable live reloading of HTML and CSS while in development mode. 
// Implemented using .env global variables -> Setup with NPM (--env.NODE_ENV=dev) and compiled with webpack (webpack.DefinePlugin) 

if (process.env.NODE_ENV === 'dev') {
  require('../index.html');
  require('../../dist/css/main.css');
}

