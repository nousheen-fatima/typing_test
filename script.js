// ******** UTILITY FUNCTIONS START ********

const getElemById = (id) => document.getElementById(id);

// ******** UTILITY FUNCTIONS END ********

const randomWordElem = getElemById("random_word");
const userTypedWordElem = getElemById("typed_word");
const pronunciationElem = getElemById("pronunciation");
const definitionElem = getElemById("definition");
const accuracyScoreElem = getElemById("accuracy_score");
const timeScoreElem = getElemById("time_score");
const scoreElem = getElemById("score");
const timeTakenElem = getElemById("time_taken");
const spinnerElem = getElemById("spinner");
let startTime;
let endTime;
let backspaceCount = 0;
let apiRandomWord;

async function fetchRandomWord() {
  const url = "http://localhost:3000/word";
  try {
    spinnerElem.classList.remove("hide");
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Network response was not OK");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  } finally {
    spinnerElem.classList.add("hide");
  }
}

function setIntialValues() {
  userTypedWordElem.value = "";
  timeScoreElem.innerHTML = "";
  accuracyScoreElem.innerHTML = "";
  timeTakenElem.innerHTML = "";
  scoreElem.innerHTML = "";
  backspaceCount = 0;
  startTime = Date.now();
  userTypedWordElem.focus();
}
function getRandomWord() {
  fetchRandomWord().then((data) => {
    const response = data[0];
    apiRandomWord = response.word;
    randomWordElem.innerText = `Word to type is : ${apiRandomWord}`;
    randomWordElem.style.fontWeight = 900;
    definitionElem.innerHTML = `Definition : ${response.definition}`;
    pronunciationElem.innerHTML = `Pronunciation : ${response.pronunciation}`;
    setIntialValues();
  });
}

getRandomWord();

function regenerateWord() {
  getRandomWord();
}
function calculateAccuracyScore(randomWord, userTypedWord, backspaceCount) {
  let wrongLettersCount = 0;
  for (let i = 0; i < userTypedWord.length; i++) {
    if (randomWord[i] !== userTypedWord[i]) {
      wrongLettersCount++;
    }
  }
  const totalLetters = randomWord.length;
  const characterScore = 100 / totalLetters;
  const backspacePenalty = backspaceCount * characterScore;
  const wrongLetterpenalty = wrongLettersCount * characterScore;
  const accuracy = 100 - backspacePenalty - wrongLetterpenalty;
  accuracyScoreElem.innerHTML = `Accuracy score : ${accuracy.toFixed(2)}%`;
  return accuracy < 0 ? 0 : accuracy;
}

function calculateTimeScore() {
  const endTime = Date.now();
  const timeTakenInSeconds = Math.floor((endTime - startTime) / 1000);
  timeTakenElem.innerText = `Time taken by user: ${timeTakenInSeconds} seconds`;
  const rawScore =
    timeTakenInSeconds / (0.4 + 0.28 * (apiRandomWord.length + 1));
  const timeScore = rawScore < 1 ? 100 : 100 / rawScore;
  timeScoreElem.innerHTML = `Time Score : ${timeScore.toFixed(2)}`;
  return timeScore < 0 ? 0 : timeScore;
}

userTypedWordElem.addEventListener("keydown", function (event) {
  if (event.key == "Enter") {
    const userTypedWord = userTypedWordElem.value;
    const accuracyScore = calculateAccuracyScore(
      apiRandomWord,
      userTypedWord,
      backspaceCount
    );
    const timeScore = calculateTimeScore();
    const totalScore = (accuracyScore + timeScore) / 2;
    scoreElem.innerText = `Total score : ${totalScore.toFixed(2)}`;
  } else if (event.key == "Backspace") {
    backspaceCount++;
  }
});
