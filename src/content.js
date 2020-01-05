/*
** On Click listener to toggle the side bar
**/
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

/*
** Helper function to toggle the side bar
** Credits: https://stackoverflow.com/questions/39610205/how-to-make-side-panel-in-chrome-extension?rq=1
*/
function toggle(){
    if(repoContentIframe.style.width == "0px"){
        repoContentIframe.style.width="500px";
    }
    else{
        repoContentIframe.style.width="0px";
    }
}

/*
** Credit: https://github.com/harshjv/github-repo-size/blob/master/src/inject.js
*/
const getRepoObject = () => {
  // find file button
  const elem = window.location.href;
  if (!elem) return false;

  if (!elem ||
      !elem.match(/^https?:\/\/github.com\//)) {
    return false;
  }

  const repoUri = elem.replace(/^https?:\/\/github.com\//, '');
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

/*
** Function which searches for repositories using keywords.
** It returns a JSON object
*/
const getAPIData = (keyword) => {
	const headerObj = {
		'User-Agent': 'vivek/repository-suggestions'
	}

	const API = 'https://api.github.com/search/repositories';
	const page = '?q=' + keyword + '+in:name,description' + '&sort=stars&order=desc';

	const request = new Request(`${API}${page}`, {
		headers: new Headers(headerObj)
	})

	return fetch(request)
		.then(response => {
			return response.json();
	})
}


/*
** Gets the API data and stores into localstorage and creates an Iframe out of it
*/
const getTotalTags = async() => {
	const repoObject = getRepoObject();
	const response = await getAPIData(repoObject['repo'].split("/")[1].replace(/[^A-Z0-9]/ig, " "));

	chrome.storage.local.set({'data': JSON.stringify(response['items'])});
    chrome.storage.local.set({'current_repo': repoObject['repo']});

	repoContentIframe.src = chrome.extension.getURL("src/popup.html")
	document.body.appendChild(repoContentIframe);
}

getTotalTags();