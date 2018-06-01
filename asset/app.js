//1 random
//2 score fin partie
//3 afficher reussite ou echec note
//4 difficulté
//5 lettres longues
//multijoueur

var notes = [
  {
    color: [
      'red',
      'green'
    ],
    time: 800,
    isActive: false
  }
];
var renderGame = function() {
  var divs = document.querySelectorAll('.string');
  for (let i = 0; i < notes.length; i++) {
    let note = notes[i];
    for (let a = 0; a < note.color.length; a++) {
      let div;
      switch (note.color[a]) {
        case 'green':
        div = divs[0]
        break;
        case 'red':
        div = divs[1]
        break;
        case 'yellow':
        div = divs[2]
        break;
        case 'blue':
        div = divs[3]
        break;
        case 'orange':
        div = divs[4]
        break;
      }
      setTimeout(function(){
        let span = document.createElement('span');
        //mettre listener
        span.classList.add('note');
        span.classList.add(note.color[a]);
        span.classList.add('noteTranslate');
        div.appendChild(span);
        setTimeout(function(){
          note.isActive = true
        }, 900);
        setTimeout(function(){
          note.isActive = false
          // wrongColor();
          div.removeChild(span);
        }, 1000);
      }, note.time);
    }
  }
};

var btn = function() {
  renderGame();
};

var keyPressed = [];
var spacePressedOnce = false;
var score = 0;
var mark = 0;
var multi = 1;
var keyUp = function(color){
  keyPressed.splice(keyPressed.indexOf(color), 1);
  keyPressedRender();
}
window.addEventListener('keyup', function(e){
  switch (e.which) {
    case 65:
      keyUp('green');
      break;
    case 90:
      keyUp('red');
      break;
    case 69:
      keyUp('yellow');
      break;
    case 82:
      keyUp('blue');
      break;
    case 84:
      keyUp('orange');
      break;
    case 32:
      spacePressedOnce = false;
      break;
  }
});
var keyPush = function(color){
  if (keyPressed.indexOf(color) === -1) {
    keyPressed.push(color);
    keyPressedRender();
  }
}
var goodColor = function(){
  mark++;
  switch (true) {
    case (mark>=30):
      multi = 4;
      break;
    case (mark>=20):
      multi = 3;
      break;
    case (mark>=10):
      multi = 2;
      break;
    case (mark<10):
    default:
      multi = 1;
  }
  score += multi * 50
  renderScore();
};
var wrongColor = function(){
  mark = 0;
  multi = 1;
  renderScore();
};
var renderScore = function(){
  document.querySelector('.score').textContent = score;
  document.querySelector('.mark').textContent = mark;
  document.querySelector('.multi').textContent = 'x'+multi;
}
var keyPressedRender = function(){
  let noteDown = document.querySelectorAll('.noteDown');
  for (let i = 0; i < noteDown.length; i++) {
    noteDown[i].classList.remove('light'+noteDown[i].classList.item(1));
    if (keyPressed.indexOf(noteDown[i].classList.item(1)) !== -1) {
      noteDown[i].classList.add('light'+noteDown[i].classList.item(1));
    }
  }
}
window.addEventListener('keydown', function(e){
  switch (e.which) {
    case 65:
      keyPush('green');
      break;
    case 90:
      keyPush('red');
      break;
    case 69:
      keyPush('yellow');
      break;
    case 82:
      keyPush('blue');
      break;
    case 84:
      keyPush('orange');
      break;
  }
  if ((e.which === 32) && (spacePressedOnce === false)) {
    spacePressedOnce = true;
    for (var i = 0; i < notes.length; i++) {
      if ((notes[i].isActive) && (keyPressed.length === notes[i].color.length)) {
        for (var a = 0; a < notes[i].color.length; a++) {
          if (keyPressed.indexOf(notes[i].color[a]) === -1) {
            wrongColor();
            return;
          }
        }
        goodColor();
        return;
      }
    }
    wrongColor();
  }
});
