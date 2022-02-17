const tileContainer = document.querySelector('.tile-container');
const keyboardContainer = document.querySelector('.keyboard-container');
const messageContainer = document.querySelector('.message-container');

let word;

const getWord = () => {
  fetch('http://localhost:8000/word')
    .then((response) => response.json())
    .then((json) => {
      console.log(json);
      word = json.toUpperCase();
    })
    .catch((err) => console.log(err));
};

getWord();

const keys = [
  'Q',
  'W',
  'E',
  'R',
  'T',
  'Y',
  'U',
  'I',
  'O',
  'P',
  'A',
  'S',
  'D',
  'F',
  'G',
  'H',
  'J',
  'K',
  'L',
  'ENTER',
  'Z',
  'X',
  'C',
  'V',
  'B',
  'N',
  'M',
  '←',
];

const guessRows = [
  ['', '', '', '', ''],
  ['', '', '', '', ''],
  ['', '', '', '', ''],
  ['', '', '', '', ''],
  ['', '', '', '', ''],
  ['', '', '', '', ''],
];

let currentRow = 0;
let currentTile = 0;
let isGameOver = false;

guessRows.forEach((row, rowIndex) => {
  const rowElement = document.createElement('div');
  rowElement.setAttribute('id', 'guessRow' + rowIndex);
  row.forEach((letter, letterIndex) => {
    const tile = document.createElement('div');
    tile.setAttribute('id', 'guessRow' + rowIndex + '-tile' + letterIndex);
    tile.classList.add('tile');
    rowElement.append(tile);
  });

  tileContainer.append(rowElement);
});

keys.forEach((key) => {
  const button = document.createElement('button');
  button.textContent = key;
  button.setAttribute('id', key);
  button.addEventListener('click', () => handleClick(key));
  keyboardContainer.append(button);
});

//ADD LETTER
const addLetter = (letter) => {
  if (currentTile < 5 && currentRow < 6) {
    const tile = document.getElementById(
      'guessRow' + currentRow + '-tile' + currentTile
    );
    tile.textContent = letter;
    guessRows[currentRow][currentTile] = letter;
    tile.setAttribute('data', letter);
    currentTile++;
  }
};

//DELETE A LETTER
const deleteLetter = () => {
  if (currentTile > 0) {
    currentTile--;
    const tile = document.getElementById(
      'guessRow' + currentRow + '-tile' + currentTile
    );
    tile.textContent = '';
    guessRows[currentRow][currentTile] = '';
    tile.setAttribute('data', '');
  }
};

//WHEN YOU PRESS ENTER
const checkRow = () => {
  const guess = guessRows[currentRow].join('');
  console.log('guess', guess);
  if (currentTile > 4) {
    fetch(`http://localhost:8000/check/?word=${guess}`)
      .then((response) => response.json())
      .then((json) => {
        console.log(json);
        if (json == 'Entry word not found') {
          showMessage('Word not in list');
          return;
        } else {
          checkTile();
          if (word === guess) {
            showMessage('You Win!!!');
            isGameOver = true;
          } else {
            if (currentRow >= 5) {
              isGameOver = true;
              showMessage('You LOSE');
              return;
            }
            if (currentRow < 5) {
              currentRow++;
              currentTile = 0;
            }
          }
        }
      })
      .catch((err) => console.log(err));
  }
};

const showMessage = (message) => {
  const messageElement = document.createElement('p');
  messageElement.textContent = message;
  messageContainer.append(messageElement);
  setTimeout(() => messageContainer.removeChild(messageElement), 1000);
};

const setKeyBoardColor = (keyLetter, color) => {
  const key = document.getElementById(keyLetter);
  key.classList.add(color);
};

const checkTile = () => {
  const rowTiles = document.querySelector('#guessRow' + currentRow).childNodes;
  let checkWord = word;
  const guess = [];

  rowTiles.forEach((tile) => {
    guess.push({ letter: tile.getAttribute('data'), color: 'gray' });
    console.log(guess);
  });

  guess.forEach((guess, index) => {
    if (guess.letter == word[index]) {
      guess.color = 'green';
      checkWord = checkWord.replace(guess.letter, '');
    }
  });

  guess.forEach((guess) => {
    if (checkWord.includes(guess.letter)) {
      guess.color = 'yellow';
      checkWord = checkWord.replace(guess.letter, '');
    }
  });

  rowTiles.forEach((tile, index) => {
    setTimeout(() => {
      tile.classList.add('flip');
      tile.classList.add(guess[index].color);
      setKeyBoardColor(guess[index].letter, guess[index].color);
    }, 269 * index);
  });
};

const handleClick = (key) => {
  if (!isGameOver) {
    console.log('clicked', key);
    if (key === '←') {
      deleteLetter();
      return;
    }
    if (key === 'ENTER') {
      checkRow();
      return;
    }
    addLetter(key);
  }
};
