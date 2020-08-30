import { browser, Tabs } from "webextension-polyfill-ts";

browser.browserAction.onClicked.addListener((tab) => {
    executeScript(tab);
  });
  
  function executeScript(tab: Tabs.Tab){
    var URL = tab.url;
    if(URL != null){
        if(/.*strava\.com\/athlete\/segments\/.*/.test(URL) || /.*strava\.com\/activities\/\d+.*/.test(URL)){
        browser.tabs.executeScript({
            file: "main.js"
        });
        }
    }
  }