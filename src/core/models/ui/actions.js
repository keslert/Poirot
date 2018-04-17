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

export function setSelectedControl(key) {
  return {
    type: types.SET_SELECTED_CONTROL,
    payload: key,
  }
}

export function setSelectionMode(mode) {
  return {
    type: types.SET_SELECTION_MODE,
    payload: mode,
  }
}

export function setEditingNode(editing) {
  return {
    type: types.SET_EDITING_NODE,
    payload: editing,
  }
}

export function setMouseInsideMenu(inside) {
  return {
    type: types.SET_MOUSE_INSIDE_MENU,
    payload: inside,
  }
}

export function toggleShowSpacing() {
  return {
    type: types.TOGGLE_SHOW_SPACING,
  }
}

export function toggleShowRedline() {
  return {
    type: types.TOGGLE_SHOW_REDLINE,
  }
}

export function toggleHideChanges() {
  return {
    type: types.TOGGLE_HIDE_CHANGES,
  }
}

export function toggleCustomControl(key) {
  return {
    type: types.TOGGLE_CUSTOM_CONTROL,
    payload: key,
  }
}