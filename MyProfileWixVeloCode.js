//MyProfile Wix Velo - Display Only
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

        // Populate the display elements
        populateProfileDisplay(memberData);

    } catch (error) {
        console.error("❌ Error in onReady:", error);      
    }
});

// ===== Default Data Structure =====
function getDefaultMemberData(id) {
    return {
        _id: id,
        email: "",
        name: 'Your Name',
        role: 'Member',       
        title_fld: 'LVA',
        location: '',
        contactEmail: '',
        phone: '',
        profilePhoto: ""
    };
}

// ===== Populate Profile Display =====
function populateProfileDisplay(data) {
    try {
        // Show profile photo if exists
        if (data.profilePhoto) {
            $w('#myProfilePic').src = data.profilePhoto;
            $w('#myProfilePic').show();
        } else {
            $w('#myProfilePic').hide();
        }
        
        // Populate text fields with the specific fields requested
        $w('#myId').text = data._id || 'No ID provided';
        $w('#myEmail').text = data.email || 'No email provided';
        $w('#myName').text = data.name || 'Your Name';
        $w('#myRole').text = data.role || 'Member';
        $w('#myTitle').text = data.title_fld || 'LVA';
        $w('#myLocation').text = data.location || 'No location provided';
        $w('#myContactEmail').text = data.contactEmail || 'No contact email provided';
        $w('#myPhone').text = data.phone || 'No phone provided';
        
        console.log("✅ Profile display populated successfully");
        
    } catch (error) {
        console.error("❌ Error populating profile display:", error);
    }
}