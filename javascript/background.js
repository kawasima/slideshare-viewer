var ruleSpeakerdeck = {
    conditions: [
        new chrome.declarativeWebRequest.RequestMatcher({
            url: { hostSuffix: 'speakerdeck.com'},
            stages: ['onBeforeRequest']
        })
    ],
    actions: [
        new chrome.declarativeWebRequest.SendMessageToExtension({message: "speakerdeck"}),
        new chrome.declarativeWebRequest.CancelRequest()
    ]
};

var ruleSlideshare = {
    conditions: [
        new chrome.declarativeWebRequest.RequestMatcher({
            url: { hostSuffix: 'slideshare.net'},
            stages: ['onBeforeRequest']
        })
    ],
    actions: [
        new chrome.declarativeWebRequest.SendMessageToExtension({message: "slideshare"}),
        new chrome.declarativeWebRequest.CancelRequest()
    ]
};

var loading = false;
chrome.declarativeWebRequest.onRequest.addRules([ruleSpeakerdeck, ruleSlideshare]);
chrome.declarativeWebRequest.onMessage.addListener(function(response) {
    if (loading) return false;
    loading = true;
    var protocol = response.url.match("^(http|https)://");
    var url = "http://sssslide.com/" + response.url.substr(protocol[0].length);

    setTimeout(function() { loading = false; }, 5000);
    $.get(url, function(data) {
        loading = false;
        var metadata = $(data).filter("#js__slide");

        chrome.storage.local.set({
            total: parseInt(metadata.attr("data-total-slides")),
            type: response.message,
            baseUrl: metadata.attr("data-image-url-template")
        }, function() {
            chrome.tabs.update(response.tabId, {url: chrome.extension.getURL("/slide.html")});
        });
    });
});

