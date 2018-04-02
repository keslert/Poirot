import * as types from './action-types';
import WeWork from '../../../data/we-work';
import { buildDSObject } from './actions';
import _ from 'lodash';

const dsState = () => buildDSObject(WeWork)

export function dsReducer(state = dsState(), { payload, type }) {
  
  switch (type) {

    case types.OVERWRITE_DS_TYPOGRAPHY:
      const overwrites = _.merge({}, state.typography.overwrites,
        ...payload.keys.map(key => ({[key]: payload.changeset})),
      )

      const newState = Object.assign({}, state, {
        typography: {...state.typography, overwrites}
      })
      console.log('UPDATE_DS_TYPOGRAPHY', newState)
      return newState;
    

    default:
      return state;

  }
}