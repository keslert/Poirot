import * as types from './action-types';

const pageState = () => ({
  nodes: [],
  textNodes: [],
});

export function pageReducer(state = pageState(), { payload, type }) {
  switch (type) {

    case types.ADD_PAGE:
      return Object.assign({}, state, {
        nodes: payload.nodes,
      });

    default:
      return state;

  }
}