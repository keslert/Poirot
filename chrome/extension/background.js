require('./background/promisify');
import { createStore } from './background/store';
import { listen, injectDSXray } from './background/listen';

const store = createStore();
listen(store);

chrome.browserAction.onClicked.addListener(tab => {
  if(tab.status === 'complete') {
    injectDSXray(tab, store);
  }
});