$(function() {
    function buildUrl(baseUrl, pn) {
        return baseUrl.replace(/%\{(page|index)\}/, function(match, ph) {
            if (ph == "page") {
                return pn;
            } else if (ph == "index") {
                return pn - 1;
            }
        });
    }
    function preload(baseUrl, pn) {
        $('<img/>').attr("src", buildUrl(baseUrl, pn));
    }

    chrome.storage.local.get(function(s) {
        var pn = 1,
            slideImage = $("#slide-image");

        var prevPage = function(e) {
            if (pn > 1) {
                pn = pn - 1;
                $("#loading").removeClass("disabled").addClass("active");          
                slideImage.attr("src", buildUrl(s.baseUrl, pn));
            }
        };

        var nextPage = function(e) {
            if (pn < s.total) {
                pn = pn + 1;
                $("#loading").removeClass("disabled").addClass("active");          
                slideImage.attr("src", buildUrl(s.baseUrl, pn));
                if (pn < s.total) preload(s.baseUrl, pn + 1);
            }
        };
        slideImage
            .attr("src", buildUrl(s.baseUrl, pn))
            .on("load", function(e) { $("#loading").removeClass("active").addClass("disabled")});

        if (pn < s.total) preload(s.baseUrl, pn + 1);

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
