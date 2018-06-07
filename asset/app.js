var ui = {
  start: document.querySelector('.start'),
  end: document.querySelector('.end'),
  endScore: document.querySelector('span.score'),
  endMark: document.querySelector('span.mark'),
  endPerc: document.querySelector('span.percent'),
  game: document.querySelector('.game'),
  advice: document.querySelector('.advice'),
  score: document.querySelector('.score'),
  mark: document.querySelector('.mark'),
  multi: document.querySelector('.multi'),
  noteDown: document.querySelectorAll('.noteDown'),
  divs: document.querySelectorAll('.string'),
};

var score = 0;
var mark = 0;
var perc = 0;
var bestMark = 0;
var multi = 1;

//functions called by html onclick
var changeMode = function(){
  ui.end.classList.add('none');
  ui.start.classList.remove('none');
}
var lastMode = 0;
var ControllerStartGame = function(mode){
  if (mode === undefined) {
    mode = lastMode;
  } else {
    lastMode = mode;
  }
  score = 0;
  mark = 0;
  perc = 0;
  bestMark = 0;
  multi = 1;
  renderScore();
  randomNotes(mode);
  renderStartGame();
}
//song rondomizer
var notes = [
  // note exemple
  {
    color: ['green', 'red'],
    time: 1200,
    isActive: false,
    isOver: false
  }
];
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}
var color = [
  'green',
  'red',
  'yellow',
  'blue',
  'orange'
]
var notesNb = 100;
var randomNotes = function(mode) {
  notes = [];
  for (var i = 0; i < notesNb; i++) {
    notes.push({
      color: [],
      time: 0,
      isActive: false,
      isOver: false
    });
    for (var a = 0; a <= getRandomInt(mode); a++) {
      var temp = getRandomInt(mode);
      if (notes[i].color.indexOf(color[temp]) === -1) {
        notes[i].color.push(color[temp])
      }
    }
    notes[i].time = i*1000+getRandomInt(10)*100;
  }
}
//render game screen
var renderStartGame = function() {
  ui.start.classList.add('none');
  ui.end.classList.add('none');
  ui.game.classList.remove('none');
  setTimeout(function(){
    ui.advice.classList.add('none');
    renderPlayerSong();
  }, 3000);
}
//render the complete song depending on notes (array)
var renderPlayerSong = function() {
  for (let i = 0; i < notes.length; i++) {
    let note = notes[i];
    for (let a = 0; a < note.color.length; a++) {
      let div;
      switch (note.color[a]) {
        case 'green':
        div = ui.divs[0]
        break;
        case 'red':
        div = ui.divs[1]
        break;
        case 'yellow':
        div = ui.divs[2]
        break;
        case 'blue':
        div = ui.divs[3]
        break;
        case 'orange':
        div = ui.divs[4]
        break;
      }
      setTimeout(function(){
        let span = document.createElement('span');
        span.classList.add('note');
        span.classList.add(note.color[a]);
        span.classList.add('noteTranslate');
        div.appendChild(span);
        setTimeout(function(){
          note.isActive = true
        }, 2700);
        setTimeout(function(){
          if (note.isOver === false) {
            wrongColor();
          }
          note.isActive = false
          div.removeChild(span);
          if (i === notes.length-1) {
            setTimeout(function(){renderEndScreen();}, 2000);
          }
        }, 3000);
      }, note.time);
    }
  }
};
var renderEndScreen = function(){
  ui.game.classList.add('none');
  ui.end.classList.remove('none');
  ui.endScore.textContent = score;
  ui.endMark.textContent = bestMark;
  ui.endPerc.textContent = perc*100/notesNb;
}

//events related to listener
// when a key is pressed the color corresponding is added to keyPressed
//then it is compared to note[i].color
var keyPressed = [];
var spacePressedOnce = false;
var keyPush = function(color){
  if (keyPressed.indexOf(color) === -1) {
    keyPressed.push(color);
    renderKeyPressed();
  }
}
var keyUp = function(color){
  keyPressed.splice(keyPressed.indexOf(color), 1);
  renderKeyPressed();
}
var renderKeyPressed = function(){
  for (let i = 0; i < ui.noteDown.length; i++) {
    let color = ui.noteDown[i].classList.item(1);
    ui.noteDown[i].classList.remove('light'+color);
    if (keyPressed.indexOf(color) !== -1) {
      ui.noteDown[i].classList.add('light'+color);
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
        //if the strings (colors) in keyPressed are exactly the same as notes[i].color
        goodColor(i);
        return;
      }
    }
    wrongColor();
  }
});
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
var goodColor = function(i){
  mark++;
  perc++;
  if (bestMark < mark) {
    bestMark = mark;
  }
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
  score += multi * 50;
  notes[i].isOver = true;
  renderScore('success');
};
var wrongColor = function(){
  mark = 0;
  multi = 1;
  renderScore('failure');
};
var renderScore = function(success){
  ui.score.textContent = score;
  ui.mark.textContent = mark;
  ui.multi.textContent = 'x'+multi;
  let endStringClassList = document.querySelector('.endString').classList;
  switch (success) {
    case 'success':
      endStringClassList.add('endStringSuccess');
      setTimeout(function(){endStringClassList.remove('endStringSuccess')}, 200);
      break;
    case 'failure':
      endStringClassList.add('endStringFailure')
      setTimeout(function(){endStringClassList.remove('endStringFailure')}, 200);
      break;
  }
}
