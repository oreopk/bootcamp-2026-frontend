class GameLauncher extends HTMLElement {
  constructor() {
    super();
    this.revealTimer = null;

    this.scrollPosition = 0;
    this.originalBodyStyles = null;

    this.handleMessage = this.handleMessage.bind(this);

    this.preventWheel = (event) => {
      event.preventDefault();
    };

    this.preventPinch = (event) => {
      if (event.touches.length > 1) {
        event.preventDefault();
      }
    };

    this.preventGesture = (event) => {
      event.preventDefault();
    };
  }

  lockPage() {
    this.scrollPosition = window.scrollY;

    this.originalBodyStyles = {
      position: document.body.style.position,
      top: document.body.style.top,
      width: document.body.style.width,
      overflow: document.body.style.overflow,
      paddingRight: document.body.style.paddingRight,
    };

    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    document.body.style.position = 'fixed';
    document.body.style.top = `-${this.scrollPosition}px`;
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = `${scrollbarWidth}px`;
  }

  unlockPage() {
    if (!this.originalBodyStyles) {
      return;
    }

    document.body.style.position = this.originalBodyStyles.position;
    document.body.style.top = this.originalBodyStyles.top;
    document.body.style.width = this.originalBodyStyles.width;
    document.body.style.overflow = this.originalBodyStyles.overflow;
    document.body.style.paddingRight = this.originalBodyStyles.paddingRight;

    window.scrollTo(0, this.scrollPosition);

    this.originalBodyStyles = null;
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
    this.lockPage();

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

    window.addEventListener('wheel', this.preventWheel, {
      passive: false,
    });

    window.addEventListener('touchmove', this.preventPinch, {
      passive: false,
    });

    window.addEventListener('gesturestart', this.preventGesture);

    window.addEventListener('gesturechange', this.preventGesture);

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

    window.removeEventListener('wheel', this.preventWheel);
    window.removeEventListener('touchmove', this.preventPinch);
    window.removeEventListener('gesturestart', this.preventGesture);
    window.removeEventListener('gesturechange', this.preventGesture);

    clearTimeout(this.revealTimer);

    this.unlockPage();
  }
}

if (!customElements.get('game-launcher')) {
  customElements.define('game-launcher', GameLauncher);
}
