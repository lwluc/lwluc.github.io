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

// Speech color changer
function tooglePopup() {
    const popup = document.getElementById('speechPopup');
    if (popup.classList.contains('show')) {
        setTimeout(() => {
            popup.classList.toggle('hide');
            popup.classList.remove('show');
        }, 4000);
    } else {
        popup.classList.remove('hide');
        popup.classList.toggle('show');
    }
}

const speech = window.webkitSpeechRecognition || window.SpeechRecognition;
if (speech) {
    document.getElementById('speechPopupContainer').style.visibility = 'visible';
    tooglePopup();

    // https://github.com/mdn/web-speech-api/tree/master/speech-color-changer
    var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
    var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
    var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

    const colors = [ 'aqua' , 'azure' , 'beige', 'bisque', 'black', 'blue', 'brown', 'chocolate', 'coral', 'crimson', 'cyan', 'fuchsia', 'ghostwhite', 'gold', 'goldenrod', 'gray', 'green', 'indigo', 'ivory', 'khaki', 'lavender', 'lime', 'linen', 'magenta', 'maroon', 'moccasin', 'navy', 'olive', 'orange', 'orchid', 'peru', 'pink', 'plum', 'purple', 'red', 'salmon', 'sienna', 'silver', 'snow', 'tan', 'teal', 'thistle', 'tomato', 'turquoise', 'violet', 'white', 'yellow'];
    const grammar = '#JSGF V1.0; grammar colors; public <color> = ' + colors.join(' | ') + ' ;';

    let recognition = new SpeechRecognition();
    let speechRecognitionList = new SpeechGrammarList();
    speechRecognitionList.addFromString(grammar, 1);
    recognition.grammars = speechRecognitionList;
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    let mic = document.getElementById('speechPopup');

    document.body.onload = () => {
        recognition.start();
    }
      
    recognition.onresult = event => {
      const last = event.results.length - 1;
      const color = event.results[last][0].transcript;
    
      tooglePopup();
      mic.textContent = `Result received: \n ${color} to ${Math.round(event.results[0][0].confidence * 100)}%`;
      let html = document.getElementsByTagName('html')[0];
      html.style.cssText = `--popupbg: ${color}`;
    }
    
    recognition.onspeechend = () => {
      recognition.stop();
    }
    
    recognition.onnomatch = event => {
        tooglePopup();
        mic.textContent = "I didn't recognise that color.";
    }
    
    recognition.onerror = event => {
        tooglePopup();
        let html = document.getElementsByTagName('html')[0];
    }
}
