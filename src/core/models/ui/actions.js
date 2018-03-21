import * as types from './action-types';

export function addVisibleItem(item) {
  return {
    type: types.ADD_VISIBLE_ITEM,
    payload: item,
  }
}