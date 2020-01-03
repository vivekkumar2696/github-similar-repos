function getRepoData() {
	chrome.storage.local.get('data', function(result) {

		var repoData = JSON.parse(result.data);
		var str = '<table>';
		var currentRepo = null;

		chrome.storage.local.get('current_repo', function(value) {
			currentRepo = value.current_repo;

			// TODO: Awful! Use template
			repoData.forEach(function(repo) {

				if(repo['full_name'] === currentRepo)
					return;

				str += '<tr>';
				str += '<td class="repo-list-row">';
				str += '<a href='+ repo['html_url'] + ' target="_blank">' +'<div class="repo-full-name">' +  repo['full_name'] + '</div></a>';
				if(repo['description'])
					str += '<div class="repo-description">' + repo['description'] + '</div>';
				str += '<div class="repo-details-div">';
				str += '<span><svg aria-label="star" class="star-icon" viewBox="0 0 12 12" version="1.1" width="12" height="12" role="img"><path fill-rule="evenodd" d="M14 6l-4.9-.64L7 1 4.9 5.36 0 6l3.6 3.26L2.67 14 7 11.67 11.33 14l-.93-4.74L14 6z"></path></svg>  ' + (repo['watchers_count'] ? repo['watchers_count'] : '0') + '</span>';
				if(repo['language'])
					str += '<span class="repo-language"></span>' + '<span class="repo-language-cons">' + repo['language'] + '</span>';
				str += '</div>';
				str +='</td>';
				str += '</tr>';
			});

			str += '</table>';
			document.getElementById("repoListContainer").innerHTML = str;
	    });
	});
}

getRepoData();