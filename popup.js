document.addEventListener("DOMContentLoaded", function() {
  const lookupButton = document.getElementById("lookup");
  const wordInput = document.getElementById("word");
  const definitionDiv = document.getElementById("definition");

  const storage = typeof browser !== 'undefined' ? browser.storage.local : chrome.storage.local;
  const tabs = typeof browser !== 'undefined' ? browser.tabs : chrome.tabs;

  lookupButton.addEventListener("click", () => {
    let word = wordInput.value.trim();
    if (word.length > 0) {
      fetchDefinition(word, (definition) => {
        definitionDiv.textContent = definition;
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
});
