import { LitElement, html, nothing } from 'lit';
import { getStatClass } from '../helpers';
import sharedStyle from '../../scss/shared.scss';
import tableStyle from '../../scss/table.scss';

export default class Table extends LitElement {
  static properties = {
    min: { state: true },
    max: { state: true },
    styleInfluence: { state: true },
    maxOverall: { state: true },
    weightMin: { state: true },
    weightMax: { state: true },
    loading: { state: true },
  };

  static get styles() {
    return [sharedStyle, tableStyle];
  }

  arrowTemplate(idx) {
    if (!this.styleInfluence[idx]) {
      return nothing;
    }

    return html`<span class="cell-icon">
      <img
        src=${this.styleInfluence[idx] === 'up'
          ? "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewbox='0 0 16 16'%3e %3cpath d='m0.92525 0 15.075 4e-7 1e-6 15.074-2.6883-0.04419v-10.489l-11.46 11.46-1.8514-1.8513 11.46-11.46-10.534-0.044192z' fill='%23085e08' stroke-width='1.3297' /%3e %3c/svg%3e"
          : "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewbox='0 0 16 16'%3e %3cpath d='m16 0.92525v15.075l-15.074 1e-6 0.04419-2.6883h10.489l-11.46-11.46 1.8513-1.8514 11.46 11.46 0.04419-10.534z' fill='%23a80b0b' stroke-width='1.3297' /%3e %3c/svg%3e"}
        class="arrow down icon"
        alt=${this.styleInfluence[idx] === 'up'
          ? 'green arrow up right'
          : 'red arrow down right'}
        aria-describedby="arrow-${this.styleInfluence[idx]}-desc"
      />
    </span>`;
  }

  statCellContentTemplate(statType, idx, MKII) {
    if (!this[statType]?.[idx]) {
      return html` <span class="stat"></span> `;
    }

    return html`
      <span
        class="stat ${getStatClass(this[statType][idx])} ${MKII
          ? 'stat-MKII'
          : ''}"
        aria-describedby="${MKII ? 'MKII-desc' : nothing}"
      >
        ${this[statType][idx]}
      </span>
      ${statType === 'max' ? this.arrowTemplate(idx) : nothing}
    `;
  }

  statCellsTemplate(idx, MKII = null) {
    return html` <td>
        ${this.statCellContentTemplate('min', idx, MKII === 'min')}
      </td>
      <td>${this.statCellContentTemplate('max', idx, MKII === 'max')}</td>
      <td>${this.max?.[idx] ? this.max[idx] - this.min[idx] : nothing}</td>`;
  }

