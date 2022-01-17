/* eslint-disable no-underscore-dangle */
import { POSITIONS, STYLES } from '../../config/params';

export default class Controller {
  stats;

  error;

  callId = 0;

  status = 'pending';

  initial = true;

  url = new URL(window.document.URL);

  constructor(host) {
    const { position, style, height } = Object.fromEntries(
      this.url.searchParams
    );

    this.position = position || 'GK';
    this.style = style || 'phy';
    this.height = height || 180;

    if (this.url.toString() !== window.document.URL) {
      window.history.replaceState({}, '', this.url.toString());
    }

    (this.host = host).addController(this);
  }

  get position() {
    return this._position;
  }

  set position(value) {
    const newPosition = value?.toUpperCase();

    if (POSITIONS.includes(newPosition)) {
      this._position = newPosition;

      return;
    }

    this._position = 'GK';

    this.url.searchParams.delete('position');
  }

  get style() {
    return this._style;
  }

  set style(value) {
    const newStyle = value?.toLowerCase();

    if (STYLES.includes(newStyle)) {
      this._style = newStyle;

      return;
    }

    this._style = 'phy';

    this.url.searchParams.delete('style');
  }

  get height() {
    return this._height;
  }

  set height(value) {
    const newHeight = Number(value);

    if (!Number.isNaN(newHeight)) {
      this._height = newHeight;

      return;
    }

    this._height = 180;

    this.url.searchParams.delete('height');
  }

  hostConnected() {
    this.host.addEventListener('onSelectChange', this.onChange.bind(this));

    this.host.addEventListener('toast:closed', this.onToastClosed.bind(this));
  }

  hostDisconnected() {
    this.host.removeEventListener('onSelectChange', this.onChange.bind(this));

    this.host.removeEventListener(
      'toast:closed',
      this.onToastClosed.bind(this)
    );
  }

  async loadStats() {
    this.error = undefined; // reinitialize error

    this.status = 'pending';

    if (this.initial === false) {
      this.host.requestUpdate();
    } else {
      this.initial = false;
    }

    // eslint-disable-next-line no-plusplus
    const key = ++this.callId;

    const data = await this.fetchData();

    // If this is not the most recent task call, don't process.
    if (this.callId !== key) {
      return;
    }

    if (!this.error) {
      this.status = 'complete';

      this.stats = data;

      this.setValidHeight();
    } else {
      this.status = 'error';
    }

    this.host.requestUpdate();
  }

  onChange(e) {
    const { id, value } = e.detail;

    this[id] = value;

    this.url.searchParams.set(id, value);

    window.history.replaceState({}, '', this.url.toString());

    this.loadStats();
  }

  onToastClosed(event) {
    const { detail } = event;

    if (detail?.reason === 'action') {
      this.loadStats(); // clicked on retry button
    }
  }

  setValidHeight() {
    if (this.height === this.stats.height) {
      return;
    }

    this.url.searchParams.set('height', this.stats.height);

    window.history.replaceState({}, '', this.url.toString());

    this.height = this.stats.height;
  }

  async fetchData() {
    try {
      const resp = await fetch(
        `/api/bal?${new URLSearchParams({
          position: this.position,
          style: this.style,
          height: this.height,
        })}`
      );

      if (!resp.ok) {
        throw resp;
      }

      return resp.json();
    } catch (e) {
      return this.handleFetchError(e);
    }
  }

  async handleFetchError(e) {
    let jsonBody;

    if (typeof e.json !== 'function') {
      this.error = {
        message: e.message, // Fetch error
      };

      return;
    }

    try {
      jsonBody = await e.json(); // Json body from API response
    } catch (jsonParseError) {
      this.error = {
        message: 'Unable to retrieve stats data', // Generic error from API
      };

      return;
    }

    this.error = {
      message: jsonBody.error.message,
      data: jsonBody.data,
    };
  }
}
