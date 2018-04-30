import {
  ALIAS_SET_PASTE_NODE,
} from './action-types';
import {
  getCopyNode
} from '../clipboard/selectors';

export function setPasteNode({payload: node, _sender}) {
  return (dispatch, getState) => {
    const copyNode = getCopyNode(getState(), _sender.url);
    dispatch({
      type: ALIAS_SET_PASTE_NODE,
      payload: copyNode ? node : null,
      _sender,
    })
  }
}