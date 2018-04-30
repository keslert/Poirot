import { combineReducers } from 'redux';
import { uiReducer } from './models/ui/reducer';
import { dsReducer } from './models/ds/reducer';
import { pageReducer } from './models/page/reducer';
import { clipboardReducer } from './models/clipboard/reducer';

export default combineReducers({
  ui: uiReducer,
  ds: dsReducer,
  page: pageReducer,
  clipboard: clipboardReducer,
});