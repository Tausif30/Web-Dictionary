let enabled = true;

document.addEventListener("mouseup", function() {
  if (!enabled) return;

  let selectedText = window.getSelection().toString().trim();
  if (selectedText.length > 0) {
    browser.runtime.sendMessage({ text: selectedText }, function(response) {
      if (response && response.definition) {
        showPopup(response.definition);
      }
    });
  }
});

function showPopup(definition) {
  let popup = document.createElement("div");
  popup.style.position = "fixed";
  popup.style.bottom = "10px";
  popup.style.right = "10px";
  popup.style.backgroundColor = "black";
  popup.style.border = "1px solid black";
  popup.style.padding = "10px";
  popup.style.zIndex = 10000;
  popup.innerText = definition;

  document.body.appendChild(popup);

  setTimeout(() => {
    popup.remove();
  }, 5000);
}

browser.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.toggle !== undefined) {
    enabled = request.toggle;
    sendResponse({ status: "toggled", enabled: enabled });
  }
});
