var callback = null;
var theObject = [];
var theMenuArray = [];

function react(info, tab) {
	if(typeof theMenuArray[info.menuItemId] != 'undefined') {
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
         var tabId = tabs[0].id;
         chrome.tabs.sendMessage(tabId, {'funktion': 'paste', 'topaste': theObject[theMenuArray[info.menuItemId]].entry});
      });
	} else {
		chrome.tabs.create({url:"options.html"});
	}
}

const getHostname = (url) => {
	return new URL(url).hostname;
};

function domain(info, tab) {
	var catchAllDomain = theObject[theMenuArray[info.menuItemId]].entry;
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		var ID = Math.random().toString(36).substr(2, 4);
		var tabId = tabs[0].id;
		var email = getHostname(tabs[0].url) + "-" + ID + "@" + catchAllDomain;
		if(email.substr(0,4) == "www.") {
			email = email.substr(4, email.length);
		}

		chrome.tabs.sendMessage(tabId, {'funktion': 'paste', 'topaste': email});
	});
}

var parentMenu = null;
createMenu();
console.log(localStorage);

function createMenu() {
	parentMenu = chrome.contextMenus.create({"title": "Paste CatchAll Email", "contexts": ["editable"]});


	if(typeof localStorage['CatchAll'] != 'undefined') {
		theObject = JSON.parse(localStorage['CatchAll']);
		for(var i=0; i<theObject.length; i++) {
			var theSubMenu = chrome.contextMenus.create({"title": theObject[i].entry, "parentId" : parentMenu, "contexts": ["editable"], "onclick": domain});
			theMenuArray[theSubMenu] = i;
		}
	}
	
	chrome.contextMenus.create({"title": "Options", "parentId": parentMenu, "contexts": ["editable"], "onclick": react});
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if(request.funktion == 'resetMenu') {
      chrome.contextMenus.removeAll();
      createMenu();
	}
});
