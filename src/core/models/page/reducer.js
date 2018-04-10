import * as types from './action-types';
import mergeWith from 'lodash/mergeWith';
import pickBy from 'lodash/pickBy'

const pageState = () => ({
  nodes: [],
  overwrites: {},
});

const customMerge = (objV, srcV) => {
  return !objV ? srcV : pickBy({...objV, ...srcV}, v => v !== null)
}

export function pageReducer(state = pageState(), { payload, type }) {
  switch (type) {

    case types.ADD_PAGE:
      return Object.assign({}, state, {
        nodes: payload.nodes,
      });

    case types.UPDATE_NODE:
      return Object.assign({}, state, {
        nodes: state.nodes.map(node => node.uid === payload.node.uid
          ? {...state.node, ...payload.changes}
          : node
        )
      })

    case types.UPDATE_OVERWRITES:
      const newState = Object.assign({}, state, {
        overwrites: mergeWith({}, state.overwrites, payload, customMerge)
      })
      console.log(newState);
      return newState;

    default:
      return state;

  }
}