import store from './store';

//alert(`Hello ${store.getters.foo}!`);

chrome.tabs.onUpdated.addListener(function(tabid, info, tab){
    if (info.status === 'complete' && tab.url.indexOf('https://www.youtube.com/') !== -1) {
            // いい感じの処理
            console.info(tab);
            console.info(info);
            chrome.tabs.sendMessage(tab.id, {message: '選択範囲ちょうだい'}, function(item){
                // NOP
            });
        }
})