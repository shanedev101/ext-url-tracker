// Initialize an array to store the URL history and a variable to track the previous URL
let urlHistory = [];
let previousUrl = null;

/**
 * Listen for tab updates (e.g., URL changes within the same tab).
 * When the URL changes, determine the action (Next, Back, or Same) and store the URL with the action in the history.
 */
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // Check if the URL has changed
  if (changeInfo.url) {
    // Determine the action (Next, Back, or Same)
    const action = determineAction(changeInfo.url);

    // Store the URL along with its action in the history
    urlHistory.push({
      url: changeInfo.url,
      action: action,
    });

    // Save the history in chrome.storage.local for later access
    chrome.storage.local.set({ urlHistory });
  }
});

/**
 * Listen for tab changes (e.g., switching between tabs).
 * When the tab changes, store the current URL in the history.
 */
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  const tab = await chrome.tabs.get(activeInfo.tabId);
  if (tab.url) {
    // Determine the action (Next, Back, or Same)
    const action = determineAction(tab.url);

    // Store the URL along with its action in the history
    urlHistory.push({
      url: tab.url,
      action: action,
    });

    // Save the updated history in chrome.storage.local
    chrome.storage.local.set({ urlHistory });
  }
});

// Function to determine the action type (Next, Back, or Same) based on the current URL
function determineAction(currentUrl) {
  // Default action for the first URL
  let action = 'Initial';

  if (previousUrl) {
    // Default to "Next" if the URL is different from the previous one
    action = currentUrl === previousUrl ? 'Same' : 'Next';

    // If the current URL is already in the history, mark it as "Back"
    if (urlHistory.some((entry) => entry.url === currentUrl)) {
      action = 'Back';
    }
  }

  // Update the previous URL to the current one for the next action comparison
  previousUrl = currentUrl;

  return action;
}
