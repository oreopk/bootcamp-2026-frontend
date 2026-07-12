const launchButton = document.querySelector('#launch-button');

launchButton.addEventListener('click', () => {
  if (document.querySelector('game-launcher')) {
    return;
  }

  const launcher = document.createElement('game-launcher');

  document.body.append(launcher);
});
