$(startApp);

function startApp() {
  registerEventListeners();
}

function registerEventListeners() {
  profileMenuListener();
}

function profileMenuListener() {
  $('body').on('click', '.js-avatar', () => {
    toggleProfileMenu();
  });
}

function toggleProfileMenu() {
  $('.js-profile-options').toggleClass('profile-options--toggle-visibility');
}