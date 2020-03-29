import store from './store';
//alert(store.getters.foo);

const url = 'https://www.cas.go.jp/jp/influenza/novel_coronavirus.html'
searchAndHidden(url)

function searchAndHidden(url) {
    const parent = document.querySelector("#clarify-box");
    if (!parent) {
        console.warn('親要素なし');
        return;
    }
    const dom = parent.querySelector(".yt-simple-endpoint.style-scope.ytd-clarification-renderer");
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

chrome.runtime.onMessage.addListener(function(_request, _sender, sendResponse){
    let selection;
    // FIXME store経由か、ローカルストレージから取得
    console.error(url);
    const result = searchAndHidden(url);
    sendResponse(!!result);
  });