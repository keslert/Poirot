import * as types from './action-types';
import difference from 'lodash/difference';

export function toggleVisible(keys) {
  return {
    type: types.TOGGLE_VISIBLE,
    payload: keys,
  }
}

export function toggleSelectedElements(keys) {
  return {
    type: types.TOGGLE_SELECTED_ELEMENTS,
    payload: keys,
  }
}

export function setSelectedElements(keys) {
  return {
    type: types.SET_SELECTED_ELEMENTS,
    payload: keys,
  }
}

export function toggleShowSpacing() {
  return {
    type: types.TOGGLE_SHOW_SPACING,
  }
}