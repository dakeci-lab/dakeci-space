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
  const tool = document.getElementById("passwordTool");
  if (!tool) return;

  const lengthRange = document.getElementById("passwordLengthRange");
  const lengthNumber = document.getElementById("passwordLengthNumber");
  const useLowercase = document.getElementById("useLowercase");
  const useUppercase = document.getElementById("useUppercase");
  const useDigits = document.getElementById("useDigits");
  const useSymbols = document.getElementById("useSymbols");
  const generateBtn = document.getElementById("generatePasswordBtn");
  const copyBtn = document.getElementById("copyPasswordBtn");
  const output = document.getElementById("passwordOutput");
  const status = document.getElementById("passwordStatus");

  const CHARSET = {
    lowercase: "abcdefghijklmnopqrstuvwxyz",
    uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    digits: "0123456789",
    symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?"
  };

  let currentPassword = "";

  function clampLength(value) {
    const num = Number(value);
    if (!Number.isFinite(num)) return 16;
    return Math.min(50, Math.max(4, Math.round(num)));
  }

  function syncLength(value) {
    const length = clampLength(value);
    lengthRange.value = String(length);
    lengthNumber.value = String(length);
    return length;
  }

  function setStatus(message, isError = false) {
    status.textContent = message;
    status.classList.toggle("error", isError);
  }

  function getCharacterPool() {
    let pool = "";

    if (useLowercase.checked) pool += CHARSET.lowercase;
    if (useUppercase.checked) pool += CHARSET.uppercase;
    if (useDigits.checked) pool += CHARSET.digits;
    if (useSymbols.checked) pool += CHARSET.symbols;

    return pool;
  }

  function generatePassword() {
    const pool = getCharacterPool();

    if (!pool) {
      currentPassword = "";
      output.textContent = "—";
      setStatus("Выберите хотя бы один тип символов", true);
      return "";
    }

    const length = syncLength(lengthNumber.value);
    let password = "";

    for (let i = 0; i < length; i++) {
      const index = Math.floor(Math.random() * pool.length);
      password += pool[index];
    }

    currentPassword = password;
    output.textContent = password;
    setStatus("");
    return password;
  }

  async function copyPassword() {
    if (!currentPassword) {
      setStatus("Сначала сгенерируйте пароль", true);
      return;
    }

    if (!navigator.clipboard || !navigator.clipboard.writeText) {
      setStatus("Не удалось скопировать пароль", true);
      return;
    }

    try {
      await navigator.clipboard.writeText(currentPassword);
      setStatus("Пароль скопирован");
    } catch {
      setStatus("Не удалось скопировать пароль", true);
    }
  }

  lengthRange.addEventListener("input", () => {
    syncLength(lengthRange.value);
    generatePassword();
  });

  lengthNumber.addEventListener("input", () => {
    syncLength(lengthNumber.value);
    generatePassword();
  });

  lengthNumber.addEventListener("change", () => {
    syncLength(lengthNumber.value);
    generatePassword();
  });

  [useLowercase, useUppercase, useDigits, useSymbols].forEach((checkbox) => {
    checkbox.addEventListener("change", generatePassword);
  });

  generateBtn.addEventListener("click", generatePassword);
  copyBtn.addEventListener("click", copyPassword);

  generatePassword();
}
