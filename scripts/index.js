
const steps = document.querySelectorAll(".step");
const stepItems = document.querySelectorAll(".step-item");

let currentStep = 0;

function updateUI() {
  steps.forEach((step, index) => {
    step.classList.toggle("active", index === currentStep);
  });

  stepItems.forEach((item, index) => {
    item.classList.remove("active", "completed");
    if (index < currentStep) {
      item.classList.add("completed");
    } else if (index === currentStep) {
      item.classList.add("active");
    }
  });
}

document.addEventListener("click", (e) => {
  if (e.target.tagName !== "BUTTON") return;

  const label = e.target.textContent.trim();

  if (label === "Next" && currentStep < steps.length - 1) {
    currentStep++;
    updateUI();
  }

  if (label === "Back" && currentStep > 0) {
    currentStep--;
    updateUI();
  }

  if (label === "Submit") {
    e.preventDefault();
    console.log("Form submitted");
  }
});

stepItems.forEach((item, index) => {
  item.addEventListener("click", () => {
    currentStep = index;
    updateUI();
  });
});

updateUI();
