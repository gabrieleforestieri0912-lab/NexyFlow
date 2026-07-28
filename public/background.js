chrome.runtime.onInstalled.addListener(() => {
  console.log('NextBrand extension installed.');
});

chrome.action.onClicked.addListener((tab) => {
  chrome.sidePanel.open({ tabId: tab.id });
});

chrome.commands.onCommand.addListener(async (command) => {
  if (command === 'toggle-sidebar') {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab?.id) {
      chrome.sidePanel.open({ tabId: tab.id });
    }
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'ANALYZE_PROFILE' || message.action === 'OPEN_POPUP') {
    // Store the profile to be analyzed in local storage so the sidebar can read it
    chrome.storage.local.set({ pendingAnalysis: message }, () => {
      // Open the side panel if it's not already open
      chrome.sidePanel.open({ tabId: sender.tab.id });
    });
  } else if (message.action === 'OPEN_DASHBOARD') {
    // Apre la dashboard locale o di produzione. In sviluppo locale usa http://localhost:3000
    const apiHost = 'http://localhost:3000';
    const targetUrl = `${apiHost}${message.path || '/dashboard'}`;
    chrome.tabs.create({ url: targetUrl });
  }
});
