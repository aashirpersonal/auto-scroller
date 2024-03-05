function sendMessageToBackground(message) {
    chrome.runtime.sendMessage(message, function(response) {
      if (chrome.runtime.lastError) {
        // console.error(chrome.runtime.lastError.message);
      }
    });
  }
  
  document.addEventListener('DOMContentLoaded', function () {
    const startBtn = document.getElementById('startBtn');
    const stopBtn = document.getElementById('stopBtn');
    const maxTimeInput = document.getElementById('maxTimeInput');
    const setMaxTimeBtn = document.getElementById('setMaxTimeBtn');
  
    startBtn.addEventListener('click', () => sendMessageToBackground({ action: 'start' }));
    stopBtn.addEventListener('click', () => sendMessageToBackground({ action: 'stop' }));
    setMaxTimeBtn.addEventListener('click', () => {
      const maxTime = parseInt(maxTimeInput.value);
      if (!isNaN(maxTime) && maxTime > 0) {
        sendMessageToBackground({ action: 'setMaxTime', value: maxTime });
      } else {
        alert('Please enter a valid number for max scroll time.');
      }
    });
  
    // Initialize popup UI based on the current state of the extension
    sendMessageToBackground({ action: 'getState' });
  });
  
  chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.action === 'updateState') {
      const { isScrollingEnabled, maxScrollTime } = message.state;
      const startBtn = document.getElementById('startBtn');
      const stopBtn = document.getElementById('stopBtn');
      const maxTimeInput = document.getElementById('maxTimeInput');
  
      if (isScrollingEnabled) {
        startBtn.disabled = true;
        stopBtn.disabled = false;
      } else {
        startBtn.disabled = false;
        stopBtn.disabled = true;
      }
      maxTimeInput.value = maxScrollTime || 300;
    }
  });
  