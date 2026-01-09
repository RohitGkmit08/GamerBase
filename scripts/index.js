const steps = [...document.querySelectorAll(".step")];
const stepItems = [...document.querySelectorAll(".step-item")];
const successStep = document.querySelector(".success-step");

let currentStep = 0;
const LAST_STEP_INDEX = 4;
const DRAFT_KEY = "gamerBaseDraft";

// Error function
function showError(fieldId, message) {
  const errorEl = document.getElementById(`error-${fieldId}`);
  if (errorEl) {
    errorEl.textContent = message;
    errorEl.style.display = "block";
  }
  const inputEl = document.getElementById(fieldId);
  if (inputEl) {
    inputEl.classList.add("error");
  }
}

function hideError(fieldId) {
  const errorEl = document.getElementById(`error-${fieldId}`);
  if (errorEl) {
    errorEl.textContent = "";
    errorEl.style.display = "none";
  }
  const inputEl = document.getElementById(fieldId);
  if (inputEl) {
    inputEl.classList.remove("error");
  }
}

function clearAllErrors() {
  const errorFields = ["username", "email", "password", "confirm-password", "genre", "skill", "platforms", "avatar", "theme"];
  errorFields.forEach(field => hideError(field));
}

// Data collection
function collectFormValues() {
  const data = {
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    genre: "",
    skill: "",
    platforms: [],
    avatar: "",
    theme: ""
  };

  const usernameInput = document.getElementById("username");
  if (usernameInput) {
    data.username = usernameInput.value.trim();
  }

  const emailInput = document.getElementById("email");
  if (emailInput) {
    data.email = emailInput.value.trim();
  }

  const passwordInput = document.getElementById("password");
  if (passwordInput) {
    data.password = passwordInput.value;
  }

  const confirmPasswordInput = document.getElementById("confirm-password");
  if (confirmPasswordInput) {
    data.confirmPassword = confirmPasswordInput.value;
  }

  const genreSelect = document.getElementById("genre");
  if (genreSelect) {
    data.genre = genreSelect.value;
  }

 const skillInput = document.querySelector('input[name="skill"]:checked');
  if (skillInput) {
    data.skill = skillInput.value;
  }

  const platformInputs = document.querySelectorAll('input[name="platform"]:checked');
  platformInputs.forEach(input => {
    data.platforms.push(input.value);
  });

  const avatarInput = document.querySelector('input[name="avatar"]:checked');
    if (avatarInput) {
  data.avatar = avatarInput.value;
}

const themeInput = document.querySelector('input[name="theme"]:checked');
    if (themeInput) {
  data.theme = themeInput.value;
}

  return data;
}

function saveDraft(stepIndex) {
  try {
    const draft = collectFormValues();
    draft.currentStep = stepIndex;
    sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  } catch (e) {
    console.error("error saving draft:", e);
  }
}

function loadDraft() {
  try {
    const raw = sessionStorage.getItem(DRAFT_KEY);
    if (!raw) return;
    
    const draft = JSON.parse(raw);
    
    const usernameInput = document.getElementById("username");
    if (usernameInput && draft.username) {
      usernameInput.value = draft.username;
    }
    
    const emailInput = document.getElementById("email");
    if (emailInput && draft.email) {
      emailInput.value = draft.email;
    }
    
    const passwordInput = document.getElementById("password");
    if (passwordInput && draft.password !== undefined) {
      passwordInput.value = draft.password;
    }
    
    const confirmPasswordInput = document.getElementById("confirm-password");
    if (confirmPasswordInput && draft.confirmPassword !== undefined) {
      confirmPasswordInput.value = draft.confirmPassword;
    }
    
    const genreSelect = document.getElementById("genre");
    if (genreSelect && draft.genre) {
      genreSelect.value = draft.genre;
    }
    
    if (draft.skill) {
      const skillInputs = document.querySelectorAll('input[name="skill"]');
      skillInputs.forEach(input => {
        input.checked = (input.value === draft.skill);
      });
    }
    
    if (Array.isArray(draft.platforms)) {
      document.querySelectorAll('input[name="platform"]').forEach(cb => {
        cb.checked = draft.platforms.includes(cb.value);
      });
    }
    
    if (draft.avatar) {
      const avatarInputs = document.querySelectorAll('input[name="avatar"]');
      avatarInputs.forEach(input => {
        input.checked = (input.value === draft.avatar);
      });
    }
    
    if (draft.theme) {
      const themeInputs = document.querySelectorAll('input[name="theme"]');
      themeInputs.forEach(input => {
        input.checked = (input.value === draft.theme);
      });
    }
    
    if (typeof draft.currentStep === "number") {
      if (draft.currentStep < LAST_STEP_INDEX) {
        currentStep = draft.currentStep;
      } else {
        currentStep = LAST_STEP_INDEX - 1;
      }
    }
  } catch (e) {
    console.error("Error loading draft:", e);
  }
}


