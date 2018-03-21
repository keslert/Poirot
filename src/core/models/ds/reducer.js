import * as types from './action-types';
import WeWork from '../../../data/we-work';

const dsState = () => ({
  list: [WeWork],
  activeIndex: 0,
});

export function dsReducer(state = dsState(), { payload, type }) {
  switch (type) {

    default:
      return state;

  }
}