import * as types from './action-types';

const pageState = () => ({
  textNodes: [],
});

export function pageReducer(state = pageState(), { payload, type }) {
  switch (type) {

    case types.ADD_PAGE:
      return Object.assign({}, state, {
        textNodes: payload.textNodes,
      });

    default:
      return state;

  }
}