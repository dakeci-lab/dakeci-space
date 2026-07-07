document.addEventListener("DOMContentLoaded", () => {
  initSiteNav();
  initPasswordGenerator();
});

function initSiteNav() {
  const toggle = document.querySelector("[data-nav-toggle]");
  const nav = document.querySelector("[data-site-nav]");

  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });
}

function initPasswordGenerator() {
  const passwordGenerator = document.querySelector("[data-password-generator]");
  if (!passwordGenerator) return;

  const resultEl = passwordGenerator.querySelector("[data-password-result]");
  const messageEl = passwordGenerator.querySelector("[data-password-message]");
  const rangeEl = passwordGenerator.querySelector("[data-password-range]");
  const lengthEl = passwordGenerator.querySelector("[data-password-length]");
  const generateBtn = passwordGenerator.querySelector("[data-password-generate]");
  const copyBtn = passwordGenerator.querySelector("[data-password-copy]");
  const lowercaseEl = passwordGenerator.querySelector("[data-password-lowercase]");
  const uppercaseEl = passwordGenerator.querySelector("[data-password-uppercase]");
  const digitsEl = passwordGenerator.querySelector("[data-password-digits]");
  const symbolsEl = passwordGenerator.querySelector("[data-password-symbols]");

  if (
    !resultEl ||
    !messageEl ||
    !rangeEl ||
    !lengthEl ||
    !generateBtn ||
    !copyBtn ||
    !lowercaseEl ||
    !uppercaseEl ||
    !digitsEl ||
    !symbolsEl
  ) {
    return;
  }

  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const digits = "0123456789";
  const symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?";
  const emptyResultText = "Нажмите «Сгенерировать»";

  function normalizeLength(value) {
    let number = parseInt(value, 10);

    if (Number.isNaN(number)) {
      number = 16;
    }

    if (number < 4) number = 4;
    if (number > 50) number = 50;

    return number;
  }

  function syncLength(value) {
    const length = normalizeLength(value);
    rangeEl.value = length;
    lengthEl.value = length;
    return length;
  }

  function getCharacters() {
    let chars = "";

    if (lowercaseEl.checked) chars += lowercase;
    if (uppercaseEl.checked) chars += uppercase;
    if (digitsEl.checked) chars += digits;
    if (symbolsEl.checked) chars += symbols;

    return chars;
  }

  function setMessage(text, isError = false) {
    messageEl.textContent = text;
    messageEl.classList.toggle("error", isError);
  }

  function generatePassword() {
    const length = syncLength(lengthEl.value);
    const chars = getCharacters();

    if (!chars) {
      resultEl.textContent = emptyResultText;
      setMessage("Выберите хотя бы один тип символов", true);
      return "";
    }

    let password = "";

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      password += chars[randomIndex];
    }

    resultEl.textContent = password;
    setMessage("");
    return password;
  }

  rangeEl.addEventListener("input", () => {
    syncLength(rangeEl.value);
    generatePassword();
  });

  lengthEl.addEventListener("input", () => {
    syncLength(lengthEl.value);
    generatePassword();
  });

  lengthEl.addEventListener("change", () => {
    syncLength(lengthEl.value);
    generatePassword();
  });

  [lowercaseEl, uppercaseEl, digitsEl, symbolsEl].forEach((checkbox) => {
    checkbox.addEventListener("change", generatePassword);
  });

  generateBtn.addEventListener("click", generatePassword);

  copyBtn.addEventListener("click", async () => {
    const password = resultEl.textContent.trim();

    if (!password || password === emptyResultText) {
      setMessage("Сначала сгенерируйте пароль", true);
      return;
    }

    if (!navigator.clipboard || !navigator.clipboard.writeText) {
      setMessage("Не удалось скопировать пароль", true);
      return;
    }

    try {
      await navigator.clipboard.writeText(password);
      setMessage("Пароль скопирован");
    } catch (error) {
      console.error("Clipboard error:", error);
      setMessage("Не удалось скопировать пароль", true);
    }
  });

  generatePassword();
}
