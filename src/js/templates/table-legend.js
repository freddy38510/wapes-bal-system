import { html } from 'lit';

export default html` <div class="card table-legend">
  <div class="card-header">
    <h2>Table Legend</h2>
  </div>
  <div class="card-body">
    <ul id="summary">
      <li id="MKII-desc">
        <span class="item">
          <span
            class="MKII-rect icon"
            role="img"
            aria-label="Blue bordered rectangle"
          ></span>
          <span>Stat modified by selected <em>height</em></span>
        </span>
      </li>
      <li id="arrow-up-desc">
        <span class="item">
          <span class="icon">
            <img
              src="data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewbox='0 0 16 16'%3e %3cpath d='m0.92525 0 15.075 4e-7 1e-6 15.074-2.6883-0.04419v-10.489l-11.46 11.46-1.8514-1.8513 11.46-11.46-10.534-0.044192z' fill='%23085e08' stroke-width='1.3297' /%3e %3c/svg%3e"
              class="arrow"
              alt="green arrow up right"
            />
          </span>
          <span> Stat minimally decreased by selected <em>style</em> </span>
        </span>
      </li>
      <li id="arrow-down-desc">
        <span class="item">
          <span class="icon">
            <img
              src="data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewbox='0 0 16 16'%3e %3cpath d='m16 0.92525v15.075l-15.074 1e-6 0.04419-2.6883h10.489l-11.46-11.46 1.8513-1.8514 11.46 11.46 0.04419-10.534z' fill='%23a80b0b' stroke-width='1.3297' /%3e %3c/svg%3e"
              class="arrow"
              alt="red arrow down right"
            />
          </span>
          <span> Stat highly decreased by selected <em>style</em> </span>
        </span>
      </li>
    </ul>
  </div>
</div>`;
