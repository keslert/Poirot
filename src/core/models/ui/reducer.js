import * as types from './action-types';
import uniq from 'lodash/uniq';

const uiState = () => ({
  visible: [],
  selectedNode: null,
  editingNode: false,
  showSpacing: false,
  showChanges: true,
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

    case types.SET_SELECTED_NODE:
      return Object.assign({}, state, {selectedNode: payload})

    case types.TOGGLE_SHOW_SPACING:
      return Object.assign({}, state, {showSpacing: !state.showSpacing})

    default:
      return state;

  }
}