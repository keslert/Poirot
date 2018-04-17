import * as types from './action-types';

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
    colors: ds.colors,
    spacing: ds.spacing,
  }
}