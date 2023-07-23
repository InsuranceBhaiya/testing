function pushGoogleAds(adClientId, adSlotId, adContainer) {
    // Create the ad container
    var ad = document.createElement("ins");
    ad.className = "adsbygoogle";
    ad.style.display = "block";
    ad.setAttribute("data-ad-client", adClientId);
    ad.setAttribute("data-ad-slot", adSlotId);
    ad.setAttribute("data-ad-format", "auto");
  
    // Append the ad container to the specified section
    adContainer.appendChild(ad);
  
    // Initialize the ad
    (adsbygoogle = window.adsbygoogle || []).push({});
  }
  
  function refreshGoogleAds() {
    // Get all ad sections
    var adSections = document.getElementsByClassName("ad-section");
  
    // Refresh ads in each section
    for (var i = 0; i < adSections.length; i++) {
      var adSection = adSections[i];
      adSection.innerHTML = ""; // Clear the section
  
      // Push the Google Ad to the section again
      pushGoogleAds("ca-pub-5387266499802314", "6219538114", adSection);
    }
  }
  
  // Refresh ads every minute (60000 milliseconds)
  setInterval(refreshGoogleAds, 60000);