  render() {
    return html`
      <table
        class=${this.loading ? 'loading' : undefined}
        aria-describedby="summary"
      >
        <thead>
          <tr>
            <th scope="col" class="col-group">
              <span class="visually-hidden">Group</span>
            </th>
            <th scope="col" class="col-attrs">Attribute</th>
            <th scope="col" class="col-min">Min</th>
            <th scope="col" class="col-max">Max</th>
            <th scope="col" class="col-diff">Diff</th>
          </tr>
          <tr class="progress">
            <th colspan="5">
              <div
                class="linear-progress"
                role="progressbar"
                aria-label="Loading stats"
                aria-valuemin="0"
                aria-valuemax="1"
              >
                <div></div>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="rowgroup"></th>
            <th scope="row">Overall Rating</th>
            <td></td>
            <td>
              <span class="stat ${getStatClass(this.maxOverall)}">
                ${this.maxOverall}
              </span>
            </td>
            <td></td>
          </tr>
        </tbody>
        <tbody>
          <tr>
            <th rowspan="8" scope="rowgroup">
              <span class="vertical-text">
                <abbr title="Technicality">TQ</abbr>
              </span>
            </th>
            <th scope="row">Offensive Awareness</th>
            ${this.statCellsTemplate(0)}
          </tr>
          <tr>
            <th scope="row">Ball Control</th>
            ${this.statCellsTemplate(1)}
          </tr>
          <tr>
            <th scope="row">Dribbling</th>
            ${this.statCellsTemplate(2)}
          </tr>
          <tr>
            <th scope="row">Tight Possession</th>
            ${this.statCellsTemplate(3)}
          </tr>
          <tr>
            <th scope="row">Low Pass</th>
            ${this.statCellsTemplate(4)}
          </tr>
          <tr>
            <th scope="row">Lofted Pass</th>
            ${this.statCellsTemplate(5)}
          </tr>
          <tr>
            <th scope="row">Finishing</th>
            ${this.statCellsTemplate(6)}
          </tr>
          <tr>
            <th scope="row">Heading</th>
            ${this.statCellsTemplate(7, 'min')}
          </tr>
        </tbody>
        <tbody>
          <tr>
            <th rowspan="2" scope="rowgroup">
              <span class="vertical-text">
                <abbr title="Free-Kick">FK</abbr>
              </span>
            </th>
            <th scope="row">Set Piece Taking</th>
            ${this.statCellsTemplate(8)}
          </tr>
          <tr>
            <th scope="row">Curl</th>
            ${this.statCellsTemplate(9)}
          </tr>
        </tbody>
        <tbody>
          <tr>
            <th rowspan="7" scope="rowgroup">
              <span class="vertical-text">
                <abbr title="Physicality">PHY</abbr>
              </span>
            </th>
            <th scope="row">Speed</th>
            ${this.statCellsTemplate(10, 'max')}
          </tr>
          <tr>
            <th scope="row">Acceleration</th>
            ${this.statCellsTemplate(11, 'max')}
          </tr>
          <tr>
            <th scope="row">Kicking Power</th>
            ${this.statCellsTemplate(12)}
          </tr>
          <tr>
            <th scope="row">Jump</th>
            ${this.statCellsTemplate(13, 'max')}
          </tr>
          <tr>
            <th scope="row">Physical Contact</th>
            ${this.statCellsTemplate(14, 'max')}
          </tr>
          <tr>
            <th scope="row">Balance</th>
            ${this.statCellsTemplate(15, 'max')}
          </tr>
          <tr>
            <th scope="row">Stamina</th>
            ${this.statCellsTemplate(16)}
          </tr>
        </tbody>
        <tbody>
          <tr>
            <th rowspan="3" scope="rowgroup">
              <span class="vertical-text">
                <abbr title="Defending">DEF</abbr>
              </span>
            </th>
            <th scope="row">Defensive Awareness</th>
            ${this.statCellsTemplate(17)}
          </tr>
          <tr>
            <th scope="row">Ball Winning</th>
            ${this.statCellsTemplate(18)}
          </tr>
          <tr>
            <th scope="row">Aggression</th>
            ${this.statCellsTemplate(19)}
          </tr>
        </tbody>
        <tbody>
          <tr>
            <th rowspan="5" scope="rowgroup">
              <span class="vertical-text">
                <abbr title="Goalkeeping">GK</abbr>
              </span>
            </th>
            <th scope="row">GK Awareness</th>
            ${this.statCellsTemplate(20)}
          </tr>
          <tr>
            <th scope="row">GK Catching</th>
            ${this.statCellsTemplate(21)}
          </tr>
          <tr>
            <th scope="row">GK Clearing</th>
            ${this.statCellsTemplate(22)}
          </tr>
          <tr>
            <th scope="row">GK Reflexes</th>
            ${this.statCellsTemplate(23)}
          </tr>
          <tr>
            <th scope="row">GK Reach</th>
            ${this.statCellsTemplate(24)}
          </tr>
        </tbody>
        <tbody>
          <tr class="weight-row">
            <th rowspan="1" scope="rowgroup"></th>
            <th scope="row">Weight <span class="unit">(kg)</span></th>
            <td>${this.weightMin || nothing}</td>
            <td>${this.weightMax || nothing}</td>
            <td>
              ${this.weightMax ? this.weightMax - this.weightMin : nothing}
            </td>
          </tr>
        </tbody>
      </table>
    `;
  }
}

customElements.define('balv3-table', Table);
