const loadGame = () => {
  const url = window.location.href;
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');
  if (code && (code === 'won' || code === 'ok' || code === 'hacker')) return showSuccessMsg(code);
  const redirectToGame = url.replace('index.html', 'tic-tac-toe.html')
  window.location.replace(redirectToGame);
};

showSuccessMsg = (code) => {
  console.log(code);
}

loadGame();