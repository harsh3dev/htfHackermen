// Listens for the message sent by content.js and fetches the risk score

console.log("entered")
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    if (message.action === 'fetchRiskScore') {
      const address = message.address;
      const riskScore = Math.floor(Math.random() * 101); 
      sendResponse({ riskScore });
  
      return true;
    }
  });
  
// background.js

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete') {
        chrome.scripting.executeScript({
            target: {tabId: tabId},
            files: ['content.js']
        });
    }
});

  
  // For single-page applications where only the URL changes without a full reload
  chrome.webNavigation.onHistoryStateUpdated.addListener((details) => {
    chrome.scripting.executeScript({
      target: { tabId: details.tabId },
      files: ['content.js']
    });
  });
  