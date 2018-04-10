import * as types from './action-types';

export function addPage(page) {
  return {
    type: types.ADD_PAGE,
    payload: page,
  }
}

export function updateOverwrites(overwrites) {
  return {
    type: types.UPDATE_OVERWRITES,
    payload: overwrites,
  }
}

export function _updateNode(node, changes) {
  return {
    type: types.UPDATE_NODE,
    payload: {node, changes},
  }
}