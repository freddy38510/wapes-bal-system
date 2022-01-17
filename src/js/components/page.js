import { LitElement, html, nothing } from 'lit';
import './params';
import './table';
import './toast';
import tableLegendTemplate from '../templates/table-legend';
import additionalRulesTemplate from '../templates/additional-rules';
import footerTemplate from '../templates/footer';
import Controller from '../controller';
import pageStyle from '../../scss/page.scss';
import sharedStyle from '../../scss/shared.scss';

export default class Page extends LitElement {
  static get styles() {
    return [pageStyle, sharedStyle];
  }

  controller = new Controller(this);

  constructor() {
    super();

    this.controller.loadStats();
  }

  render() {
    return html`
      <h1 class="text-center no-print">WAPES BAL system <sup>v3</sup></h1>
      <p class="subtitle text-center no-print">Create your Legend</p>
      <main class="container">
        <article>
          <div class="stats-container">
            <balv3-params
              .position=${this.controller.position}
              .balStyle=${this.controller.style}
              .height=${this.controller.height}
              .heightMin=${this.controller.stats?.heightMin ||
              this.controller.error?.data?.heightMin}
              .heightMax=${this.controller.stats?.heightMax ||
              this.controller.error?.data?.heightMax}
              .loading=${this.controller.status === 'pending'}
            ></balv3-params>
            <balv3-table
              .min=${this.controller.stats?.min}
              .max=${this.controller.stats?.max}
              .maxOverall=${this.controller.stats?.maxOverall}
              .weightMin=${this.controller.stats?.weightMin}
              .weightMax=${this.controller.stats?.weightMax}
              .styleInfluence=${this.controller.stats?.styleInfluence}
              .loading=${this.controller.status === 'pending'}
            ></balv3-table>
          </div>
          <div>
            <footer>${tableLegendTemplate}</footer>
            <aside>${additionalRulesTemplate(this.controller.position)}</aside>
          </div>
        </article>
      </main>
      ${footerTemplate} ${this.toastTemplate()}
    `;
  }

  toastTemplate() {
    if (this.controller.status !== 'error') {
      return nothing;
    }

    return html`<balv3-toast
      labelText=${this.controller.error.message}
      actionText="retry"
    ></balv3-toast>`;
  }

  async performUpdate() {
    await new Promise((resolve) => {
      setTimeout(() => resolve());
    });

    return super.performUpdate();
  }
}

customElements.define('balv3-page', Page);
