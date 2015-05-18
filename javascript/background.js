var loading = false;
function dispatch(site, url, tabId) {
    if (loading) return false;
    loading = true;
    var protocol = url.match("^(http|https)://");
    var sssslideUrl = "http://sssslide.com/" + url.substr(protocol[0].length);

    setTimeout(function() { loading = false; }, 5000);
    $.get(sssslideUrl, function(data) {
        var metadata = $(data).filter("#js__slide");

        chrome.storage.local.set({
            total: parseInt(metadata.attr("data-total-slides")),
            type: site,
            baseUrl: metadata.attr("data-image-url-template"),
            title: $(data).filter("meta[property='og:title']").attr("content")
        }, function() {
            chrome.tabs.update(tabId, {url: chrome.extension.getURL("/slide.html")}, function() {
                if (chrome.runtime.lastError) {
                    console.log(chrome.runtime.lastError.message);
                }
            });
        });
    });
}

chrome.webRequest.onBeforeRequest.addListener(
        function(request) {
            dispatch("speakerdeck", request.url, request.tabId); 
        },
        {urls: ["*://speakerdeck.com/*"]});

chrome.webRequest.onBeforeRequest.addListener(
        function(request) {
            dispatch("slideshare", request.url, request.tabId); 
        },
        {urls: ["*://www.slideshare.net/*"]});

