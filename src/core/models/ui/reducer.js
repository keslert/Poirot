import * as types from './action-types';
import uniq from 'lodash/uniq';

const uiState = () => ({
  visible: [],
});

export function uiReducer(state = uiState(), { payload, type }) {
  switch (type) {

    case types.TOGGLE_VISIBLE:
      console.log(payload)
      const newState = Object.assign({}, state, {
        visible: uniq([...state.visible, ...payload]).filter(item => 
          !state.visible.includes(item) || !payload.includes(item)
        )
      });
      console.log(newState)
      return newState;

    default:
      return state;

  }
}