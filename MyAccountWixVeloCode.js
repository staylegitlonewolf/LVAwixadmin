//MyAccount Wix Velo - Edit Profile

import { items } from '@wix/data';
import { authentication } from '@wix/members';
import { getCurrentMemberId } from 'public/repeatFunctions.js';
import { location } from '@wix/site-location';

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
            location.to('/login'); // Redirect to login if needed
            return;
        }

        // Get member's profile data
        memberData = await items.get("Main", currentMemberId);
        
        // Handle case where member data doesn't exist yet
        if (!memberData) {
            memberData = {
                _id: currentMemberId,
                role: "Member", // Default role
                email: "", // Will be populated from authentication
                name: "",
                contactEmail: "",
                phone: "",
                address: ""
            };
        }

        // Set profile photo if exists
        if (memberData?.profilePhoto) {
            $w('#myProfilePic1').src = memberData.profilePhoto;
            $w('#myProfilePic1').show();
        }

        // Handle iframe messaging
        setupIframeCommunication();

        // Handle photo upload
        setupPhotoUpload();

        // Handle form submit (if you still want this button)
        $w('#submitButton').onClick(() => {
            if (uploadedImageUrl) { 
                memberData.profilePhoto = uploadedImageUrl;
            }
            saveMemberData(memberData, true);
        });


    } catch (error) {
        console.error("Error in onReady:", error);
        showConfirmation("❌ Error loading profile data");
    }
});

// ===== Iframe Communication Setup =====
function setupIframeCommunication() {
    $w('#myaccountIframe').onMessage(async (event) => {
        if (!event.data) return;

        try {
            if (event.data === "ready") {
                // Send current member data to iframe when it signals ready
                $w('#myaccountIframe').postMessage(memberData);
                console.log("✅ Sent member data to iframe");
            }

            if (event.data?.type === "logoutRequest") {
                await handleLogout();
            }

            if (event.data?.type === "saveData" && event.data.payload) {
                await handleSaveData(event.data.payload);
            }

            if (event.data?.type === "navigateToApplication") {
                location.to('/application');
            }

            if (event.data?.type === "saveApplication" && event.data.payload) {
                await handleSaveApplication(event.data.payload);
            }

            if (event.data?.type === "getApplications") {
                await handleGetApplications();
            }

            if (event.data?.type === "getMyApplications" && event.data.payload) {
                await handleGetMyApplications(event.data.payload.memberId);
            }

            if (event.data?.type === "updateApplicationStatus" && event.data.payload) {
                await handleUpdateApplicationStatus(event.data.payload);
            }

            if (event.data?.type === "deleteApplication" && event.data.payload) {
                await handleDeleteApplication(event.data.payload.applicationId);
            }

        } catch (error) {
            console.error("Error handling iframe message:", error);
            $w('#myaccountIframe').postMessage({ 
                type: "saveError", 
                error: "Internal server error" 
            });
        }
    });
}

// ===== Handle Save Data =====
async function handleSaveData(payload) {
    try {
        // Validate required fields
        if (!payload.name || !payload.contactEmail) {
            throw new Error("Name and contact email are required");
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(payload.contactEmail)) {
            throw new Error("Please enter a valid email address");
        }

        // Phone validation (optional but if provided, should be valid)
        if (payload.phone && !/^[\+]?[1-9][\d]{0,15}$/.test(payload.phone.replace(/[\s\-\(\)]/g, ''))) {
            throw new Error("Please enter a valid phone number");
        }

        // Send saving status to iframe
        $w('#myaccountIframe').postMessage({ type: "saving" });

        // Merge payload with existing memberData
        Object.assign(memberData, payload);

        // If an uploadedImageUrl exists, keep it in memberData
        if (uploadedImageUrl) {
            memberData.profilePhoto = uploadedImageUrl;
        }

        // Save updated data
        await saveMemberData(memberData);

        // Send success message back to iframe
        $w('#myaccountIframe').postMessage({ type: "saveSuccess" });
        console.log("✅ Profile updated via iframe message");

    } catch (err) {
        console.error("Error saving profile data from iframe:", err);
        $w('#myaccountIframe').postMessage({ 
            type: "saveError", 
            error: err.message 
        });
    }
}

