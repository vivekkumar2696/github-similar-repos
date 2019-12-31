chrome.runtime.onMessage.addListener(function(msg, sender){
    if(msg == "toggle"){
        toggle();
    }
})


// Initialize an iframe for sidebar
var repoContentIframe = document.createElement('iframe'); 
repoContentIframe.style.background = "white";
repoContentIframe.style.height = "100%";
repoContentIframe.style.width = "0px";
repoContentIframe.style.position = "fixed";
repoContentIframe.style.top = "0px";
repoContentIframe.style.right = "0px";
repoContentIframe.style.zIndex = "9000000000000000000";
repoContentIframe.frameBorder = "none"; 

function toggle(){
    if(repoContentIframe.style.width == "0px"){
        repoContentIframe.style.width="400px";
    }
    else{
        repoContentIframe.style.width="0px";
    }
}

const getRepoObject = () => {
  // find file button
  const elem = document.querySelector('a.d-none.js-permalink-shortcut');
  if (!elem) return false;

  if (!elem.href ||
      !elem.href.match(/^https?:\/\/github.com\//)) {
    return false;
  }

  const repoUri = elem.href.replace(/^https?:\/\/github.com\//, '');
  const arr = repoUri.split('/');

  const userOrg = arr.shift();
  const repoName = arr.shift();
  const repo = `${userOrg}/${repoName}`;

  arr.shift(); // tree

  const ref = arr.shift();

  return {
    repo,
    ref,
    currentPath: arr.join('/').trim()
  }
}

const getAPIData = (keyword) => {
	const headerObj = {
		'User-Agent': 'vivek/repository-suggestions'
	}

	const API = 'https://api.github.com/search/repositories';
	const page = '?q=' + keyword + '&sort=stars&order=desc';

	const request = new Request(`${API}${page}`, {
		headers: new Headers(headerObj)
	})

	return fetch(request)
		.then(response => {
			return response.json();
	})
}


const getTotalTags = async() => {
	const repoObject = getRepoObject();
	const response = await getAPIData(repoObject['repo'].split("/")[1].replace(/[^A-Z0-9]/ig, " "));

	chrome.storage.local.set({'data': JSON.stringify(response['items'])});
    chrome.storage.local.set({'current_repo': repoObject['repo']});

	repoContentIframe.src = chrome.extension.getURL("popup.html")
	document.body.appendChild(repoContentIframe);
}


getTotalTags();