chrome.runtime.onMessage.addListener(function(msg, sender){
    if(msg == "toggle"){
        toggle();
    }
})


var iframe = document.createElement('iframe'); 
iframe.style.background = "white";
iframe.style.height = "100%";
iframe.style.width = "0px";
iframe.style.position = "fixed";
iframe.style.top = "0px";
iframe.style.right = "0px";
iframe.style.zIndex = "9000000000000000000";
iframe.frameBorder = "none"; 

function toggle(){
    if(iframe.style.width == "0px"){
        iframe.style.width="400px";
    }
    else{
        iframe.style.width="0px";
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
	// const repoObject = getRepoObject();
	const headerObj = {
		'User-Agent': 'vivek/repository-suggestions'
	}

	const API = 'https://api.github.com/search/repositories';
	// const uri = repoObject['repo'] + '/tags';
	const page = '?q=' + keyword + '&sort=stars&order=desc';
	// const token = localStorage.getItem(GITHUB_TOKEN_KEY) || GITHUB_TOKEN_KEY;

	// if (token) {
	// 	headerObj['Authorization'] = 'token ' + token;
	// }

	const request = new Request(`${API}${page}`, {
		headers: new Headers(headerObj)
	})

	return fetch(request)
		.then(response => {
			return response.json();
	})
}


const getTotalTags = async() => {
	const response = await getAPIData("alphablend");
	for (let item in response) {
	}

	console.log(response);

	chrome.storage.local.set({'data': JSON.stringify(response['items'])}, function() {
		console.log('Value is set to ' + JSON.stringify(response['items']));
    });

	iframe.src = chrome.extension.getURL("popup.html")

	document.body.appendChild(iframe);
	toggle();
}


getTotalTags();