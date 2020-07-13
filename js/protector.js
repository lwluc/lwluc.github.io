const redirect = paramsArray => {
  const url = location.protocol + '//' + location.host + location.pathname;
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
};

const loadGame = (again = false) => {
  if (again) {
    redirect([{ key: 'status', value: 'again' }]);
  }
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');
  if (code && (code === 'won' || code === 'ok' || code === 'hacker')) {
    return showSuccessMsg(code);
  } else if (code && code === 'again') return;
  redirect();
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
      document.body.removeChild(snackbar);
    }, 3000);
  };
};

playAgain = () => {
  loadGame(true);
};

loadGame();
