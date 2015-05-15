$(function() {
    function preload(baseUrl, pn) {
        $('<img/>').attr("src", baseUrl.replace(/%\{(page|index)\}/, pn));
    }

    chrome.storage.local.get(function(s) {
        var pn = 1,
            slideImage = $("#slide-image");

        var prevPage = function(e) {
            if (pn > 1) {
                pn = pn - 1;
                $("#loading").removeClass("disabled").addClass("active");          
                slideImage.attr("src", s.baseUrl.replace(/%\{(page|index)\}/, pn));
            }
        };

        var nextPage = function(e) {
            if (pn < s.total) {
                pn = pn + 1;
                $("#loading").removeClass("disabled").addClass("active");          
                slideImage.attr("src", s.baseUrl.replace(/%\{(page|index)\}/, pn));
                if (pn < s.total) preload(s.baseUrl, pn + 1);
            }
        };
        slideImage
            .attr("src", s.baseUrl.replace(/%\{(page|index)\}/, pn))
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
