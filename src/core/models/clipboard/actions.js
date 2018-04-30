import * as types from './action-types';

export function setCopyNode(node) {
  return {
    type: types.SET_COPY_NODE,
    payload: node,
  }
}