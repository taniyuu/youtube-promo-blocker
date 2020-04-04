import store from './store';
//alert(store.getters.foo);

const url = 'https://www.cas.go.jp/jp/influenza/novel_coronavirus.html'
//main();

function searchAndHidden(url, parentSelector, childSelector) {
    const parentList = document.querySelectorAll(parentSelector);
    if (!parentList.length) {
        // console.warn('親要素なし');
        return;
    }
    for(var k = parentList.length - 1; k >= 0; k--) {
        const parent = parentList[k];
        const nodeList = parent.querySelectorAll(childSelector);
        // 特殊なオブジェクトなのでforしか使えない
        for(var j = nodeList.length - 1; j >= 0; j--) {
            const attrs = nodeList[j].attributes;
            for(var i = attrs.length - 1; i >= 0; i--) {
                if(attrs[i].name === 'href') {
                    if(attrs[i].value === url) {
                        parent.style.display ="none";
                        return true;
                    }
                }
            }
        }
        parent.style.display ="block";
    }
    return;
}

function main(counter){
    let responseObj = null;
    const href = location.href;
    switch (location.pathname) {
        case '/':
            const result1 = searchAndHidden(url, "ytd-rich-section-renderer.style-scope.ytd-rich-grid-renderer", "a.yt-simple-endpoint.style-scope.ytd-button-renderer");
            const result2 = searchAndHidden(url, ".style-scope.ytd-popup-container", ".yt-simple-endpoint.style-scope.ytd-button-renderer");
            responseObj = {
                result:!!result1 || !!result2,
                counter,
                href
            }
            break;
        case '/watch':
            responseObj = {
                result:!!searchAndHidden(url, "#clarify-box", ".yt-simple-endpoint.style-scope.ytd-clarification-renderer"),
                counter,
                href
            }
            break;
        default:
            // NOP
    }
    return responseObj;
}

chrome.runtime.onMessage.addListener(function(request, _sender, sendResponse){
    let selection;
    // FIXME store経由か、ローカルストレージから取得
    // console.info(url);
    let responseObj = main(request.counter);
    sendResponse(responseObj);
  });