function validateStep0() {
  clearAllErrors();
  let isValid = true;
  
  const usernameInput = document.getElementById("username");
  if (!usernameInput || !usernameInput.value.trim()) {
    showError("username", "Username is required");
    isValid = false;
  } else if (usernameInput.value.trim().length < 4) {
    showError("username", "Username must be at least 4 characters");
    isValid = false;
  }
  
  const emailInput = document.getElementById("email");
  if (!emailInput || !emailInput.value.trim()) {
    showError("email", "Email is required");
    isValid = false;
  } else if (!emailInput.value.includes("@") || !emailInput.value.includes(".")) {
    showError("email", "Please enter a valid email address");
    isValid = false;
  }
  
  const passwordInput = document.getElementById("password");
  if (!passwordInput || !passwordInput.value) {
    showError("password", "Password is required");
    isValid = false;
  } else if (passwordInput.value.length < 8) {
    showError("password", "Password must be at least 8 characters");
    isValid = false;
  }
  
  const confirmPasswordInput = document.getElementById("confirm-password");
  if (!confirmPasswordInput || !confirmPasswordInput.value) {
    showError("confirm-password", "Please confirm your password");
    isValid = false;
  } else if (passwordInput && passwordInput.value !== confirmPasswordInput.value) {
    showError("confirm-password", "Passwords do not match");
    showError("password", "Passwords do not match");
    isValid = false;
  }
  
  return isValid;
}

function validateStep1() {
  clearAllErrors();
  let isValid = true;
  
  const genreSelect = document.getElementById("genre");
  if (!genreSelect || !genreSelect.value) {
    showError("genre", "Please select a game genre");
    isValid = false;
  }
  
  const skillInputs = document.querySelectorAll('input[name="skill"]:checked');
  if (skillInputs.length === 0) {
    showError("skill", "Please select your skill level");
    isValid = false;
  }
  
  const platformInputs = document.querySelectorAll('input[name="platform"]:checked');
  if (platformInputs.length === 0) {
    showError("platforms", "Please select at least one platform");
    isValid = false;
  }
  
  return isValid;
}

function validateStep2() {
  clearAllErrors();
  let isValid = true;
  
  const avatarInputs = document.querySelectorAll('input[name="avatar"]:checked');
  if (avatarInputs.length === 0) {
    showError("avatar", "Please select an avatar");
    isValid = false;
  }
  
  const themeInputs = document.querySelectorAll('input[name="theme"]:checked');
  if (themeInputs.length === 0) {
    showError("theme", "Please select a theme");
    isValid = false;
  }
  
  return isValid;
}

function updateUI() {
  steps.forEach((step, index) => {
    step.classList.toggle("active", index === currentStep);
  });

  if (currentStep === LAST_STEP_INDEX) {
    steps.forEach(step => step.classList.remove("active"));
    if (successStep) {
      successStep.classList.add("active");
    }
  } else {
    if (successStep) {
      successStep.classList.remove("active");
    }
  }

  stepItems.forEach((item, index) => {
    item.classList.remove("active", "completed");

    if (currentStep < LAST_STEP_INDEX) {
      if (index < currentStep) item.classList.add("completed");
      if (index === currentStep) item.classList.add("active");
    }
  });

  if (currentStep === 3) {
    populateReview();
  }
}


