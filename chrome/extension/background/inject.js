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
      request.open('GET', 'chrome-extension://lmhkpmbekcpmknklioeibfkpmmfibljd/js/redux-devtools-extension.js');  // sync
      request.send();
      request.onload = () => {
        if (request.readyState === XMLHttpRequest.DONE && request.status === 200) {
          chrome.tabs.executeScript(tabId, { code: request.responseText, runAt: 'document_start' });
        }
      };
      chrome.tabs.executeScript(tabId, { code: fetchRes, runAt: 'document_end' }, cb);
    });
  }
}

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status !== 'loading') return;

  const [injected] = await isInjected(tabId, 'injectButton');
  if(!chrome.runtime.lastError && !injected) {
    loadScript('inject', tabId, () => console.log('load inject bundle success!'));
    setInjected(tabId, 'injectButton');
  }
});

chrome.browserAction.onClicked.addListener(async tab => {
  const injected = await isInjected(tab.id, 'injectStyle');

  if(!injected) {
    loadScript('inject-style', tab.id, () => console.log('load inject-style bundle success'))
    setInjected(tab.id, 'injectStyle');
  } else {
    chrome.tabs.executeScript(tab.id, { 
      code: `window.toggleDebugRules()`, 
      runAt: 'document_end' 
    });
  }
})

