import wixData from 'wix-data';
import wixWindow from 'wix-window';
import { authentication } from 'wix-members';
import { getCurrentMemberId } from 'public/repeatFunctions.js';
import wixLocation from 'wix-location';

let currentMemberId;
let memberData = {};
let uploadedImageUrl = "";

// ===== On Ready =====
$w.onReady(async function () {
  try {
    // Get logged-in member ID
    currentMemberId = await getCurrentMemberId();
    
    // Get member's profile data
    memberData = await wixData.get("Main", currentMemberId);
    
    // Initialize with default values if member doesn't exist
    if (!memberData) {
      memberData = {
        name: '',
        email: '',
        contactEmail: '',
        phone: '',
        address: '',
        displayName: '',
        bio: '',
        website: '',
        location: '',
        interests: '',
        socialLinks: {
          twitter: '',
          linkedin: '',
          instagram: ''
        }
      };
    }

    // Handle iframe messaging
    setupIframeCommunication();
    
    // Handle photo upload
    setupPhotoUpload();
    
  } catch (error) {
    console.error('Error in onReady:', error);
  }
});

// ===== Setup Iframe Communication =====
function setupIframeCommunication() {
  $w('#profileIframe').onMessage(async (event) => {
    if (event.data === "ready") {
      // Send current member data to iframe when it signals ready
      $w('#profileIframe').postMessage(memberData);
    }
    
    if (event.data?.type === "logoutRequest") {
      await handleLogout();
    }
    
    if (event.data?.type === "saveProfileData" && event.data.payload) {
      await handleSaveProfileData(event.data.payload);
    }
  });
}

// ===== Handle Logout =====
async function handleLogout() {
  try {
    await authentication.logout();
    wixLocation.to('/');
  } catch (error) {
    console.error('Error during logout:', error);
  }
}

// ===== Handle Save Profile Data =====
async function handleSaveProfileData(payload) {
  try {
    // Send saving status to iframe
    $w('#profileIframe').postMessage({ type: "saving" });
    
    // Server-side validation
    if (!payload.displayName || payload.displayName.trim().length === 0) {
      throw new Error("Display name is required");
    }
    
    // Website validation (optional but if provided, should be valid)
    if (payload.website && payload.website.trim() && 
        !/^https?:\/\/.+/.test(payload.website.trim())) {
      throw new Error("Please enter a valid website URL (include http:// or https://)");
    }
    
    // Merge payload with existing memberData
    Object.assign(memberData, payload);
    
    // If an uploadedImageUrl exists, keep it in memberData
    if (uploadedImageUrl) {
      memberData.profilePhoto = uploadedImageUrl;
    }
    
    // Save updated data
    await saveMemberData(memberData);
    
    // Send success message back to iframe
    $w('#profileIframe').postMessage({ type: "saveSuccess" });
    console.log("✅ Profile updated via iframe message");
    
  } catch (err) {
    console.error("Error saving profile data from iframe:", err);
    $w('#profileIframe').postMessage({ 
      type: "saveError", 
      error: err.message 
    });
  }
}

// ===== Setup Photo Upload =====
function setupPhotoUpload() {
  $w("#myUploadButton").onChange(() => {
    const file = $w("#myUploadButton").value;
    if (!file) return;
    
    $w("#myUploadButton").startUpload()
      .then(uploadedFile => {
        uploadedImageUrl = uploadedFile.url;
        $w("#myProfilePic").src = uploadedImageUrl;
        $w("#myProfilePic").show();
        showConfirmation("✅ Photo uploaded!");
      })
      .catch(() => {
        $w("#myProfilePic").hide();
        showConfirmation("❌ Upload failed.");
      });
  });
}

// ===== Save Member Data =====
async function saveMemberData(updatedData, redirect = false) {
  const newData = { ...updatedData };
  
  // Ensure _id is present for update
  if (!newData._id) {
    newData._id = currentMemberId;
  }
  
  await wixData.update("Main", newData);
  console.log("✅ Profile updated");
  
  if (redirect) {
    wixLocation.to(`/my-profile-page?member=${currentMemberId}`);
  }
}

// ===== Confirmation Message =====
function showConfirmation(message) {
  $w('#confirmText').text = message;
  $w('#confirmText').show();
  setTimeout(() => {
    $w('#confirmText').hide();
  }, 3000);
}
