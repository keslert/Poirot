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
  el.setAttribute('data-uid', 'dsxray');
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

  const head = document.getElementsByTagName('head')[0];

  const stylesheets = [
    'react-select/dist/react-select.css', 
    'react-virtualized/styles.css', 
    'react-virtualized-select/styles.css',
  ];
  
  stylesheets.forEach(pkg => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = `//unpkg.com/${pkg}`;
    link.media = 'all';
    head.appendChild(link);
  })
}

window.addEventListener('load', inject);
if (document.readyState === 'complete') inject();