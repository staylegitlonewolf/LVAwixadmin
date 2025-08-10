//MyProfile Wix Velo - Display/View Only
import wixData from 'wix-data';
import wixLocation from 'wix-location';
import { getCurrentMemberId } from 'public/repeatFunctions.js';

let selectedMemberId, currentMemberId;
let profileData = {}; 

$w.onReady(function () {
    initPage(profileData);
    goToProfilePage();
});

async function goToProfilePage() {
    const selectedMemberObject = wixLocation.query;
    const selectedMemberArr = Object.values(selectedMemberObject);
    selectedMemberId = selectedMemberArr[0];
    
    // Get the current member's ID
    currentMemberId = await getCurrentMemberId();
    
    if (currentMemberId === selectedMemberId) {   
        // Fill out the profile template with the data from the ID of the page URL (selected member's ID)
        profileData = await wixData.get('Main', currentMemberId);
        console.log("✅ Loaded current member profile data:", profileData);
    } else {
        // Get the profile data of the selected member (viewing someone else's profile)
        profileData = await wixData.get('Main', selectedMemberId);
        console.log("✅ Loaded selected member profile data:", profileData);
    }
    
    initPage(profileData);
}

// Initialize your profile page with data from the data collection
function initPage(profileData) {
    try {
        // Set profile photo
        if (profileData?.profilePhoto) {
            $w('#myProfilePic').src = profileData.profilePhoto;
            $w('#myProfilePic').show();
        } else {
            $w('#myProfilePic').hide();
        }
        
        // Set text fields
        $w('#myName').text = profileData?.name || 'No name provided';
        $w('#myEmail').text = profileData?.email || 'No email provided';
        $w('#mySubtitle').text = profileData?.subtitle || 'No subtitle provided';
        
        // Set additional profile fields if they exist
        if (profileData?.displayName) {
            $w('#myDisplayName').text = profileData.displayName;
        }
        
        if (profileData?.bio) {
            $w('#myBio').text = profileData.bio;
        }
        
        if (profileData?.location) {
            $w('#myLocation').text = profileData.location;
        }
        
        if (profileData?.interests) {
            $w('#myInterests').text = profileData.interests;
        }
        
        if (profileData?.website) {
            $w('#myWebsite').text = profileData.website;
        }
        
        console.log("✅ Profile page initialized successfully");
        
    } catch (error) {
        console.error("❌ Error initializing profile page:", error);
    }
}

// When the path (member ID changes)
wixLocation.onChange((location) => {
    goToProfilePage();
});