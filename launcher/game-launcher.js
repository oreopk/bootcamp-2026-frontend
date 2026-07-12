class GameLauncher extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const shadow = this.attachShadow({ mode: 'open' });

    shadow.innerHTML = `
    <style>
      .overlay {
        position: fixed;
        inset: 0;
        z-index: 999999;
      }

      iframe {
        width: 100%;
        height: 100%;
        border: none;
        opacity: 0;
      }

      iframe.ready {
        opacity: 1;
      }
    </style>

    <div class="overlay">
      <div class="loader"></div>

      <iframe
        title="App"
        sandbox="allow-scripts allow-same-origin"
      ></iframe>
    </div>
  `;

    this.iframe = shadow.querySelector('iframe');
    this.loader = shadow.querySelector('.loader');
  }
}

if (!customElements.get('game-launcher')) {
  customElements.define('game-launcher', GameLauncher);
}
