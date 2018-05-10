import URL from 'url-parse';
import { REGISTER_PAGE } from '../../../src/core/utils/redux';

const arrowURLs = [
  '^http://keslertanner\\.com', 
  '^http://localhost:3001/',
];
export function listen(store) {

  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    const isCompleted = changeInfo.status === 'complete';
    const isValidDomain = tab.url.match(arrowURLs.join('|'))
    
    if(isCompleted && isValidDomain) {
      injectDSXray(tab, store);
    }
  });
}

export async function injectDSXray(tab, store) {
  const injected = await isInjected(tab.id, 'injectUI');
  if (chrome.runtime.lastError || injected) return;
  loadScript('inject', tab.id, () => console.log('Injected DSXray UI'));
  setInjected(tab.id, 'injectUI');
  const url = new URL(tab.url);
  store.dispatch({
    type: REGISTER_PAGE,
    payload: {hostname: url.hostname, pathname: url.pathname},
  })
}

async function isInjected(tabId, key) {
  const result = await chrome.tabs.executeScriptAsync(tabId, {
    code: `window.${key};`,
    runAt: 'document_start'
  })
  return result[0];
}

function setInjected(tabId, key) {
  chrome.tabs.executeScript(tabId, {
    code: `window.${key} = true;`,
    runAt: 'document_start',
  })
}

function loadScript(name, tabId, cb) {
  if (process.env.NODE_ENV === 'production') {
    chrome.tabs.executeScript(tabId, { file: `/js/${name}.bundle.js`, runAt: 'document_end' }, cb);
  } else {
    // dev: async fetch bundle
    fetch(`http://localhost:3000/js/${name}.bundle.js`)
    .then(res => res.text())
    .then((fetchRes) => {
      chrome.tabs.executeScript(tabId, { code: fetchRes }, cb);
    });
  }
}