let memberData = {};
const statusMessage = document.getElementById("statusMessage");

// Tell parent we're ready to receive data
window.parent.postMessage("ready", "*");

// Receive data and messages from parent
window.addEventListener("message", (event) => {
  if (!event.data) return;

  // Initial data from parent (no type)
  if (typeof event.data === "object" && !event.data.type) {
    memberData = event.data;
    populateFormFields();
    clearStatus();
  }

  // Save result feedback
  if (event.data.type === "saveSuccess") {
    showStatus("✅ Profile saved successfully!", "success");
  } else if (event.data.type === "saveError") {
    showStatus("❌ Error saving profile: " + (event.data.error || "Unknown error"), "error");
    // Re-enable save button if save failed
    enableSaveButton();
  } else if (event.data.type === "saving") {
    showStatus("⏳ Saving profile...", "loading");
  }
});

// Populate form fields with member data
function populateFormFields() {
  document.getElementById("idInput").value = memberData._id || "";
  document.getElementById("nameInput").value = memberData.name || "";
  document.getElementById("emailInput").value = memberData.email || "";
  document.getElementById("contactEmailInput").value = memberData.contactEmail || "";
  document.getElementById("phoneInput").value = memberData.phone || "";
  document.getElementById("addressInput").value = memberData.address || "";
  document.getElementById("roleDisplay").value = memberData.role || "—";
}

// Show status message with appropriate styling
function showStatus(message, type = "info") {
  statusMessage.textContent = message;
  
  switch (type) {
    case "success":
      statusMessage.style.color = "#28a745";
      break;
    case "error":
      statusMessage.style.color = "#dc3545";
      break;
    case "loading":
      statusMessage.style.color = "#ffc107";
      break;
    default:
      statusMessage.style.color = "#6c757d";
  }
}

// Clear status message
function clearStatus() {
  statusMessage.textContent = "";
}

// Disable save button during save operation
function disableSaveButton() {
  const saveBtn = document.getElementById("saveBtn");
  saveBtn.disabled = true;
  saveBtn.textContent = "⏳ Saving...";
  saveBtn.style.opacity = "0.6";
  saveBtn.style.cursor = "not-allowed";
}

// Enable save button after save operation
function enableSaveButton() {
  const saveBtn = document.getElementById("saveBtn");
  saveBtn.disabled = false;
  saveBtn.textContent = "💾 Save Changes";
  saveBtn.style.opacity = "1";
  saveBtn.style.cursor = "pointer";
}

// Validate form data
function validateForm() {
  const name = document.getElementById("nameInput").value.trim();
  const contactEmail = document.getElementById("contactEmailInput").value.trim();
  const phone = document.getElementById("phoneInput").value.trim();
  const address = document.getElementById("addressInput").value.trim();

  // Basic validation
  if (!name) {
    showStatus("❌ Name is required", "error");
    return false;
  }

  if (!contactEmail) {
    showStatus("❌ Contact email is required", "error");
    return false;
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(contactEmail)) {
    showStatus("❌ Please enter a valid email address", "error");
    return false;
  }

  // Phone validation (optional but if provided, should be valid)
  if (phone && !/^[\+]?[1-9][\d]{0,15}$/.test(phone.replace(/[\s\-\(\)]/g, ''))) {
    showStatus("❌ Please enter a valid phone number", "error");
    return false;
  }

  return true;
}

// Send updated data to parent on save button click
document.getElementById("saveBtn").addEventListener("click", () => {
  if (!validateForm()) {
    return;
  }

  const updatedData = {
    name: document.getElementById("nameInput").value.trim(),
    contactEmail: document.getElementById("contactEmailInput").value.trim(),
    phone: document.getElementById("phoneInput").value.trim(),
    address: document.getElementById("addressInput").value.trim(),
    email: document.getElementById("emailInput").value, // included for reference (readonly)
  };

  // Disable save button and show loading state
  disableSaveButton();
  showStatus("⏳ Saving profile...", "loading");

  // Send data to parent
  window.parent.postMessage({ type: "saveData", payload: updatedData }, "*");
});

// Send logout request to parent on logout button click
document.getElementById("logoutBtn").addEventListener("click", () => {
  if (confirm("Are you sure you want to logout?")) {
    showStatus("⏳ Logging out...", "loading");
    window.parent.postMessage({ type: "logoutRequest" }, "*");
  }
});

// Add real-time validation feedback
document.getElementById("nameInput").addEventListener("input", () => {
  const name = document.getElementById("nameInput").value.trim();
  if (name.length > 0 && name.length < 2) {
    showStatus("⚠️ Name should be at least 2 characters", "info");
  } else {
    clearStatus();
  }
});

document.getElementById("contactEmailInput").addEventListener("input", () => {
  const email = document.getElementById("contactEmailInput").value.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (email.length > 0 && !emailRegex.test(email)) {
    showStatus("⚠️ Please enter a valid email address", "info");
  } else {
    clearStatus();
  }
});

// Clear status when user starts typing in any field
document.querySelectorAll('input:not([readonly])').forEach(input => {
  input.addEventListener('input', () => {
    if (statusMessage.textContent.includes("⚠️")) {
      clearStatus();
    }
  });
});
