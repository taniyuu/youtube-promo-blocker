import store from './store';
//alert(store.getters.foo);
const url = 'https://www.cas.go.jp/jp/influenza/novel_coronavirus.html';
const YOUTUBE = 'https://www.youtube.com/';

const PATH_GRAY="icons/gray_48.png";
const PATH_BLUE="icons/blue_48.png";

function sendMessage(tabId) {
    chrome.tabs.sendMessage(tabId, {url}, function(item){
        console.error('hogeeeee')
        console.error(item);
        chrome.browserAction.setIcon({path:PATH_BLUE});
    });
}

chrome.tabs.onActivated.addListener(function(activeInfo){
    chrome.tabs.get(activeInfo.tabId,function(tab){
        if(tab.url.indexOf(YOUTUBE) !== -1) {
            sendMessage(tab.id);
        }else{
            chrome.browserAction.setIcon({path:PATH_GRAY});
        }
    })
})

chrome.tabs.onUpdated.addListener(function(_tabid, info, tab){
    if (info.status === 'complete' && tab.url.indexOf(YOUTUBE) !== -1) {
        sendMessage(tab.id);
    }
})