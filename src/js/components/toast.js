import { LitElement, html, svg } from 'lit';

import toastStyle from '../../scss/toast.scss';

class Toast extends LitElement {
  static get styles() {
    return [toastStyle];
  }

  static properties = {
    labelText: { type: String },
    actionText: { type: String },
    opened: { type: Boolean },
  };

  constructor() {
    super();

    this.labelText = '';

    this.actionText = '';

    this.opened = false;

    this.animationFrame = 0;

    this.animationTimer = 0;

    this.autoDismissTimer = 0;

    this.autoDismissTimeoutMs = 5000;

    this.addEventListener('keydown', this.handleKeyDown.bind(this));
  }

  connectedCallback() {
    super.connectedCallback();
    this.open();
  }

  render() {
    return html`
      <div class="container">
        <div class="label">${this.labelText}</div>
        <div class="actions">
          <button class="action" @click=${this.actionClick}>
            ${this.actionText}
          </button>
          <button class="dismiss" @click=${this.closeIconClick}>
            ${svg`
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path d="M0 0h24v24H0V0z" fill="none" />
              <path
                d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"
              />
            </svg>
          `}
          </button>
        </div>
      </div>
    `;
  }

  open() {
    this.clearAutoDismissTimer();
    this.opened = true;

    this.classList.remove('closing');
    this.classList.add('opening');

    // Wait a frame once display is no longer "none", to establish basis for animation
    this.runNextAnimationFrame(() => {
      this.classList.add('open');

      this.animationTimer = setTimeout(() => {
        this.handleAnimationTimerEnd();

        if (this.autoDismissTimeoutMs !== -1) {
          this.autoDismissTimer = setTimeout(() => {
            this.close('dismiss');
          }, this.autoDismissTimeoutMs);
        }
      }, 150);
    });
  }

  close(reason = '') {
    if (!this.opened) {
      // Avoid redundant close calls (and events), e.g. repeated interactions as the toast is animating closed
      return;
    }

    cancelAnimationFrame(this.animationFrame);
    this.animationFrame = 0;
    this.clearAutoDismissTimer();

    this.opened = false;
    this.classList.add('closing');
    this.classList.remove('open');
    this.classList.remove('opening');

    clearTimeout(this.animationTimer);

    this.animationTimer = setTimeout(() => {
      this.handleAnimationTimerEnd();

      this.notifyClosed(reason);
    }, 75);
  }

  clearAutoDismissTimer() {
    clearTimeout(this.autoDismissTimer);

    this.autoDismissTimer = 0;
  }

  handleAnimationTimerEnd() {
    this.animationTimer = 0;

    this.classList.remove('opening');

    this.classList.remove('closing');
  }

  /**
   * Runs the given logic on the next animation frame, using setTimeout to factor in Firefox reflow behavior.
   */
  runNextAnimationFrame(callback) {
    cancelAnimationFrame(this.animationFrame);

    this.animationFrame = requestAnimationFrame(() => {
      this.animationFrame = 0;
      clearTimeout(this.animationTimer);
      this.animationTimer = setTimeout(callback, 0);
    });
  }

  notifyClosed(reason) {
    this.dispatchEvent(
      new CustomEvent('toast:closed', {
        bubbles: true,
        composed: true,
        cancelable: true,
        detail: { reason },
      })
    );

    this.remove();
  }

  handleKeyDown(evt) {
    const isEscapeKey = evt.key === 'Escape' || evt.keyCode === 27;

    if (isEscapeKey) {
      this.close('dismiss');
    }
  }

  actionClick() {
    this.close('action');
  }

  closeIconClick() {
    this.close('dismiss');
  }
}

customElements.define('balv3-toast', Toast);
