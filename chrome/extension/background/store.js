import { wrapStore } from 'react-chrome-redux';

export function createStore() {
  const _createStore = require('../../../src/core/store/configureStore');
  const store = _createStore({});
  wrapStore(store, { portName: 'DSXray' });
  return store;
};