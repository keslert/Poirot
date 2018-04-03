import * as types from './action-types';
import uniq from 'lodash/uniq';

const uiState = () => ({
  visible: [],
  selectedElements: [],
  editingElement: false,
  showSpacing: false,
});

export function uiReducer(state = uiState(), { payload, type }) {
  switch (type) {

    case types.TOGGLE_VISIBLE:
      return Object.assign({}, state, {
        visible: uniq([...state.visible, ...payload]).filter(item => 
          !state.visible.includes(item) || !payload.includes(item)
        )
      });
    
    case types.TOGGLE_SELECTED_ELEMENTS:
      return Object.assign({}, state, {
        selectedElements: uniq([...state.selectedElements, ...payload]).filter(item =>
          !state.selectedElements.includes(item) || !payload.includes(item)
        )
      });
    
    case types.SET_EDITING_ELEMENT:
      return Object.assign({}, state, { editingElement: payload })

    case types.SET_SELECTED_ELEMENTS:
      return Object.assign({}, state, {selectedElements: payload})

    case types.TOGGLE_SHOW_SPACING:
      return Object.assign({}, state, {showSpacing: !state.showSpacing})

    default:
      return state;

  }
}