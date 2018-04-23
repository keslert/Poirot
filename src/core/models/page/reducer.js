import * as types from './action-types';
import _ from 'lodash';
import { pageSpecificReducer } from '../../utils/redux';

const pageState = () => ({
  nodes: {},
  overwrites: {},
});

const customMerge = (objV, srcV) => {
  return _.pickBy(!objV ? srcV : {...objV, ...srcV}, v => v !== null)
}

export const pageReducer = pageSpecificReducer((state = pageState(), { payload, type }) => {
  switch (type) {

    case types.ADD_PAGE:
      return Object.assign({}, state, {
        nodes: payload.nodes,
        treeprints: payload.treeprints,
      });

    case types.UPDATE_NODE:
      return Object.assign({}, state, {
        nodes: _.mapValues(state.nodes, node => node.uid === payload.node.uid
          ? {...node, ...payload.changes}
          : node
        )
      })

    case types.ALIAS_UPDATE_OVERWRITES:
      return Object.assign({}, state, {
        overwrites: _.pickBy(_.mergeWith({}, state.overwrites, payload, customMerge), i => !_.isEmpty(i))
      })


    default:
      return state;

  }
})