document.addEventListener("click", e => {
  if (e.target.tagName !== "BUTTON") return;

  const action = e.target.textContent.trim();

  if (action === "Next") {
    let isValid = true;
    
    if (currentStep === 0) {
      isValid = validateStep0();
    } else if (currentStep === 1) {
      isValid = validateStep1();
    } else if (currentStep === 2) {
      isValid = validateStep2();
    }
    
    if (!isValid) {
      return;
    }

    saveDraft(currentStep + 1);
    currentStep++;
    updateUI();
  }

  if (action === "Back" && currentStep > 0) {
    saveDraft(currentStep - 1);
    currentStep--;
    updateUI();
  }

  if (action === "Submit") {
    e.preventDefault();
    handleSubmit();
    
  }
});

document.querySelectorAll(".avatar-card, .theme-card").forEach(card => {
  card.addEventListener("click", () => {
    const radioInput = card.querySelector('input[type="radio"]');
    if (radioInput) {
      radioInput.checked = true;
      saveDraft(currentStep);

      
      if (radioInput.name === "avatar") {
        hideError("avatar");
      } else if (radioInput.name === "theme") {
        hideError("theme");
      }
    }
  });
});

const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirm-password");

if (passwordInput && confirmPasswordInput) {
  [passwordInput, confirmPasswordInput].forEach(field => {
    field.addEventListener("input", () => {
      if (confirmPasswordInput.value && passwordInput.value !== confirmPasswordInput.value) {
        showError("confirm-password", "Passwords do not match");
        showError("password", "Passwords do not match");
      } else {
        hideError("confirm-password");
        hideError("password");
      }
      saveDraft(currentStep);
    });
  });
}

function setupAutoSave() {
  const inputs = document.querySelectorAll('input, select');
  inputs.forEach(input => {
    input.addEventListener('input', () => {
      saveDraft(currentStep);
      
      if (input.id) {
        if (input.id === "username" && input.value.trim().length >= 4) {
          hideError("username");
        } else if (input.id === "email" && input.value.includes("@") && input.value.includes(".")) {
          hideError("email");
      }
    }

    });
    input.addEventListener('change', () => {
      saveDraft(currentStep);
      
      if (input.name === "skill") {
        hideError("skill");
      } else if (input.name === "platform") {
        hideError("platforms");
      } else if (input.id === "genre" && input.value) {
        hideError("genre");
      }
    });
  });
}

function populateReview() {
  const draft = collectFormValues();
  
  const reviewMap = {
    "review-username": draft.username || "",
    "review-email": draft.email || "",
    "review-genre": draft.genre || "",
    "review-skill": draft.skill || "",
    "review-platforms": draft.platforms.join(", ") || "",
    "review-avatar": draft.avatar || "",
    "review-theme": draft.theme || ""
  };

  for (const id in reviewMap) {
    const element = document.getElementById(id);
    if (element) {
      element.textContent = reviewMap[id];
    }
  }
}

function handleSubmit() {
  const draft = collectFormValues();
  
  const formData = {
    username: draft.username,
    email: draft.email,
    genre: draft.genre,
    skill: draft.skill,
    platforms: draft.platforms,
    avatar: draft.avatar,
    theme: draft.theme
  };

  saveToLocalStorage(formData);
  sessionStorage.removeItem(DRAFT_KEY);
  displaySubmittedData(formData);
}

function saveToLocalStorage(formData) {
  try {
    const submissions = JSON.parse(localStorage.getItem("gamerBaseSubmissions") || "[]");
    submissions.push(formData);
    localStorage.setItem("gamerBaseSubmissions", JSON.stringify(submissions));
  } catch (e) {
    console.error("Error saving to localStorage:", e);
  }
}

function displaySubmittedData(formData) {
  const successUsernameEl = document.getElementById("success-username");
  if (successUsernameEl) {
    successUsernameEl.textContent = formData.username;
  }
  currentStep = LAST_STEP_INDEX;
  updateUI();
}

loadDraft();
updateUI();
setupAutoSave();
