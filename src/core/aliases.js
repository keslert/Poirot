import { UPDATE_OVERWRITES, ALIAS_UPDATE_OVERWRITES } from './models/page/action-types';
import { TOGGLE_HIDE_CHANGES } from './models/ui/action-types';
import { getNodes } from './models/page/selectors';
import mapValues from 'lodash/mapValues';
import fromPairs from 'lodash/fromPairs';

export function updateOverwrites({payload: overwrites}) {
  return (dispatch, getState) => {
    const uids = Object.keys(overwrites);
    const nodes = getNodes(getState());

    const _overwrites = fromPairs(uids.map(uid => {
      const style = overwrites[uid];
      const node = nodes[uid];
      return [
        uid,
        // If the overwrite value is the same as the original, set it to null
        mapValues(style, (value, key) => node.style[key] === value ? null : value)
      ]
    }))

    dispatch({type: ALIAS_UPDATE_OVERWRITES, payload: _overwrites});
    dispatch({type: TOGGLE_HIDE_CHANGES, payload: false});
  }
}

export default {
  [UPDATE_OVERWRITES]: updateOverwrites
};