import * as types from './action-types';

export function addPage(page) {
  return {
    type: types.ADD_PAGE,
    payload: page,
  }
}