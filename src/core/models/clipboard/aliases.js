import * as types from './action-types';
import { getOverwrites } from '../page/selectors';

function _setCopyNode(payload) {
  return {
    type: types.ALIAS_SET_COPY_NODE,
    payload,
  }
}

export function setCopyNode({payload: node, _sender}) {
  return (dispatch, getState) => {
    if(!node) {
      dispatch(_setCopyNode(null));
    }
    const overwrites = getOverwrites(getState(), _sender.url);
    const style = {...node.style, ...(overwrites[node.uid] || {})};
    dispatch(_setCopyNode({...node, style}));
  }
}