// ===== Handle Save Application =====
async function handleSaveApplication(payload) {
    try {
        // Send submitting status to iframe
        $w('#myaccountIframe').postMessage({ type: "submittingApplication" });

        // Save application to "Applications" collection
        const applicationData = {
            ...payload,
            _id: currentMemberId + '_' + Date.now(), // Unique ID
            memberId: currentMemberId,
            submissionDate: new Date().toISOString(),
            status: 'Pending'
        };

        await items.insert("Applications", applicationData);

        // Send success message back to iframe
        $w('#myaccountIframe').postMessage({ type: "applicationSuccess" });
        console.log("✅ Application saved to Applications collection");

    } catch (err) {
        console.error("Error saving application:", err);
        $w('#myaccountIframe').postMessage({ 
            type: "applicationError", 
            error: err.message 
        });
    }
}

// ===== Handle Logout =====
async function handleLogout() {
    try {
        await authentication.logout();
        location.to('/');
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
                $w("#myProfilePic1").src = uploadedImageUrl;
                $w("#myProfilePic1").show();
                showConfirmation("✅ Photo uploaded successfully!");
            })
            .catch((error) => {
                console.error("Upload error:", error);
                $w("#myProfilePic1").hide();
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

        await items.update("Main", newData);
        console.log("✅ Profile updated");

        if (redirect) {
            location.to(`/my-profile-page?member=${currentMemberId}`);
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

// ===== Handle Get Applications (Admin) =====
async function handleGetApplications() {
    try {
        // Get all applications from the Applications collection
        const applications = await items.query("Applications")
            .find()
            .then(results => results.items);

        // Send applications data back to iframe
        $w('#myaccountIframe').postMessage({ 
            type: "applicationsData", 
            applications: applications 
        });
        console.log("✅ Sent applications data to iframe:", applications.length, "applications");

    } catch (err) {
        console.error("Error getting applications:", err);
        $w('#myaccountIframe').postMessage({ 
            type: "applicationsError", 
            error: err.message 
        });
    }
}

// ===== Handle Get My Applications (Client) =====
async function handleGetMyApplications(memberId) {
    try {
        // Get applications for specific member
        const applications = await items.query("Applications")
            .eq("memberId", memberId)
            .find()
            .then(results => results.items);

        // Send applications data back to iframe
        $w('#myaccountIframe').postMessage({ 
            type: "myApplicationsData", 
            applications: applications 
        });
        console.log("✅ Sent my applications data to iframe:", applications.length, "applications");

    } catch (err) {
        console.error("Error getting my applications:", err);
        $w('#myaccountIframe').postMessage({ 
            type: "myApplicationsError", 
            error: err.message 
        });
    }
}

// ===== Handle Update Application Status =====
async function handleUpdateApplicationStatus(payload) {
    try {
        const { applicationId, status } = payload;

        // Update the application status
        await items.update("Applications", {
            _id: applicationId,
            status: status
        });

        // Send success message back to iframe
        $w('#myaccountIframe').postMessage({ type: "applicationUpdateSuccess" });
        console.log("✅ Application status updated:", applicationId, "to", status);

    } catch (err) {
        console.error("Error updating application status:", err);
        $w('#myaccountIframe').postMessage({ 
            type: "applicationUpdateError", 
            error: err.message 
        });
    }
}

// ===== Handle Delete Application =====
async function handleDeleteApplication(applicationId) {
    try {
        // Remove the application
        await items.remove("Applications", applicationId);

        // Send success message back to iframe
        $w('#myaccountIframe').postMessage({ type: "applicationDeleteSuccess" });
        console.log("✅ Application deleted:", applicationId);

    } catch (err) {
        console.error("Error deleting application:", err);
        $w('#myaccountIframe').postMessage({ 
            type: "applicationDeleteError", 
            error: err.message 
        });
    }
}
