document.addEventListener('DOMContentLoaded', () => {
  // Get the element that will display the URL history
  const urlList = document.getElementById('url-list');

  // Get the button element that clears the URL history
  const clearButton = document.getElementById('clear-btn');

  // Fetch the URL history from local storage
  chrome.storage.local.get(['urlHistory'], (result) => {
    // Default to an empty array if no history is found
    const urls = result.urlHistory || [];

    // Iterate over the fetched URL history
    urls.forEach(({ url, action }) => {
      // Create a new row for the table
      const row = document.createElement('tr');
      // Create a cell for the status
      const statusCell = document.createElement('td');
      // Create a cell for the URL
      const urlCell = document.createElement('td');

      // Assign a class based on the action (Next, Back, Same, Initial)
      statusCell.classList.add(`status-${action.toLowerCase()}`);
      statusCell.textContent = action;

      // Set the URL content
      urlCell.textContent = url;

      // Append the status and URL cells to the row
      row.appendChild(statusCell);
      row.appendChild(urlCell);

      // Append the row to the table body
      urlList.appendChild(row);
    });
  });

  // Add event listener to clear the URL history when the clear button is clicked
  clearButton.addEventListener('click', () => {
    // Reset the URL history in local storage
    chrome.storage.local.set({ urlHistory: [] }, () => {
      // Remove all list items from the displayed URL history
      while (urlList.firstChild) {
        urlList.removeChild(urlList.firstChild);
      }
    });
  });
});
