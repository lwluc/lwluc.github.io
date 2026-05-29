/**
 * Language switcher for privacy policy page.
 */

function changeLanguage() {
  const languageSelector = document.getElementById('languageSelector');
  if (!languageSelector) return;

  languageSelector.addEventListener(
    'change',
    event => {
      const german = document.getElementById('german');
      const english = document.getElementById('english');
      
      if (german && english) {
        if (event.target.checked) {
          german.style.display = 'initial';
          english.style.display = 'none';
        } else {
          german.style.display = 'none';
          english.style.display = 'initial';
        }
      }
    },
    false
  );
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', changeLanguage);
