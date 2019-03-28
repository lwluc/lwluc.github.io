// Scroll progress
window.onscroll = () => myFunction();

function myFunction() {
  const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrolled = (winScroll / height) * 100;
  document.getElementById('myBar').style.width = scrolled + '%';
}

// Modal
const modal = document.getElementById('myModal');
const modal_text = document.getElementById('modalText');
const bye = ['see you &#128530;', 'nice to &#127830; you', 'catch you later &#127939;', 'bye &#128165;', 'adios &#128075;&#127996;'];

// Mouse leaving detection https://stackoverflow.com/a/3187524
function addEvent(obj, evt, fn) {
    if (obj.addEventListener) {
        obj.addEventListener(evt, fn, false);
    } else if (obj.attachEvent) {
        obj.attachEvent('on' + evt, fn);
    }
}
addEvent(window,'load',e => {
    addEvent(document, 'mouseout', e => {
        e = e ? e : window.event;
        const from = e.relatedTarget || e.toElement;
        if (!from || from === null) {
            modal_text.innerHTML = bye[Math.floor(Math.random() * bye.length)];
            modal.style.display = 'block';
        } else {
            modal.style.display = 'none';
        }
    });
});
