const share_btn = document.querySelector('#share_btn');
document.addEventListener('click', (event) => {
	const withinBoundaries = event.composedPath().includes(share_btn);
	if (!withinBoundaries) {
		document.querySelector("label[for='share_btn']").style.backgroundColor = "#e2ecfc";
		document.querySelector("#share_btn").checked = false;
	} else {
		document.querySelector("label[for='share_btn']").style.backgroundColor = "#cce0ff";
	}
})

function copyToClipboard() {
	const articleUrl = window.location.origin + window.location.pathname;
	var temp = document.createElement("input");
	document.body.appendChild(temp);
	temp.value = articleUrl;
	temp.select();
	document.execCommand("copy");
	document.body.removeChild(temp);
	alert("Link copied to clipboard!");
}

const shareBtn = document.getElementById('shareBtn')

shareBtn.addEventListener('click', event => {
	// Check for Web Share api support
	if (navigator.share) {
		const articleTitle = document.querySelector("title").innerText;
		const articleUrl = window.location.origin + window.location.pathname;
		// Browser supports native share api
		navigator.share({
			text: articleTitle,
			url: articleUrl
		}).then(() => {
			console.log('Thanks for sharing!');
		})
			.catch((err) => console.error(err));
	} else {
		// Fallback
		alert("The current browser does not support the share function. Please, manually share the link")
	}
});

function shareOnSocialMedia(platform) {
	const articleTitle = document.querySelector("title").innerText;
	const articleSummary = document.querySelector("meta[name='description']").content;
	const articleUrl = window.location.origin + window.location.pathname;
	
	// Facebook
	if(platform.toLowerCase() === "facebook") {
		window.open(`https://www.facebook.com/sharer/sharer.php?u=${articleUrl}`, 'Facebook Share', 'width=800,height=600'); 
		return false;
	}
	// Twitter
	if(platform.toLowerCase() === "twitter") {
		window.open(`https://twitter.com/intent/tweet?url=${articleUrl}`, 'Twitter Share', 'width=800,height=600');
		return false;
	}
	// LinkedIn
	if(platform.toLowerCase() === "linkedin") {
		window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${articleUrl}&title=${articleTitle.replace(/ /g, '%20')}&summary=${articleSummary.replace(/ /g, '%20')}`, 'LinkedIn Share', 'width=800,height=600');
		return false;
	}
	// WhatsApp
	if(platform.toLowerCase() === "whatsapp") {
		window.open(`whatsapp://send?text=Check%20out%20this%20website:%20${articleUrl}`);
		return false;
	}
	// Pinterest
	if(platform.toLowerCase() === "pinterest") {
		window.open(`https://www.pinterest.com/pin/create/button/?url=${articleUrl}`, 'Pinterest Share', 'width=800, height=600');
		return false;
	}
}


window.onscroll = function() {scrollFunction()};
function scrollFunction() {
	if (window.innerWidth < 768) {
		if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
			document.querySelector("#bH .nav-logo-box img").src = "/assets/logo/logo-xs.svg";
			document.querySelector("#bH .nav-logo-box img").setAttribute("width", "auto");
			document.querySelector("#bH .social-feeds a.fa-instagram").style.display = "grid";
			document.querySelector("#bH .social-feeds a.fa-linkedin").style.display = "grid";
		} else {
			document.querySelector("#bH .nav-logo-box img").src = "/assets/logo/logo-horizontal-dark.png";
			document.querySelector("#bH .nav-logo-box img").setAttribute("width", "175px");
			document.querySelector("#bH .social-feeds a.fa-instagram").style.display = "none";
			document.querySelector("#bH .social-feeds a.fa-linkedin").style.display = "none";
		}
	} else {
		return
	}
  }

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
  refreshGoogleAds()
//   setInterval(refreshGoogleAds, 60000);