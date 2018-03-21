import * as types from './action-types';
import difference from 'lodash/difference';

export function toggleVisible(arr) {
  console.log('toggleVisible', arr);
  return {
    type: types.TOGGLE_VISIBLE,
    payload: arr,
  }
}