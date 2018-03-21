import * as types from './action-types';

const uiState = () => ({
  visible: ['tony'],
});

export function uiReducer(state = uiState(), { payload, type }) {
  switch (type) {

    case types.ADD_VISIBLE_ITEM:
      return Object.assign({}, state, {
        visible: [...state.visible, payload],
      });

    default:
      return state;

  }
}