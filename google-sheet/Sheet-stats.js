/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
const {
  DOC_ID_BASE,
  SHEET_NAME_BASE,
  SHEET_NAME_HEIGHT,
  SHEET_NAME_STYLE,
  MAX_HEIGHT,
  MAX_HEIGHT_ROW,
  GLOBAL_RANGES,
  AVG_WEIGHT_COLUMN,
  MKII_COLUMNS,
  HEIGHT_ROWS,
  STYLES_RANGES,
  MAX_OVR,
} = require('./constants');

const { POSITIONS } = require('../config/params');

module.exports = class GoogleSheetStats {
  /**
   *
   * @param {import('@googleapis/sheets').sheets_v4.Sheets} sheetService
   * @param {string} position
   */
  constructor(sheetService, position) {
    this.sheetService = sheetService;

    this.position = position;
  }

  get position() {
    return this._position;
  }

  set position(value) {
    if (!value) {
      throw new Error('position is required');
    }

    if (!POSITIONS.includes(value)) {
      throw new Error(`invalid position "${value}"`);
    }

    this._position = value;
  }

  async getData() {
    if (this.data) {
      return this.data;
    }

    // console.log('request to Google Sheet API');

    const res = await this.sheetService.spreadsheets.values.batchGet({
      spreadsheetId: DOC_ID_BASE,
      majorDimension: 'COLUMNS',
      valueRenderOption: 'UNFORMATTED_VALUE',
      ranges: [
        this.getGlobalA1Range(),
        this.getAvgWeightsA1Range(),
        ...Object.values(this.getMKIIA1Ranges()),
        ...Object.values(this.getStylesA1Ranges()),
      ],
    });

    this.data = res.data;

    // console.log('successful response from Google Sheet API');

    return this.data;
  }

  async getGlobal() {
    if (this.globalStats) {
      return this.globalStats;
    }

    const data = await this.getData();

    const { values } = data.valueRanges.find(
      (valueRange) => valueRange.range === this.getGlobalA1Range()
    );

    if (!values) {
      throw new Error('Could not get global min and max values');
    }

    const [min, max] = values;

    this.globalStats = {
      min,
      max,
    };

    return this.globalStats;
  }

  getMaxOverall() {
    return MAX_OVR[this.position];
  }

  getMinMaxHeight() {
    if (this.heights) {
      return this.heights;
    }

    const { start, end } = HEIGHT_ROWS[this.position];

    const min = MAX_HEIGHT_ROW + (MAX_HEIGHT - end);
    const max = MAX_HEIGHT_ROW + (MAX_HEIGHT - start);

    this.heights = {
      min,
      max,
    };

    return this.heights;
  }

  async getMKII() {
    if (this.MKII) {
      return this.MKII;
    }

    const data = await this.getData();

    this.MKII = {};

    Object.entries(this.getMKIIA1Ranges()).forEach(([attribute, range]) => {
      const { values } = data.valueRanges.find(
        (valueRange) => valueRange.range === range
      );

      if (!values) {
        throw new Error('Could not get MKII values');
      }

      [this.MKII[attribute]] = values;
    });

    return this.MKII;
  }

  async getStyles() {
    if (this.styles) {
      return this.styles;
    }

    const data = await this.getData();

    this.styles = {};

    Object.entries(this.getStylesA1Ranges()).forEach(([style, range]) => {
      const { values } = data.valueRanges.find(
        (valueRange) => valueRange.range === range
      );

      if (!values) {
        throw new Error('Could not get styles values');
      }

      [this.styles[style]] = values;
    });

    return this.styles;
  }

  async getAvgWeights() {
    if (this.avgWeights) {
      return this.avgWeights;
    }

    const data = await this.getData();

    const { values } = data.valueRanges.find(
      (valueRange) => valueRange.range === this.getAvgWeightsA1Range()
    );

    if (!values) {
      throw new Error('Could not get average weights values');
    }

    [this.avgWeights] = values;

    return this.avgWeights;
  }

  getGlobalA1Range() {
    return `${SHEET_NAME_BASE}!${GLOBAL_RANGES[this.position]}`;
  }

  getMKIIA1Ranges() {
    const ranges = {};

    const { start, end } = HEIGHT_ROWS[this.position];

    Object.entries(MKII_COLUMNS[this.position]).forEach(
      ([attribute, column]) => {
        ranges[
          attribute
        ] = `${SHEET_NAME_HEIGHT}!${column}${start}:${column}${end}`;
      }
    );

    return ranges;
  }

  getStylesA1Ranges() {
    const ranges = {};

    Object.entries(STYLES_RANGES[this.position]).forEach(
      ([style, styleRange]) => {
        ranges[style] = `${SHEET_NAME_STYLE}!${styleRange}`;
      }
    );

    return ranges;
  }

  getAvgWeightsA1Range() {
    const column = AVG_WEIGHT_COLUMN[this.position];
    const { start, end } = HEIGHT_ROWS[this.position];

    return `${SHEET_NAME_HEIGHT}!${column}${start}:${column}${end}`;
  }
};
