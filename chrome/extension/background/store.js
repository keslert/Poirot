import { wrapStore } from 'react-chrome-redux';

export function createStore() {
  const createStore_ = require('../../../src/core/store/configureStore');
  const store = createStore_({});
  wrapStore(store, { portName: 'DSXray' });
  return store;
};