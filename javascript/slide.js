$(function() {
    chrome.storage.sync.get(["lastPageNo", "baseUrl"], function(s) {
        var pn = 1,
        slideImage = $("#slide-image");

        var prevPage = function(e) {
            if (pn > 1) {
                pn = pn - 1;
                $("#loading").removeClass("disabled").addClass("active");          
                slideImage.attr("src", s.baseUrl.replace(/\[N\]/, pn));
            }
        };

        var nextPage = function(e) {
            if (pn < s.lastPageNo) {
                pn = pn + 1;
                $("#loading").removeClass("disabled").addClass("active");          
                slideImage.attr("src", s.baseUrl.replace(/\[N\]/, pn));
            }
        };
        slideImage
            .attr("src", s.baseUrl.replace(/\[N\]/, pn))
            .on("load", function(e) { $("#loading").removeClass("active").addClass("disabled")});
        $("#prev").on("click", prevPage);
        $("#next").on("click", nextPage);
        $(document).on("keydown", function(e) {
            switch(e.which) {
            case 37:
                prevPage(e);
                break;
            case 39:
                nextPage(e);
                break;
            }
        });
    });
});
