window.parent.postMessage({ type: 'GAME_READY' }, '*');

const exitButton = document.querySelector('#exit-button');

exitButton.addEventListener('click', () => {
  window.parent.postMessage({ type: 'GAME_CLOSE' }, '*');
});
