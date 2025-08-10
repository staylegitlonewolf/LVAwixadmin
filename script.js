let memberData = {};
const statusMessage = document.getElementById("statusMessage");

// Tell parent we’re ready to receive data
window.parent.postMessage("ready", "*");

// Receive data and messages from parent
window.addEventListener("message", (event) => {
  if (!event.data) return;

  // Initial data from parent (no type)
  if (typeof event.data === "object" && !event.data.type) {
    memberData = event.data;
    document.getElementById("idInput").value = memberData._id || "";
    document.getElementById("nameInput").value = memberData.name || "";
    document.getElementById("emailInput").value = memberData.email || "";
    document.getElementById("contactEmailInput").value = memberData.contactEmail || "";
    document.getElementById("phoneInput").value = memberData.phone || "";
    document.getElementById("addressInput").value = memberData.address || "";
    document.getElementById("roleDisplay").value = memberData.role || "—";
    statusMessage.textContent = ""; // clear status
  }

  // Save result feedback
  if (event.data.type === "saveSuccess") {
    statusMessage.style.color = "#0f0"; // green
    statusMessage.textContent = "✅ Profile saved successfully!";
  } else if (event.data.type === "saveError") {
    statusMessage.style.color = "#f33"; // red
    statusMessage.textContent = "❌ Error saving profile: " + (event.data.error || "Unknown error");
  }
});

// Send updated data to parent on save button click
document.getElementById("saveBtn").addEventListener("click", () => {
  const updatedData = {
    name: document.getElementById("nameInput").value,
    contactEmail: document.getElementById("contactEmailInput").value,
    phone: document.getElementById("phoneInput").value,
    address: document.getElementById("addressInput").value,
    email: document.getElementById("emailInput").value, // included for reference (readonly)
  };
  window.parent.postMessage({ type: "saveData", payload: updatedData }, "*");

  statusMessage.textContent = "Saving...";
  statusMessage.style.color = "#ccc";
});

// Send logout request to parent on logout button click
document.getElementById("logoutBtn").addEventListener("click", () => {
  window.parent.postMessage({ type: "logoutRequest" }, "*");
});
