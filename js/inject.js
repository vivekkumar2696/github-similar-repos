function getRepoData() {
	console.log("WHat's up");
	chrome.storage.local.get('data', function(result) {

		var repoData = JSON.parse(result.data);
		var str = '<ul>'

		repoData.forEach(function(slide) {
		  str += '<li>'+ slide['full_name'] + '</li>';
		}); 

		str += '</ul>';
		document.getElementById("slideContainer").innerHTML = str;
    });
}

getRepoData();