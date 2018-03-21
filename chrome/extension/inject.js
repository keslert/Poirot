import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Store } from 'react-chrome-redux';
import App from '../../src/containers/App';

function inject() {
  if(document.getElementById('dsxray')) {
    return;
  }

  const el = document.createElement('div');
  el.id = 'dsxray'
  document.body.appendChild(el);
  const store = new Store({ portName: 'DSXray'});
  store.ready().then(() => {
    render(
      <Provider store={store}>
        <App />
      </Provider>, 
      el
    );
  })
}

window.addEventListener('load', inject);
if (document.readyState === 'complete') inject();

// Scrape webpage for styles
// Load design system (or find a suitable system)
// Group styles into