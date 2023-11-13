document.addEventListener('DOMContentLoaded', function() {
  var checkPageButton = document.getElementById('checkPage');
  checkPageButton.addEventListener('click', MainActionButtonClick, false);
}, false);

var url = "";

function MainActionButtonClick(){
	
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		url = tabs[0].url;
		chrome.scripting.executeScript( { target: { tabId: tabs[0].id }, func: () => document.documentElement.outerHTML }, function(html) {
			parse_data(html[0].result);
		});
	});
	
}

function parse_data(data)
{
	if (data == "") { alert("failed"); return false; }
	csrf_token = data.substr(data.indexOf("csrf_token")+14,32);
	
	var doc = new DOMParser().parseFromString(data, "text/html")
	var divs = doc.querySelectorAll('div.info-box-content');
	
	if (divs.length == 0)
		document.getElementById('err').innerText = "No videos found..";
	else
	{
		document.getElementById('err').innerText = "";
		document.getElementById('checkPage').hidden = "hidden";
	}

	for (var i = 0; i < divs.length; i+=2)
	{
		let btn = document.createElement("button");
		btn.className = "video";
		var date = divs[i].querySelector("p").innerText;
		btn.innerHTML = date.replace('T','\n').replace('Z',"");
		btn.title = divs[i].innerText.replace(/\s/g,'').replace(date, "");
		var id = divs[i].previousElementSibling.href.split("file=")[1];
		btn.id = id;
		btn.onclick = function(e) {
			var uu = url + '/d.php?file=' + e.target.id + "&t=" + csrf_token;
			window.open(uu.replace("//", "/"), '_blank');
		};
		document.body.appendChild(btn);
	}
}

