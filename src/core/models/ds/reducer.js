import * as types from './action-types';
import WeWork from '../../../data/we-work';
import { buildDSObject } from './actions';

const dsState = () => buildDSObject(WeWork)

export function dsReducer(state = dsState(), { payload, type }) {
  
  switch (type) {

    case types.UPDATE_DS_TYPOGRAPHY:
      
      const newState = Object.assign({}, state, {
        typography: _.mapValues(state.typography, groups => groups.map(group => 
          payload.keys.includes(group.key) ? {...group, ...payload.changes} : group
        ))
      })
      console.log('UPDATE_DS_TYPOGRAPHY', newState)
      return newState;
    

    default:
      return state;

  }
}