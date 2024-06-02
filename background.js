chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
      id: "getDefinition",
      title: "Get Definition",
      contexts: ["selection"]
    });
  });
  
  chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "getDefinition") {
      fetchDefinition(info.selectionText, (definition) => {
        chrome.tabs.sendMessage(tab.id, { text: info.selectionText, definition: definition });
      });
    }
  });
  
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.text) {
      fetchDefinition(request.text, (definition) => {
        sendResponse({ definition: definition });
      });
      return true; // Will respond asynchronously.
    }
  });
  
  chrome.commands.onCommand.addListener((command) => {
    if (command === "toggle-extension") {
      chrome.storage.local.get("enabled", (data) => {
        let enabled = !data.enabled;
        chrome.storage.local.set({ enabled: enabled }, () => {
          chrome.tabs.query({}, (tabs) => {
            tabs.forEach(tab => {
              chrome.tabs.sendMessage(tab.id, { toggle: enabled });
            });
          });
        });
      });
    }
  });
  
  function fetchDefinition(word, callback) {
    let apiKey = "e5591462-b309-46b7-9988-d6c11519b3ca";
    let url = `https://www.dictionaryapi.com/api/v3/references/learners/json/${word}?key=${apiKey}`;
  
    fetch(url)
      .then(response => response.json())
      .then(data => {
        if (data.length > 0 && typeof data[0] === 'object' && data[0].shortdef) {
          callback(data[0].shortdef.join("; "));
        } else {
          callback("No definition found.");
        }
      })
      .catch(error => {
        console.error("Error fetching definition:", error);
        callback("Error fetching definition.");
      });
  }
  