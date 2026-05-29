/**
 * Protector script to enforce the Tic-Tac-Toe gatekeeper.
 * Redirects users to the game unless they have a valid code.
 */

/**
 * Redirects to the Tic-Tac-Toe game with optional parameters.
 * @param {Array<{key: string, value: string}>} paramsArray - Optional query parameters.
 */
function redirect(paramsArray) {
  const url = window.location.protocol + '//' + window.location.host + window.location.pathname;
  let replacement = 'tic-tac-toe.html';
  
  if (paramsArray && paramsArray.length > 0) {
    const params = paramsArray.map(p => `${p.key}=${p.value}`).join('&');
    replacement += `?${params}`;
  }
  
  let redirectToGame = url + replacement;
  if (url.includes('index.html')) {
    redirectToGame = url.replace('index.html', replacement);
  }
  window.location.href = redirectToGame;
}

/**
 * Shows a success message (e.g., after winning the game).
 * @param {string} code - The success code ('won', 'hacker').
 */
function showSuccessMsg(code) {
  let text = 'You lucky seems like you won against me! 🥳';
  if (code === 'hacker') text = 'Nicely bypassed the game! 👾';
  
  // Use DOMContentLoaded to ensure the DOM is ready
  document.addEventListener('DOMContentLoaded', () => {
    const snackbar = document.createElement('div');
    snackbar.id = 'snackbar';
    snackbar.innerHTML = text;
    snackbar.className = 'show';
    
    document.body.appendChild(snackbar);
    
    setTimeout(() => {
      snackbar.className = snackbar.className.replace('show', '');
      document.body.removeChild(snackbar);
    }, 3000);
  });
}

/**
 * Loads the game or shows success message based on URL parameters.
 * @param {boolean} again - Whether to redirect to play again.
 */
function loadGame(again = false) {
  if (again) {
    redirect([{ key: 'status', value: 'again' }]);
    return;
  }
  
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');
  
  if (code && (code === 'won' || code === 'ok' || code === 'hacker')) {
    showSuccessMsg(code);
    return;
  } else if (code && code === 'again') {
    return;
  }
  
  redirect();
}

// Expose functions globally for backward compatibility
window.playAgain = function() {
  loadGame(true);
};

// Initialize the protector when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  loadGame();
});
