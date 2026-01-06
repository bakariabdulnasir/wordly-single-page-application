// DOM Elements
const form = document.getElementById("search-form");
const input = document.getElementById("search-input");
const errorMessage = document.getElementById("error-message");
const results = document.getElementById("results");

const wordEl = document.getElementById("word");
const phoneticEl = document.getElementById("phonetic");
const definitionEl = document.getElementById("definition");
const synonymsEl = document.getElementById("synonyms");
const audioEl = document.getElementById("audio");

// Event Listener
form.addEventListener("submit", handleSearch);

// Handle Search
async function handleSearch(event) {
  event.preventDefault();

  const word = input.value.trim();
  clearUI();

  if (!word) {
    showError("Please enter a word.");
    return;
  }

  try {
    const response = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
    );

    if (!response.ok) {
      throw new Error("Word not found");
    }

    const data = await response.json();
    displayResults(data[0]);
  } catch (error) {
    showError("Word not found. Please try another word.");
  }
}

// Display Results
function displayResults(data) {
  results.classList.remove("hidden");

  wordEl.textContent = data.word;

  phoneticEl.textContent =
    data.phonetics?.[0]?.text || "No pronunciation available";

  if (data.phonetics?.[0]?.audio) {
    audioEl.src = data.phonetics[0].audio;
    audioEl.classList.remove("hidden");
  } else {
    audioEl.classList.add("hidden");
  }

  const meaning = data.meanings[0];
  const definition = meaning.definitions[0];

  definitionEl.textContent = definition.definition;

  synonymsEl.textContent =
    definition.synonyms?.length
      ? definition.synonyms.join(", ")
      : "No synonyms available";
}

// Show Error Message
function showError(message) {
  errorMessage.textContent = message;
  errorMessage.classList.remove("hidden");
  results.classList.add("hidden");
}

// Clear UI
function clearUI() {
  errorMessage.classList.add("hidden");
  results.classList.add("hidden");
  audioEl.classList.add("hidden");
}
