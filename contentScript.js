// contentScript.js

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.action === 'scroll') {
      const scrollAmount = message.value * window.innerHeight;
      window.scrollBy({ top: scrollAmount, behavior: 'smooth' });
    }
  });
  