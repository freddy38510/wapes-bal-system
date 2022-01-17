import { LitElement, html } from 'lit';
import { POSITIONS, STYLES } from '../../../config/params';
import { isInRange, createHeights } from '../helpers';
import sharedStyle from '../../scss/shared.scss';
import paramsStyle from '../../scss/params.scss';

const heights = createHeights(195, 163);

export default class Params extends LitElement {
  static properties = {
    position: { state: true },
    balStyle: { state: true },
    height: { state: true },
    heightMin: { state: true },
    heightMax: { state: true },
    loading: { state: true },
  };

  positionChanged = true;

  static get styles() {
    return [sharedStyle, paramsStyle];
  }

  positionClasses(position = this.position) {
    switch (true) {
      case position === 'GK':
        return 'orange';
      case ['CB', 'L/RB'].includes(position):
        return 'blue';
      case ['DMF', 'CMF', 'L/RMF', 'AMF'].includes(position):
        return 'green';
      case ['L/RWF', 'SS', 'CF'].includes(position):
        return 'red';
      default:
        return 'orange'; // assume default selected value is GK
    }
  }

  render() {
    return html`<header @change=${this.changeHandler}>
      <div class="item">
        <p class="select">
          <select
            id="position"
            class=${this.positionClasses()}
            aria-label="Position"
          >
            ${POSITIONS.map(
              (position) => html` <option
                ?selected=${this.position === position}
                class=${this.positionClasses(position)}
              >
                ${position}
              </option>`
            )}
          </select>
        </p>
      </div>
      <div class="item">
        <p class="select">
          <select id="style" aria-label="Style">
            ${STYLES.map(
              (style) =>
                html`<option
                  ?selected=${this.balStyle === style}
                  value=${style}
                >
                  ${style.toUpperCase()}
                </option>`
            )}
          </select>
        </p>
      </div>
      <div class="item">
        <p
          class="select ${this.positionChanged && this.loading
            ? 'is-loading'
            : undefined}"
        >
          <select id="height" aria-label="Height">
            ${heights.map(
              (height) =>
                html`<option
                  ?disabled=${!isInRange(height, {
                    min: this.heightMin,
                    max: this.heightMax,
                  })}
                  ?selected=${this.height === height}
                  value=${height}
                >
                  <span>${height} <span class="unit">cm</span></span>
                </option>`
            )}
          </select>
        </p>
      </div>
    </header>`;
  }

  changeHandler(e) {
    const { id, value } = e.target;

    this.positionChanged = id === 'position';

    this.dispatchEvent(
      new CustomEvent('onSelectChange', {
        detail: { id, value },
        bubbles: true,
        composed: true,
      })
    );
  }
}

customElements.define('balv3-params', Params);
