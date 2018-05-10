import * as types from './action-types';
import _ from 'lodash';
import { pageSpecificReducer } from '../../utils/redux';

const pageState = () => ({
  nodes: {},
  overwrites: {},
  ephemerals: {},
});

const customMerge = (objV, srcV) => {
  return _.pickBy(!objV ? srcV : {...objV, ...srcV}, v => v !== null)
}

export const pageReducer = pageSpecificReducer((state = pageState(), { payload, type }) => {
  let key;
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
      key = payload.isEphemeral ? 'ephemerals' : 'overwrites';
      return Object.assign({}, state, {
        [key]: _.chain({})
          .mergeWith(_.cloneDeep(state[key]), _.cloneDeep(payload.overwrites), customMerge)
          .pickBy(i => !_.isEmpty(i))
          .value()
      })

    case types.ALIAS_CLEAR_SELECTED_OVERWRITES:
      key = payload.isEphemeral ? 'ephemerals' : 'overwrites';
      return Object.assign({}, state, {
        [key]: _.chain(state[key])
          .mapValues((v, uid) => _.includes(payload.uids, uid) ? null : v)
          .pickBy(i => !_.isEmpty(i))
          .value()
      })
    
    case types.CLEAR_OVERWRITES:
      return Object.assign({}, state, {overwrites: {}});

    default:
      return state;

  }
})