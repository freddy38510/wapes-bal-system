import { html, svg } from 'lit';
import timestamp from '../../../data/timestamp';
import { version } from '../../../package.json';

const date = new Date(timestamp).toLocaleDateString('en-US');

export default html` <footer class="page-footer">
  <div class="container">
    <div class="footer-content">
      <div class="no-print">
        <p>
          Developed by
          <a
            href="https://github.com/freddy38510"
            target="_blank"
            rel="noopener noreferrer"
            ><span>Freddy Escobar</span>
            <span>
              ${svg`
              <svg class="q-icon" aria-hidden="true" role="presentation" viewBox="0 0 24 24">
                <path
                  d="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z">
                </path>
              </svg>`}
            </span>
          </a>
        </p>
        <p>
          For the
          <a
            href="https://www.wapesleague.com/"
            target="_blank"
            rel="noopener noreferrer"
            ><span>WAPES League</span>
            <span>
              ${svg`
              <svg class="q-icon" aria-hidden="true" role="presentation" viewBox="0 0 24 24">
                <path
                  d="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z">
                </path>
              </svg>`}
            </span>
          </a>
          &nbsp;community.
        </p>
      </div>
      <div>
        <p>App version: <em>v${version}</em></p>
        <p>
          Last data update:
          <em>
            <time datetime=${timestamp}>${date}</time>
          </em>
        </p>
      </div>
    </div>
  </div>
</footer>`;
