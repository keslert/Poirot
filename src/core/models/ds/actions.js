import * as types from './action-types';
import { normalizeColor } from '../../utils/color';

export function addDS(ds) {
  
  return {
    type: types.ADD_DS,
    payload: buildDSObject(ds),
  }
}

export function updateDSTypography(keys, changeset) {
  return {
    type: types.OVERWRITE_DS_TYPOGRAPHY,
    payload: {keys, changeset}
  }
}

export function buildDSObject(ds) {

  const swatches = _.mapValues(ds.colors.swatches, swatch => ({
    ...swatch,
    colors: _.chain(swatch.colors)
              .map(color => ({...color, value: normalizeColor(color.value)}))
              .sortBy(color => color.base)
              .value()
  }))

  return {
    _original: JSON.parse(JSON.stringify(ds)),
    typography: {
      ...ds.typography,
      overwrites: {},
      categories: [
        ...ds.typography.categories,
        {label: 'Unknown', groups: []},
      ]
    },
    colors: {
      ...ds.colors,
      swatches,
      flattened: _.flatMap(swatches, (swatch, swatchKey) => swatch.colors.map((color, i) => ({
        ...color,
        index: i,
        swatchKey,
      })))
    },
    spacing: ds.spacing,
    shadows: {
      ...ds.shadows,
      defaults: ['none', ...ds.shadows.defaults],
    }
  }
}