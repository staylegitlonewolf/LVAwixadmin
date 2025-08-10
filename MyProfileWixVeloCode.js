//MyProfile Wix Velo
import wixData from 'wix-data';
import wixLocation from 'wix-location';
import { authentication } from 'wix-members';
import { getCurrentMemberId } from 'public/repeatFunctions.js';

let currentMemberId;
let memberData = {};

// ===== On Ready =====
$w.onReady(async function () {
    try {
        // Get logged-in member ID
        currentMemberId = await getCurrentMemberId();
        
        if (!currentMemberId) {
            console.warn("No member ID found — redirecting to login");
            wixLocation.to('/login');
            return;
        }

        // Get profile data from "Main" collection
        memberData = await wixData.get("Main", currentMemberId);

        // If no data exists yet, set default template
        if (!memberData) {
            memberData = getDefaultMemberData(currentMemberId);
        }

        // Show profile photo if exists
        if (memberData.profilePhoto) {
            $w('#myProfilePic').src = memberData.profilePhoto;
            $w('#myProfilePic').show();
        }

        // Set up iframe communication
        setupIframeCommunication();

    } catch (error) {
        console.error("❌ Error in onReady:", error);      
    }
});

// ===== Default Data Structure =====
function getDefaultMemberData(id) {
    return {
        _id: id,
        role: "Member",
        email: "", // will be set from authentication later if needed
        name: "",
        contactEmail: "",
        phone: "",
        address: "",
        profilePhoto: ""
    };
}

// ===== Iframe Communication =====
function setupIframeCommunication() {
    const iframe = $w('#myprofileIframe');

    iframe.onMessage(async (event) => {
        const data = event.data;
        if (!data) return;

        try {
            // When iframe is ready, send current member data
            if (data === "ready") {
                iframe.postMessage(memberData);
                console.log("✅ Sent member data to iframe");
            }

            // When iframe sends updated profile
            if (data.type === "saveProfile") {
                await wixData.update("Main", data.payload);
                memberData = data.payload; // update local copy
                iframe.postMessage({ type: "saveSuccess" });
                console.log("💾 Profile updated:", data.payload);
            }

        } catch (error) {
            console.error("❌ Error handling iframe message:", error);
            iframe.postMessage({ type: "saveError", error: error.message });
        }
    });
}