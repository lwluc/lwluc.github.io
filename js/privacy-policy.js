const changeLanguage = () => {
  document.getElementById('languageSelector').addEventListener(
    'change',
    event => {
      if (event.target.checked) {
        document.getElementById('german').style.display = 'initial';
        document.getElementById('english').style.display = 'none';
      } else {
        document.getElementById('german').style.display = 'none';
        document.getElementById('english').style.display = 'initial';
      }
    },
    false
  );
};

window.onload = () => {
  changeLanguage();
};