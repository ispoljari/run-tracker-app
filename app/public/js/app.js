$(startApp);

function startApp() {
  registerEventListeners();
}

function registerEventListeners() {
  profileMenuListener();
}

function profileMenuListener() {
  $('.js-avatar').on('click', function(event) {
    event.stopPropagation();
    toggleProfileMenu();
  });

  $('body').on('click', () => {
    if (profileMenuOpen()) {
      closeProfileMenu();
    }
  });
}

function toggleProfileMenu() {
  $('.js-profile-options').toggleClass('profile-options--toggle-visibility');
}

function profileMenuOpen() {
  return $('.js-profile-options').hasClass('profile-options--toggle-visibility');
}

function closeProfileMenu() {
  $('.js-profile-options').removeClass('profile-options--toggle-visibility');
}