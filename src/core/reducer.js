import { combineReducers } from 'redux';
import { uiReducer } from './models/ui/reducer';
import { dsReducer } from './models/ds/reducer';
import { pageReducer } from './models/page/reducer';

export default combineReducers({
  ui: uiReducer,
  ds: dsReducer,
  page: pageReducer,
});
