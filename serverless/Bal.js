/* eslint-disable no-underscore-dangle */
/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable no-console */
const {
  SPEED_IDX,
  ACCEL_IDX,
  PHYS_IDX,
  BALANCE_IDX,
  JUMP_IDX,
  HEAD_IDX,
} = require('./MKII-indexes');

const { POSITIONS, STYLES } = require('../config/params');

module.exports = class Bal {
  constructor(position, height, style) {
    this.position = position;
    this.style = style;
    this.height = height;

    try {
      this.data = require(`../data/${this.position
        .replace(/\//, '-')
        .toLowerCase()}.json`);
    } catch (e) {
      console.error(e);

      throw new Error('Data not found');
    }
  }

  get position() {
    return this._position;
  }

  set position(value) {
    if (!value) {
      throw new Error('position is required');
    }

    if (!POSITIONS.includes(value)) {
      throw new Error(`unknown position "${value}"`);
    }

    this._position = value.toUpperCase();
  }

  get style() {
    return this._style;
  }

  set style(value) {
    if (!value) {
      throw new Error('style is required');
    }

    this._style = value.toLowerCase();
  }

  get height() {
    return this._height;
  }

  /**
   * @param {number} value
   */
  set height(value) {
    if (value == null) {
      throw new Error('height is required');
    }

    this._height = value;
  }

  getValidHeight() {
    if (
      this.height >= this.data.heightMin &&
      this.height <= this.data.heightMax
    ) {
      return this.height;
    }

    const a = this.height - this.data.heightMax;
    const b = this.height - this.data.heightMin;

    return Math.abs(a) < Math.abs(b)
      ? this.data.heightMax
      : this.data.heightMin;
  }

  getStats() {
    if (!STYLES.includes(this.style)) {
      throw new Error(`unknown style "${this.style}"`);
    }

    if (Number.isNaN(this.height)) {
      throw new Error(`height must be a Number`);
    }

    const validHeight = this.getValidHeight();
    const heightIndex = this.data.heightMax - validHeight;
    const avgWeight = this.data.avgWeights[heightIndex];

    const stats = {
      min: [...this.data.globalMin],
      max: [...this.data.globalMax],
      maxOverall: this.data.maxOverall,
      heightMin: this.data.heightMin,
      heightMax: this.data.heightMax,
      height: validHeight,
      weightMin: Math.round(avgWeight * 0.94),
      weightMax: Math.round(avgWeight * 1.06),
      styleInfluence: [],
    };

    stats.max[SPEED_IDX] = this.data.MKII.speed[heightIndex];
    stats.max[ACCEL_IDX] = this.data.MKII.accel[heightIndex];
    stats.max[PHYS_IDX] = this.data.MKII.phys[heightIndex];
    stats.max[BALANCE_IDX] = this.data.MKII.balance[heightIndex];
    stats.max[JUMP_IDX] = this.data.MKII.jump[heightIndex];

    stats.min[HEAD_IDX] = this.data.MKII.head[heightIndex];

    this.data.styles[this.style].forEach((value, idx) => {
      if (idx < 20) {
        if (value > -2) {
          stats.styleInfluence[idx] = 'up';
        } else if (value < -5) {
          stats.styleInfluence[idx] = 'down';
        } else {
          stats.styleInfluence[idx] = null;
        }
      }

      if (this.position === 'GK' && idx >= 20) {
        if (value === 0) {
          stats.styleInfluence[idx] = 'up';
        } else if (value < -3) {
          stats.styleInfluence[idx] = 'down';
        } else {
          stats.styleInfluence[idx] = null;
        }
      }

      stats.max[idx] += value;
    });

    // stats.min = stats.min.join();
    // stats.max = stats.max.join();
    // stats.styleInfluence = stats.styleInfluence.join();

    return stats;
  }
};
