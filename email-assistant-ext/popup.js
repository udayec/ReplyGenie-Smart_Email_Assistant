document.getElementById('saveSettings').addEventListener('click', () => {
  const tone = document.getElementById('tone').value;
  const userIntent = document.getElementById('intent').value;

  chrome.storage.sync.set({ tone, userIntent }, () => {
    alert('Settings saved!');
  });
});
