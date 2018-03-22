import * as types from './action-types';
import difference from 'lodash/difference';

export function toggleVisible(keys) {
  return {
    type: types.TOGGLE_VISIBLE,
    payload: keys,
  }
}