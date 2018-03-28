import * as types from './action-types';
import uniq from 'lodash/uniq';

const uiState = () => ({
  visible: [],
  selectedElements: [],
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

    case types.SET_SELECTED_ELEMENTS:
      debugger;
      return Object.assign({}, state, {selectedElements: payload})

    default:
      return state;

  }
}