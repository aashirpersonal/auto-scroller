// background.js

let scrollInterval;
let maxScrollTime = 300; // Default max scroll time in seconds
let isScrollingEnabled = false;

function randomScroll() {
  if (!isScrollingEnabled) {
    clearInterval(scrollInterval);
    return;
  }

  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    if (tabs[0]) {
      const randomPosition = Math.random() * 2 - 1; // Random position between -1 and 1
      chrome.tabs.sendMessage(tabs[0].id, { action: 'scroll', value: randomPosition }, function(response) {
        if (chrome.runtime.lastError) {
        //   console.error(chrome.runtime.lastError.message);
        }
      });
    }
  });

  const randomStop = Math.random() < 0.2; // 20% chance to stop scrolling
  if (randomStop) {
    clearInterval(scrollInterval);
    setTimeout(() => {
      scrollInterval = setInterval(randomScroll, 1000);
    }, 2000); // Wait 2 seconds before resuming scrolling
  }
}

function startScrolling() {
  isScrollingEnabled = true;
  scrollInterval = setInterval(randomScroll, 1000);
}

function stopScrolling() {
  isScrollingEnabled = false;
  clearInterval(scrollInterval);
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'start') {
    startScrolling();
  } else if (message.action === 'stop') {
    stopScrolling();
  } else if (message.action === 'setMaxTime') {
    maxScrollTime = message.value;
    clearInterval(scrollInterval);
    setTimeout(() => {
      stopScrolling();
    }, maxScrollTime * 1000);
  }
});
