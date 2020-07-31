//Background Script



chrome.runtime.onInstalled.addListener(function() {
  //sets the state of the convolutional neural network
  chrome.storage.local.set({model_trained: false}, function(){
    console.log('The model has not been trained');
  });
  //set the state of the app to "Started = false".
  chrome.storage.local.set({appStarted: false}, function() {
    console.log("Background script loaded. App not started.");

    //change tooltip on plugin button to aid users.
    chrome.browserAction.setTitle({title: "Start Gaze Tracking"}, function(){
      console.log("Button title changed to 'Start Tracking'");
    });
  });

});

//this is a helper funciton which sequentially injects a list of content scripts into an HTML page
//Credit to Xan and Douglas at https://stackoverflow.com/a/21535234
function executeScripts(tabId, injectDetailsArray)
{
    function createCallback(tabId, injectDetails, innerCallback) {
        return function () {
            chrome.tabs.executeScript(tabId, injectDetails, innerCallback);
        };
    }
    var callback = null;

    for (var i = injectDetailsArray.length - 1; i >= 0; --i)
        callback = createCallback(tabId, injectDetailsArray[i], callback);

    if (callback !== null)
        callback();   // execute outermost function
}



//Triggers the plugin to either stop or start gaze tracking when it is pressed 
chrome.browserAction.onClicked.addListener(function (tab) {
  console.log("button clicked");
  
  //check the app state: started or stopped
  chrome.storage.local.get(['appStarted'], function(result){
    console.log("start app");

    //if app is not runnning, start app
    if (!result.appStarted){

      //change tooltip on plugin button
      chrome.browserAction.setTitle({title: "Stop Tracking"}, function(){
        console.log("Button title changed to 'Stop Tracking'");
      });

      //inject the app's content scripts into the active HTML page
      chrome.storage.local.set({appStarted: true}, function() {
        console.log("App started. Setting up.");
        executeScripts(null, [ 
          { file: "dependencies/jquery-3.4.1.min.js" }, 
          { file: "dependencies/clmtrackr.js" },
          { file: "dependencies/simpleheat.js" },
          { file: "scripts/ui/setup.js" },
          { file: "scripts/ui/calibrate.js" },
          { file: "scripts/ui/ui.js" },
          { file: "scripts/test/consoleTest.js" },
          { file: "scripts/modules/cursor.js" },
          { file: "scripts/modules/heat.js" },
          { file: "scripts/modules/pointer.js" },
          { file: "scripts/modules/tracker.js" },
          { file: "dist/neural_network.js" },
          { file: "scripts/main.js" },
          { file: "scripts/ui/listener.js" },
          
        ]);
        console.log("Content Scripts injected.");
      });
    } else {
      //if the app is started then refresh the page to stop content scripts
      //and remove HTML elements that were added to the page.
      chrome.storage.local.set({appStarted: false}, function() {
        chrome.tabs.update(tab.id , {url: tab.url})
      });
    }
  });

});