const launchButton = document.querySelector('#launch-button');

launchButton.addEventListener('click', () => {
  if (document.querySelector('game-launcher')) {
    return;
  }

  const launcher = document.createElement('game-launcher');

  launcher.setAttribute('src', '../game/index.html');

  document.body.append(launcher);
});
