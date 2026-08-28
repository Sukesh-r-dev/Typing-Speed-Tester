const sampleTexts = [
  "Frontend development involves building the user interface of web applications using HTML CSS and JavaScript to create engaging user experiences.",
  "Optimizing web performance requires understanding DOM rendering efficient state management and reducing payload sizes across network calls.",
  "Asynchronous programming in JavaScript allows non-blocking operations making applications feel faster and more responsive to user interactions."
];

const textDisplay = document.getElementById('textDisplay');
const inputField = document.getElementById('inputField');
const timerEl = document.getElementById('timer');
const wpmEl = document.getElementById('wpm');
const accuracyEl = document.getElementById('accuracy');
const restartBtn = document.getElementById('restartBtn');

const TOTAL_TIME = 60;
let timeLeft = TOTAL_TIME;
let timer = null;
let isTesting = false;
let charSpans = [];

function initTest() {
  clearInterval(timer);
  timeLeft = TOTAL_TIME;
  isTesting = false;
  timerEl.textContent = `${timeLeft}s`;
  wpmEl.textContent = '0';
  accuracyEl.textContent = '100%';
  inputField.value = '';

  const randomText = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
  textDisplay.innerHTML = '';
  
  charSpans = randomText.split('').map((char, index) => {
    const span = document.createElement('span');
    span.className = 'char';
    span.textContent = char;
    if (index === 0) span.classList.add('current');
    textDisplay.appendChild(span);
    return span;
  });

  inputField.focus();
}

function startTimer() {
  isTesting = true;
  timer = setInterval(() => {
    timeLeft--;
    timerEl.textContent = `${timeLeft}s`;

    if (timeLeft <= 0) {
      endTest();
    } else {
      updateStats();
    }
  }, 1000);
}

function updateStats() {
  const typedText = inputField.value;
  const timeElapsed = TOTAL_TIME - timeLeft;

  if (timeElapsed === 0) return;

  let correctChars = 0;
  charSpans.forEach((span, index) => {
    if (index < typedText.length && span.classList.contains('correct')) {
      correctChars++;
    }
  });

  // Standard WPM formula: (correct characters / 5) / (time elapsed in minutes)
  const wpm = Math.round((correctChars / 5) / (timeElapsed / 60));
  const accuracy = typedText.length > 0 ? Math.round((correctChars / typedText.length) * 100) : 100;

  wpmEl.textContent = Math.max(0, wpm);
  accuracyEl.textContent = `${Math.max(0, accuracy)}%`;
}

function handleInput() {
  if (!isTesting && inputField.value.length > 0) {
    startTimer();
  }

  const typedVal = inputField.value;

  charSpans.forEach((span, index) => {
    const typedChar = typedVal[index];
    span.classList.remove('current', 'correct', 'incorrect');

    if (typedChar == null) {
      if (index === typedVal.length) {
        span.classList.add('current');
      }
    } else if (typedChar === span.textContent) {
      span.classList.add('correct');
    } else {
      span.classList.add('incorrect');
    }
  });

  if (typedVal.length >= charSpans.length) {
    endTest();
  } else {
    updateStats();
  }
}

function endTest() {
  clearInterval(timer);
  isTesting = false;
  inputField.blur();
  updateStats();
}

// Keep input focused when clicking on text container
textDisplay.addEventListener('click', () => inputField.focus());
inputField.addEventListener('input', handleInput);
restartBtn.addEventListener('click', initTest);

// Initial run
initTest();
