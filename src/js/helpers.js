export function isInRange(value, { min, max }) {
  return value <= max && value >= min;
}

export const createHeights = (maxHeight, minHeight) =>
  Array.from(
    { length: maxHeight + 1 - minHeight },
    (_, i) => minHeight + i
  ).reverse();

export function getStatClass(stat) {
  switch (true) {
    case stat <= 69:
      return 'stat-0-69';
    case stat >= 70 && stat < 75:
      return 'stat-70-74';
    case stat >= 75 && stat < 80:
      return 'stat-75-79';
    case stat >= 80 && stat < 85:
      return 'stat-80-84';
    case stat >= 85 && stat < 90:
      return 'stat-85-89';
    case stat >= 90:
      return 'stat-90-100';
    default:
      return '';
  }
}
