#!/usr/bin/env node

/* eslint-disable no-console */
const { join } = require('path');
const { writeFile } = require('fs/promises');
const SheetStats = require('../google-sheet/Sheet-stats');
const createSheetApi = require('../google-sheet/sheet-service');
const { POSITIONS } = require('../config/params');

const sheetApi = createSheetApi();

async function getData(position) {
  const sheetService = await sheetApi;

  try {
    const stats = new SheetStats(sheetService, position);

    const { min: globalMin, max: globalMax } = await stats.getGlobal();
    const MKII = await stats.getMKII();
    const styles = await stats.getStyles();
    const avgWeights = await stats.getAvgWeights();
    const { min: heightMin, max: heightMax } = stats.getMinMaxHeight();
    const maxOverall = stats.getMaxOverall();

    return JSON.stringify({
      maxOverall,
      heightMin,
      heightMax,
      avgWeights,
      globalMin,
      globalMax,
      MKII,
      styles,
    });
  } catch (error) {
    console.error(error);

    console.error(`Could not fetch data for position ${position}`);

    throw error;
  }
}

async function generate(position) {
  const data = await getData(position);

  const filePath = join(
    __dirname,
    '../data',
    `${position.replace(/\//, '-').toLowerCase()}.json`
  );

  try {
    await writeFile(filePath, data);
  } catch (e) {
    console.error(e);

    console.error(`Could not write data for position ${position}`);

    throw e;
  }

  console.log(`${filePath} successfully created`);
}

(async () => {
  // run sequentially with a delay of 500ms between each generate(position) call
  await POSITIONS.reduce(async (previousPromise, nextPosition, idx) => {
    await previousPromise;

    if (idx !== 0) {
      console.log('waiting 500ms...');

      await new Promise((resolve) => {
        setTimeout(resolve, 500);
      });
    }

    return generate(nextPosition);
  }, Promise.resolve());

  const stamp = new Date().toISOString();

  await writeFile(
    join(__dirname, '../data/timestamp.js'),
    `export default '${stamp}';`
  );

  process.exit(0);
})();
