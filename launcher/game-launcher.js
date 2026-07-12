class GameLauncher extends HTMLElement {
  constructor() {}
}

if (!customElements.get('game-launcher')) {
  customElements.define('game-launcher', GameLauncher);
}
