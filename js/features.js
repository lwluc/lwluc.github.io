/**
 * Additional features for the website (e.g., scroll progress, modal).
 */

// Scroll progress
window.onscroll = () => scrollBar();

/**
 * Updates the scroll progress bar.
 */
function scrollBar() {
  const winScroll =
    document.body.scrollTop || document.documentElement.scrollTop;
  const height =
    document.documentElement.scrollHeight -
    document.documentElement.clientHeight;
  const scrolled = (winScroll / height) * 100;
  const progressBar = document.getElementById('myBar');
  if (progressBar) {
    progressBar.style.width = scrolled + '%';
  }
}

// Modal
const modal = document.getElementById('myModal');
const modalText = document.getElementById('modalText');
const bye = [
  'see you &#128530;',
  'nice to &#127830; you',
  'catch you later &#127939;',
  'bye &#128165;',
  'adios &#128075;&#127996;',
];

/**
 * Adds an event listener to an element.
 * @param {HTMLElement} obj - The element.
 * @param {string} evt - The event name.
 * @param {Function} fn - The event handler.
 */
function addEvent(obj, evt, fn) {
  if (obj.addEventListener) {
    obj.addEventListener(evt, fn, false);
  } else if (obj.attachEvent) {
    obj.attachEvent('on' + evt, fn);
  }
}

// Mouse leaving detection
addEvent(window, 'load', () => {
  addEvent(document, 'mouseout', e => {
    e = e ? e : window.event;
    const from = e.relatedTarget || e.toElement;
    if (!from || from === null) {
      if (modalText) {
        modalText.innerHTML = bye[Math.floor(Math.random() * bye.length)];
      }
      if (modal) {
        modal.style.display = 'block';
      }
    } else {
      if (modal) {
        modal.style.display = 'none';
      }
    }
  });
});
