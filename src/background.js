import store from './store';
//alert(store.getters.foo);
const url = 'https://www.cas.go.jp/jp/influenza/novel_coronavirus.html';
const YOUTUBE = 'https://www.youtube.com/';

const PATH_GRAY="icons/gray_48.png";
const PATH_BLUE="icons/blue_48.png";

function sleep(time) {
    return new Promise((resolve) => {
        setTimeout(() => {
        resolve();
        }, time);
    });
}

function sendMessage(tab, counter = 0) {
    const MAX_RETRY_COUNT = 10;
    if(counter >= MAX_RETRY_COUNT) {
        console.info('not found');
        chrome.browserAction.setIcon({path:PATH_GRAY});
        return;
    }
    chrome.tabs.sendMessage(tab.id, {url,counter}, async function(item){
        console.info(item);
        if(!item){
            // サポート外のパスの場合null
            chrome.browserAction.setIcon({path:PATH_GRAY});
            return;
        }
        else{
            await sleep(200);
            const incCount =item.counter+1;
            if(item.result) chrome.browserAction.setIcon({path:PATH_BLUE});
            else chrome.browserAction.setIcon({path:PATH_GRAY})
            sendMessage(tab, incCount);
        }
    });
}

chrome.tabs.onActivated.addListener(function(activeInfo){
    chrome.tabs.get(activeInfo.tabId,function(tab){
        if(tab.url.indexOf(YOUTUBE) !== -1) {
            sendMessage(tab);
        }else{
            chrome.browserAction.setIcon({path:PATH_GRAY});
        }
    })
})

chrome.tabs.onUpdated.addListener(function(_tabid, info, tab){
    if (tab.url.indexOf(YOUTUBE) !== -1 && info.status === 'complete') {
        sendMessage(tab);
    }
})