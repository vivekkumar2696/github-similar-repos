function getRepoData() {
	console.log("WHat's up");
	chrome.storage.local.get('data', function(result) {

		var repoData = JSON.parse(result.data);
		var str = '<ul>'

		repoData.forEach(function(repo) {
		  str += '<li>'+ repo['full_name'] + '</li>';
		}); 

		str += '</ul>';
		document.getElementById("repoListContainer").innerHTML = str;
    });
}

getRepoData();