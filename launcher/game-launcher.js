class GameLauncher extends HTMLElement {
  constructor() {
    super();
    this.revealTimer = null;
    this.handleMessage = this.handleMessage.bind(this);
  }

  connectedCallback() {
    const gameUrl = this.getAttribute('src');

    if (!gameUrl) {
      this.remove();
      return;
    }

    let parsedGameUrl;

    try {
      parsedGameUrl = new URL(gameUrl, window.location.href);
    } catch {
      this.remove();
      return;
    }

    const shadow = this.attachShadow({ mode: 'open' });

    shadow.innerHTML = `
    <style>
      .overlay {
        position: fixed;
        inset: 0;
        z-index: 999999;
        background: #ffffff;
      }

      .loader {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 48px;
        height: 48px;
        border: 5px solid #bdbdbd;
        border-top-color: #333333;
        border-radius: 50%;
        transform: translate(-50%, -50%);
        animation: spin 0.8s linear infinite;
      }

      @keyframes spin {
        to {
          transform:
            translate(-50%, -50%)
            rotate(360deg);
        }
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

    window.addEventListener('message', this.handleMessage);
    this.iframe.src = parsedGameUrl.href;
  }

  handleMessage(event) {
    if (event.source !== this.iframe?.contentWindow) {
      return;
    }

    if (event.data?.type === 'GAME_READY') {
      clearTimeout(this.revealTimer);

      this.revealTimer = setTimeout(() => {
        this.loader?.remove();
        this.iframe?.classList.add('ready');

        this.iframe?.focus();
        this.iframe?.contentWindow?.focus();

        this.revealTimer = null;
      }, 500);

      return;
    }

    if (event.data?.type === 'GAME_CLOSE') {
      this.remove();
    }
  }

  disconnectedCallback() {
    window.removeEventListener('message', this.handleMessage);
    clearTimeout(this.revealTimer);
  }
}

if (!customElements.get('game-launcher')) {
  customElements.define('game-launcher', GameLauncher);
}
