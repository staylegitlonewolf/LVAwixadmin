//MyProfile Wix Velo
import wixData from 'wix-data';
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
        
        if (!currentMemberId) {
            console.error("No member ID found - user may not be logged in");
            wixLocation.to('/login'); // Redirect to login if needed
            return;
        }

        // Get member's profile data
        memberData = await wixData.get("Main", currentMemberId);
        
        // Handle case where member data doesn't exist yet
        if (!memberData) {
            memberData = {
                _id: currentMemberId,
                role: "Member", // Default role
                email: "", // Will be populated from authentication
                name: "",
                contactEmail: "",
                phone: "",
                address: "",
                displayName: "",
                bio: "",
                website: "",
                location: "",
                interests: "",
                socialLinks: {
                    twitter: '',
                    linkedin: '',
                    instagram: ''
                }
            };
        }

        // Set profile photo if exists
        if (memberData?.profilePhoto) {
            $w('#myProfilePic').src = memberData.profilePhoto;
            $w('#myProfilePic').show();
        }

        // Handle iframe messaging
        setupIframeCommunication();

        // Handle photo upload
        setupPhotoUpload();

    } catch (error) {
        console.error("Error in onReady:", error);
        showConfirmation("❌ Error loading profile data");
    }
});

// ===== Iframe Communication Setup =====
function setupIframeCommunication() {
    $w('#profileIframe').onMessage(async (event) => {
        if (!event.data) return;

        try {
            if (event.data === "ready") {
                // Send current member data to iframe when it signals ready
                $w('#profileIframe').postMessage(memberData);
                console.log("✅ Sent member data to iframe");
            }

            if (event.data?.type === "logoutRequest") {
                await handleLogout();
            }

            if (event.data?.type === "saveProfileData" && event.data.payload) {
                await handleSaveProfileData(event.data.payload);
            }

        } catch (error) {
            console.error("Error handling iframe message:", error);
            $w('#profileIframe').postMessage({ 
                type: "saveError", 
                error: "Internal server error" 
            });
        }
    });
}

// ===== Handle Save Profile Data =====
async function handleSaveProfileData(payload) {
    try {
        // Server-side validation
        if (!payload.displayName || payload.displayName.trim().length === 0) {
            throw new Error("Display name is required");
        }
        
        // Website validation (optional but if provided, should be valid)
        if (payload.website && payload.website.trim() && 
            !/^https?:\/\/.+/.test(payload.website.trim())) {
            throw new Error("Please enter a valid website URL (include http:// or https://)");
        }

        // Send saving status to iframe
        $w('#profileIframe').postMessage({ type: "saving" });

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

// ===== Handle Logout =====
async function handleLogout() {
    try {
        await authentication.logout();
        wixLocation.to('/');
    } catch (error) {
        console.error('Error during logout:', error);
        showConfirmation("❌ Error during logout");
    }
}

// ===== Photo Upload Setup =====
function setupPhotoUpload() {
    $w("#myUploadButton").onChange(() => {
        const file = $w("#myUploadButton").value;
        if (!file) return;

        // Show loading state
        showConfirmation("⏳ Uploading photo...");

        $w("#myUploadButton").startUpload()
            .then(uploadedFile => {
                uploadedImageUrl = uploadedFile.url;
                $w("#myProfilePic").src = uploadedImageUrl;
                $w("#myProfilePic").show();
                showConfirmation("✅ Photo uploaded successfully!");
            })
            .catch((error) => {
                console.error("Upload error:", error);
                $w("#myProfilePic").hide();
                showConfirmation("❌ Upload failed. Please try again.");
            });
    });
}

// ===== Save Member Data =====
async function saveMemberData(updatedData, redirect = false) {
    try {
        const newData = { ...updatedData };
        
        // Ensure we have the required _id field
        if (!newData._id) {
            newData._id = currentMemberId;
        }

        await wixData.update("Main", newData);
        console.log("✅ Profile updated");

        if (redirect) {
            wixLocation.to(`/my-profile-page?member=${currentMemberId}`);
        }
    } catch (error) {
        console.error("Error saving member data:", error);
        throw new Error("Failed to save profile data");
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
