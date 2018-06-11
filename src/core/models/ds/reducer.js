import * as types from './action-types';
import StackAI from '../../../data/stack-ai';
import BlueCoffee from '../../../data/blue-coffee';
import { buildDSObject } from './actions';
import _ from 'lodash';
import { hostnameSpecificReducer } from '../../utils/redux';

const dsState = () => buildDSObject(BlueCoffee)
export const dsReducer = hostnameSpecificReducer((state = dsState(), { payload, type }) => {
  
  switch (type) {
    case types.OVERWRITE_DS_TYPOGRAPHY:
      const overwrites = _.merge({}, state.typography.overwrites,
        ...payload.keys.map(key => ({[key]: payload.changeset})),
      )
      return Object.assign({}, state, {
        typography: {...state.typography, overwrites}
      })
    
    default:
      return state;
  }
})