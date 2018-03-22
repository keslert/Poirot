import * as types from './action-types';

export function addDS(ds) {
  
  return {
    type: types.ADD_DS,
    payload: buildDSObject(ds),
  }
}

export function updateDSTypography(keys, changes) {
  return {
    type: types.UPDATE_DS_TYPOGRAPHY,
    payload: {keys, changes}
  }
}

export function buildDSObject(ds) {
  return {
    _original: JSON.parse(JSON.stringify(ds)),
    typography: {
      ...ds.typography,
      categories: [
        ...ds.typography.categories,
        {label: 'Unknown', groups: []},
      ]
    }
  }
}