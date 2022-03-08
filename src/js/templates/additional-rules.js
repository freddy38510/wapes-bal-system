import { html } from 'lit';

export default (position) =>
  html` <div class="card additional-rules">
    <div class="card-header">
      <h2>Additional Rules</h2>
    </div>
    <div class="card-body">
      <ul>
        <li>
          <span class="item">
            Up to <strong>5</strong> points for <em>Acceleration</em> on/below
            top of <em>Speed</em>
          </span>
        </li>
        <li>
          <span class="item">
            ${position !== 'GK'
              ? html`Up to <strong>6</strong> skill cards`
              : html`Up to <strong>3</strong> GK + <strong>3</strong> field player skill cards</li>`}
          </span>
        </li>
        <li>
          <span class="item"> Forbidden skill cards : </span>
          <ul>
            <li>
              <span class="item">
                <s class="em danger">Gamesmanship</s>
              </span>
            </li>
            <li>
              <span class="item">
                <s class="em danger">Man Marking</s>
              </span>
            </li>
            <li>
              <span class="item">
                <s class="em danger">Track Back</s>
              </span>
            </li>
            <li>
              <span class="item">
                <s class="em danger">Captaincy</s>
              </span>
            </li>
            <li>
              <span class="item">
                <s class="em danger">Fighting Spirit</s>
              </span>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </div>`;
