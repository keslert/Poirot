import * as types from './action-types';
import difference from 'lodash/difference';

export function toggleVisible(keys) {
  return {
    type: types.TOGGLE_VISIBLE,
    payload: keys,
  }
}

export function setSelectedNode(uid) {
  return {
    type: types.SET_SELECTED_NODE,
    payload: uid,
  }
}

export function setEditingNode(editing) {
  return {
    type: types.SET_EDITING_NODE,
    payload: editing,
  }
}

export function toggleShowSpacing() {
  return {
    type: types.TOGGLE_SHOW_SPACING,
  }
}