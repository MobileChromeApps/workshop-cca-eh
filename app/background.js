/**
 * Listens for the app launching, then creates the window.
 *
 * @see http://developer.chrome.com/apps/app.runtime.html
 * @see http://developer.chrome.com/apps/app.window.html
 */
function createUiWindow() {
  chrome.app.window.create(
    'index.html',
    {
      id: 'mainWindow',
      bounds: {width: 360, height: 600}
    }
  );
}

chrome.app.runtime.onLaunched.addListener(function(launchData) {
  createUiWindow();
});
