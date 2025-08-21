import { getLanguageOptions } from './languages.js';

// DOM elements
const elements = {
  startScreen: document.getElementById('start-screen'),
  startButton: document.getElementById('start-button'),
  appContainer: document.getElementById('app-container'),
  originalPanel: document.getElementById('original-panel'),
  translatedPanel: document.getElementById('translated-panel'),
  originalTranscript: document.getElementById('original-transcript'),
  translatedTranscript: document.getElementById('translated-transcript'),
  recognitionLanguageSelect: document.getElementById('recognition-language-select'),
  translationLanguageSelect: document.getElementById('translation-language-select'),
  languageModal: document.getElementById('language-modal'),
  settingsButton: document.getElementById('settings-button'),
  closeModalButton: document.getElementById('close-modal'),
  applySettingsButton: document.getElementById('apply-settings'),
  mainContainer: document.getElementById('main-container'),
  layoutSelect: document.getElementById('layout-select')
};

// App state
const state = {
  translator: null,
  recognition: null,
  currentTranscript: '',
  currentTranslation: '',
  debounceTimer: null,
  layout: 'vertical'
};

// Constants
const TRANSLATE_DEBOUNCE_MS = 200;
const DEFAULT_RECOGNITION_LANG = 'th-TH';
const DEFAULT_TRANSLATION_LANG = 'en-US';

// Utility functions
function scrollToBottom(container) {
  if (!container) return;
  container.scrollTop = container.scrollHeight;
}

function debounce(func, delay) {
  return function(...args) {
    clearTimeout(state.debounceTimer);
    state.debounceTimer = setTimeout(() => func.apply(this, args), delay);
  };
}

// Language management
function populateLanguageSelects() {
  const recognitionOptions = getLanguageOptions('recognition');
  const translationOptions = getLanguageOptions('translation');

  // Populate recognition select
  elements.recognitionLanguageSelect.innerHTML = recognitionOptions
    .map(option => `<option value="${option.value}">${option.text}</option>`)
    .join('');
  
  // Populate translation select
  elements.translationLanguageSelect.innerHTML = translationOptions
    .map(option => `<option value="${option.value}">${option.text}</option>`)
    .join('');

  // Set defaults
  elements.recognitionLanguageSelect.value = DEFAULT_RECOGNITION_LANG;
  elements.translationLanguageSelect.value = DEFAULT_TRANSLATION_LANG;
}

// Layout management
function applyLayout() {
  const isHorizontal = elements.layoutSelect.value === 'horizontal';
  elements.mainContainer.className = isHorizontal ? 'horizontal' : 'vertical';
  
  // Update scroll positions after layout change
  setTimeout(() => {
    scrollToBottom(elements.originalPanel);
    scrollToBottom(elements.translatedPanel);
  }, 100);
}

// Translation functions
async function initializeTranslator() {
  if (!window.Translator) {
    elements.translatedTranscript.textContent = 'Translator API not available.';
    return;
  }

  try {
    const sourceLang = elements.recognitionLanguageSelect.value.split('-')[0];
    const targetLang = elements.translationLanguageSelect.value;

    const availability = await Translator.availability({ sourceLanguage: sourceLang, targetLanguage: targetLang });

    if (availability.state === 'unavailable') {
      elements.translatedTranscript.textContent = `Translation not supported: ${sourceLang} → ${targetLang}`;
      state.translator = null;
      return;
    }

    if (availability.state === 'downloading') {
      elements.translatedTranscript.textContent = 'Downloading translation model...';
    }
    
    state.translator = await Translator.create({ sourceLanguage: sourceLang, targetLanguage: targetLang });
    
    if (state.currentTranscript) {
      translateText(state.currentTranscript);
    }

  } catch (error) {
    console.error('Translator initialization failed:', error);
    elements.translatedTranscript.textContent = 'Translator initialization failed.';
    state.translator = null;
  }
}

async function translateText(text) {
  if (!state.translator || !text) return;
  
  try {
    const result = await state.translator.translate(text);
    state.currentTranslation = result;
    elements.translatedTranscript.textContent = result;
    scrollToBottom(elements.translatedPanel);
  } catch (error) {
    console.error('Translation failed:', error);
    elements.translatedTranscript.textContent = 'Translation failed.';
  }
}

const debouncedTranslate = debounce(translateText, TRANSLATE_DEBOUNCE_MS);

// Speech recognition
function initializeSpeechRecognition() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    elements.originalTranscript.textContent = "Web Speech API not supported.";
    return;
  }

  state.recognition = new SpeechRecognition();
  state.recognition.continuous = true;
  state.recognition.interimResults = true;
  state.recognition.lang = elements.recognitionLanguageSelect.value;

  state.recognition.onresult = handleRecognitionResult;
  state.recognition.onerror = (event) => console.error('Speech recognition error:', event.error);
  state.recognition.onend = () => state.recognition.start();

  state.recognition.start();
}

function handleRecognitionResult(event) {
  let interimTranscript = '';
  let finalTranscript = '';
  
  for (let i = 0; i < event.results.length; i++) {
    const transcriptPart = event.results[i][0].transcript;
    if (event.results[i].isFinal) {
      finalTranscript += transcriptPart;
    } else {
      interimTranscript += transcriptPart;
    }
  }
  
  // Update display
  elements.originalTranscript.innerHTML = finalTranscript + 
    `<span style="color: white">${interimTranscript}</span>`;
  scrollToBottom(elements.originalPanel);

  // Translate live text
  const combinedText = (finalTranscript + interimTranscript).trim();
  if (combinedText) {
    debouncedTranslate(combinedText);
  }

  // Update final transcript and translate
  if (finalTranscript && finalTranscript.trim() !== state.currentTranscript.trim()) {
    state.currentTranscript = finalTranscript.trim();
    translateText(state.currentTranscript);
  }
}

// Modal management
function openSettingsModal() {
  elements.languageModal.showModal();
}

function closeSettingsModal() {
  elements.languageModal.close();
}

function applySettings() {
  // Update recognition language if changed
  if (state.recognition && state.recognition.lang !== elements.recognitionLanguageSelect.value) {
    state.recognition.lang = elements.recognitionLanguageSelect.value;
    state.recognition.stop();
  }
  
  // Apply layout
  applyLayout();
  
  // Reinitialize translator
  initializeTranslator();
  
  closeSettingsModal();
}

// Event setup
function setupEventListeners() {
  // Start button
  elements.startButton.addEventListener('click', startApp);
  
  // Settings modal
  elements.settingsButton.addEventListener('click', openSettingsModal);
  elements.closeModalButton.addEventListener('click', closeSettingsModal);
  elements.applySettingsButton.addEventListener('click', applySettings);
  
  // Layout change
  elements.layoutSelect.addEventListener('change', applyLayout);
  
  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 's') {
      openSettingsModal();
    }
  });
}

// App initialization
function startApp() {
  elements.startScreen.classList.add('hidden');
  elements.appContainer.classList.remove('hidden');
  
  // Set default layout
  elements.mainContainer.classList.add('vertical');
  elements.layoutSelect.value = 'vertical';
  
  populateLanguageSelects();
  initializeTranslator();
  initializeSpeechRecognition();
}

// Initialize app
setupEventListeners();
