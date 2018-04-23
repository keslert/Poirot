import React from 'react';
import ReactDOM from 'react-dom';

// TODO: I should be able to delete this file...

chrome.storage.local.get('state', (obj) => {
  // const { state } = obj;
  // const initialState = JSON.parse(state || '{}');
  // const createStore = require('../../src/core/store/configureStore');
  ReactDOM.render(
    <div>Should not be here.</div>,
    document.querySelector('#root')
  );
});
