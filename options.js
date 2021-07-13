function cancel() {
	window.close();
}
function save() {
	var localStorageKey = 'CatchAll';
   
   var theEntries = document.getElementsByClassName('entry');
   
   var newObject = [];
   for(i=0; i<theEntries.length; i++) {
      if(theEntries[i].value != "") {
         newObject[i] = {};
         newObject[i].entry = theEntries[i].value;
      }
   }
   
	localStorage[localStorageKey] = JSON.stringify(newObject);
	chrome.extension.sendMessage({'funktion': 'resetMenu'});
	window.close();
}


function addentry() {
   var theTableBody = document.getElementById('liste');
   var theHTML = theTableBody.innerHTML;
   theHTML += '<tr><td>Entry:</td><td><input type="text" size="30" class="entry" value=""/></td></tr>\n';
   theTableBody.innerHTML = theHTML;
}


function clickHandler(innerI) {
   return function() {
      var theTR = document.getElementsByTagName('tr');
      theTR[innerI].parentNode.removeChild(theTR[innerI]);
      addEventListeners();
   }
}

function addEventListeners() {
   var theDelButtons = document.getElementsByClassName('delentry');
   for(i=0; i<theDelButtons.length; i++) {
      theDelButtons[i].onclick = clickHandler(i);
   }
}

window.addEventListener('load', function() {
   document.getElementById('save').addEventListener('click', save, false);
   document.getElementById('cancel').addEventListener('click', cancel, false);
   document.getElementById('addentry').addEventListener('click', addentry, false);
	var localStorageKey = 'CatchAll';
   
	if(typeof localStorage[localStorageKey] != 'undefined')	{
		var theObject = JSON.parse(localStorage[localStorageKey]);

      var theTableBody = document.getElementById('liste');
      
      var theHTML = "";
      for(i=0; i<theObject.length; i++) {
         theHTML += '<tr><td>Entry:</td><td><input type="text" size="30" class="entry" value="' + theObject[i].entry + '"/></td></tr>\n';
      }
      theTableBody.innerHTML = theHTML;
      addEventListeners();
   }
}, false);
