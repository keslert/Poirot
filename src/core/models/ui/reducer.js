import * as types from './action-types';
import uniq from 'lodash/uniq';

const uiState = () => ({
  customControl: {},
  editingNode: false,
  showSpacing: false,
  showRedline: false,
  hideChanges: false,
  selectedControl: null,
  selectedNode: null,
  selectionMode: 'individual',
  visible: [],
  mouseInsideMenu: false,
});

export function uiReducer(state = uiState(), { payload, type }) {
  switch (type) {

    case types.TOGGLE_VISIBLE:
      return Object.assign({}, state, {
        visible: uniq([...state.visible, ...payload]).filter(item => 
          !state.visible.includes(item) || !payload.includes(item)
        )
      });
    
    case types.SET_EDITING_NODE:
      return Object.assign({}, state, {editingNode: payload})

    case types.SET_SELECTION_MODE:
    return Object.assign({}, state, {selectionMode: payload})

    case types.SET_SELECTED_NODE:
      return Object.assign({}, state, {selectedNode: payload})

    case types.SET_SELECTED_CONTROL:
      return Object.assign({}, state, {selectedControl: payload})

    case types.SET_MOUSE_INSIDE_MENU:
    return Object.assign({}, state, {mouseInsideMenu: payload})

    case types.TOGGLE_SHOW_SPACING:
      return Object.assign({}, state, {showSpacing: !state.showSpacing})

    case types.TOGGLE_HIDE_CHANGES:
      return Object.assign({}, state, { hideChanges: payload !== undefined ? payload : !state.hideChanges })

    case types.TOGGLE_SHOW_REDLINE:
      return Object.assign({}, state, { showRedline: !state.showRedline })

    case types.TOGGLE_CUSTOM_CONTROL:
      return Object.assign({}, state, { customControl: {
        ...state.customControl,
        [payload]: !state.customControl[payload],
      }})


    default:
      return state;

  }
}