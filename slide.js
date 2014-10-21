$(function() {
  chrome.storage.sync.get(["lastPageNo", "baseUrl"], function(s) {
    var pn = 1;
    $("#slide-image").attr("src", s.baseUrl.replace(/\[N\]/, pn));
    $("#prev").click(function(e) {
      if (pn > 1) {
        pn = pn - 1;
        $("#slide-image").attr("src", s.baseUrl.replace(/\[N\]/, pn));
      }
    });
    $("#next").click(function(e) {
      if (pn < s.lastPageNo) {
        pn = pn + 1;
        $("#slide-image").attr("src", s.baseUrl.replace(/\[N\]/, pn));
      }
    });
  });
});
