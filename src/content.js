import store from './store';
//alert(store.getters.foo);

const url = 'https://www.cas.go.jp/jp/influenza/novel_coronavirus.html'
searchAndHidden(url)

function sleep(time) {
    return new Promise((resolve) => {
        setTimeout(() => {
        resolve();
        }, time);
    });
}

async function domSearchWithRetry(parent, selector, counter = 0) {
    const MAX_RETRY_COUNT = 10;
    const result = parent.querySelector(selector);
    if (!result) {
        if(counter >= MAX_RETRY_COUNT) {
            return null;
        }
        else {
            await sleep(200);
            return domSearchWithRetry(parent, selector, counter++);
        }
    }
    return result;
}

async function searchAndHidden(url) {
    const parent = await domSearchWithRetry(document, "#clarify-box");
    if (!parent) {
        console.warn('親要素なし');
        return;
    }
    const dom = await domSearchWithRetry(parent, ".yt-simple-endpoint.style-scope.ytd-clarification-renderer");
    if (!dom) {
        console.warn('子要素なし');
        return;
    }
    const attrs = dom.attributes;
    // 特殊なオブジェクトなのでforしか使えない
    for(var i = attrs.length - 1; i >= 0; i--) {
        if(attrs[i].name === 'href') {
            if(attrs[i].value === url) {
                parent.style.display ="none";
                return true;
            }
        }
    }
    parent.style.display ="block";
    return;
}

chrome.runtime.onMessage.addListener(async function(request, sender, sendResponse){
    let selection;
    console.error(url);
    const result = await searchAndHidden(url);
    // console.error(request.message); // -> 選択範囲ちょうだい が出力される
    
    // 画面で選択されている部分を文字列で取得する
    /*if(window.getSelection){
      selection = window.getSelection().toString();
    }else{
      selection = '';
    }*/
    console.error(result);
    sendResponse(!!result);
  });