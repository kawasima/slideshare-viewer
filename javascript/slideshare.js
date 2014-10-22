var url = "http://sssslide.com/" + location.href.substr("http://".length);

$.get(url, function(data) {
  var metadata = $(data).find("#area_body-main .mod_slides > div:eq(0)");
  chrome.storage.sync.set({
    lastPageNo: parseInt(metadata.attr("data-last-image-index")),
    baseUrl: metadata.attr("data-fallback-image-url").replace(/\[N\]\-1024/, "[N]-638")
  }, function() {
    var url = chrome.extension.getURL("/slide.html");
    location.href=url;
  });
});
