console.log("start!!!!");
var protocol = location.href.match("^(http|https)://");
var url = "http://sssslide.com/" + location.href.substr(protocol[0].length);

$.get(url, function(data) {
  var metadata = $(data).filter("#js__slide");

  chrome.storage.local.set({
    total: parseInt(metadata.attr("data-total-slides")),
    baseUrl: metadata.attr("data-image-url-template")
  }, function() {
    location.href = chrome.extension.getURL("/slide.html");
  });
});
