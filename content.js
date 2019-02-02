
var observer = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
		if (mutation.addedNodes.length) {
	    	if (mutation.type == 'childList') {
	    		console.log(mutation.target.innerText);
	    		if (document.getElementById('lyrics-iframe')) {
	    			// if the iframe exists then remove it and update it with the new one
	    			$('#lyrics-iframe').remove();
	    			getData(mutation.target.innerText);
	    		}
	    	}
	    }
	    })
    })

// create the new iframe to display song lyrics. Maybe also work for video transcripts. 
function getData(search)  {
  var xhr = new XMLHttpRequest();	
  var searchQuery = "https://www.google.com/search?q=" + fixedEncodeURIComponent(search) + fixedEncodeURIComponent(' lyrics');
  console.log(searchQuery);

  xhr.open( "GET", searchQuery, true)
  // xhr.onreadystatechange = function() {
    if (xhr.readyState == 4 && xhr.status == 200) {
      // console.log(xhr.responseText);
		// newIframe(xhr.responseText);
		var parser = new DOMParser();
		var doc = parser.parseFromString(xhr.responseText, "text/html");

		// if (doc.querySelectorAll('div.SALvLe.farUxc.mJ2Mod')) {
			var parsedLyrics = doc.querySelectorAll('div.SALvLe.farUxc.mJ2Mod')[0].innerText;
			newIframe(parsedLyrics);
			// let's do some CSS for the time being seeing as this just about works. 
			/// add css? The content script is running in the webpage 
		// } 
  }
  xhr.send();
}

// SALvLe farUxc mJ2Mod

function fixedEncodeURIComponent(str) {
  return encodeURIComponent(str).replace(/[!'()*]/g, function(c) {
    return '%' + c.charCodeAt(0).toString(16);
  });
}

// create a new iframe, maybe a div will suffice. I'll cut this back to being a div. 
function newIframe(responseText) {
	var iframe = document.createElement('iframe');
	iframe.setAttribute("id", "lyrics-iframe");

	// var iframe = document.createElement('iframe');
	iframe.srcdoc = responseText;
	iframe.src = "data:text/html;charset=utf-8," + escape(responseText);
	// document.body.appendChild(iframe);
	var lyrics = document.querySelector("ytd-expander.style-scope.ytd-video-secondary-info-renderer");
	lyrics.parentNode.insertBefore(iframe, lyrics);
}

function checkNode() {
		var targetNode = document.querySelector("h1.title.style-scope.ytd-video-primary-info-renderer");
		if (!targetNode) {
			window.setTimeout(checkNode, 500);
			return;
		}
		console.log(targetNode.innerText);
		// here we need to add a new iframe. 
		var lyrics = document.querySelector("ytd-expander.style-scope.ytd-video-secondary-info-renderer")
		if (!lyrics) {
			window.setTimeout(newIframe, 500);
		}
		getData(targetNode.innerText);
		var config = {
	        childList: true,
	        subtree:true
		}
		observer.observe(targetNode, config)
	}
checkNode();