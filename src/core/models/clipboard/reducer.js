import * as types from './action-types';

const clipboardState = () => ({
  copyNode: null,
});

export function clipboardReducer(state = clipboardState(), { payload, type }) {
  switch (type) {
    
    case types.ALIAS_SET_COPY_NODE:
      return Object.assign({}, state, {
        copyNode: payload,
      })

    default:
      return state;

  }
}