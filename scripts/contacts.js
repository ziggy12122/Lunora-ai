document.getElementById("contact-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const inputs = [...this.querySelectorAll("input, textarea")];
  const allFilled = inputs.every((el) => el.value.trim() !== "");

  if (!allFilled) {
    alert("🚨 Please complete all fields before submitting.");
    return;
  }

  this.style.display = "none";
  document.querySelector(".form-success").hidden = false;

  // Optional: simulate sending...
  setTimeout(() => {
    this.reset();
    this.style.display = "block";
    document.querySelector(".form-success").hidden = true;
  }, 4000);
});