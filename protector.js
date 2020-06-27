const loadGame = () => {
  const url = window.location.href;
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');
  if (code && (code === 'won' || code === 'ok' || code === 'hacker'))
    return showSuccessMsg(code);
  const redirectToGame = url.replace('index.html', 'tic-tac-toe.html');
  window.location.replace(redirectToGame);
};

showSuccessMsg = code => {
  let text = 'You lucky seems like you won against me! 🥳';
  if (code === 'hacker') text = 'Nicely bypassed the game! 👾';
  const snackbar = document.createElement('div');
  snackbar.id = 'snackbar';
  snackbar.innerHTML = text;
  snackbar.className = 'show';
  window.onload = () => {
    document.body.appendChild(snackbar);
    setTimeout(() => {
      snackbar.className = snackbar.className.replace('show', '');
    }, 3000);
  };
};


window.onload = () => loadGame();
