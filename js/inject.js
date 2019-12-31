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
				str += '<td style="border-bottom: 1px solid #e1e4e8;margin-left: 10px;padding-left: 10px;padding-bottom: 5px;padding-right: 10px;padding-top: 5px">';
				str += '<div style="color: #0366d6!important;font-weight: 500;font-size: 16px;pointer: cursor;">' +  '<a href='+ repo['html_url'] + '>' +repo['full_name'] + '</a></div>';
				str += '<div style="margin-bottom: 4px;font-size: 15px;">' + repo['description'] + '</div>';
				str += '<div style="font-size: 12px;">';
				if(repo['watchers_count'])
					str += '<span><svg aria-label="star" style="overflow: visible!important;" viewBox="0 0 12 12" version="1.1" width="12" height="12" role="img"><path fill-rule="evenodd" d="M14 6l-4.9-.64L7 1 4.9 5.36 0 6l3.6 3.26L2.67 14 7 11.67 11.33 14l-.93-4.74L14 6z"></path></svg>  ' + repo['watchers_count'] + '</span>';
				if(repo['language'])
					str += '<span style="background-color: #b07219;margin-left: 10px;width: 5px;height:5px;"></span>' + '<span style="font-weight: 600;">' + repo['language'] + '</span>';
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