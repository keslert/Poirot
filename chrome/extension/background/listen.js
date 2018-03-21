import { parsePage } from '../../../src/core/utils/ds';
import { addPage } from '../../../src/core/models/ds/actions';

const arrowURLs = ['^http://keslertanner\\.com', '^https://www.wework\\.com'];
export function listen(store) {

  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    const isCompleted = changeInfo.status === 'complete';
    const isValidDomain = tab.url.match(arrowURLs.join('|'))

    if(isCompleted && isValidDomain) {
      injectDSXray(tabId);
    }
  });
}

async function injectDSXray(tabId) {
  const injected = await isInjected(tabId, 'injectUI');
  if (chrome.runtime.lastError || injected) return;
  loadScript('inject', tabId, () => console.log('Injected DSXray UI'));
  setInjected(tabId, 'injectUI');
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
      // Load redux-devtools-extension inject bundle,
      // because inject script and page is in a different context
      const request = new XMLHttpRequest();
      request.open('GET', 'chrome-extension://lmhkpmbekcpmknklioeibfkpmmfibljd/js/redux-devtools-extension.js');  
      // sync
      request.send();
      request.onload = () => {
        if (request.readyState === XMLHttpRequest.DONE && request.status === 200) {
          chrome.tabs.executeScript(tabId, { code: request.responseText, runAt: 'document_start' });
        }
      };
      chrome.tabs.executeScript(tabId, { code: fetchRes }, cb);
    });
  }
}



