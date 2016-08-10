$(function() {
    function buildUrl(baseUrl, pn) {
        return baseUrl.replace(/%\{(page|index)\}/, (match, ph) => {
            if (ph == 'page') {
                return pn;
            } else if (ph == 'index') {
                return pn - 1;
            }
        });
    }

    /**
     * Progress bar
     */
    class ProgressBarUI {
        constructor(emitter, selector) {
            this.emitter = emitter;
            this.node = $(selector);
            this.width = this.node.width();
            this.left = this.node.offset().left;
            this.emitter
                .on('init', (e, data) => this.init.call(this, e, data))
                .on('render-slide', (e, data) => {
                    this.node.progress({percent: data.pn/data.total});
                });
        }

        init(e, data) {
            this.node.on('mousemove', (me) => {
                this.node.progress({percent: (me.pageX - this.left) / this.width});
            }).on('click', (e) => {
                this.emitter.trigger('goto-page', Math.ceil(this.node.progress('get percent') * data.total / 100));
            });
            this.node.progress('reset');
        }
    }

    /**
     * Slide image
     */
    class SlideImageUI {
        constructor(emitter, selector) {
            this.emitter = emitter;
            this.node = $(selector);
            this.emitter
                .on('init', (e, data) => this.init.call(this, e, data))
                .on('render-slide', (e, data) => this.renderSlide.call(this, data));

        }

        init(e, data) {
            const slideWidth = this.node.width(),
                  slideX     = this.node.offset().left,
                  inL = (x) => (x - slideX) < slideWidth/4,
                  inR = (x) => (x - slideX) > (slideWidth - slideWidth/4);

            this.node
                .attr('src', buildUrl(data.baseUrl, 1))
                .on('load', (e) => $('#loading').removeClass('active').addClass('disabled'))
                .on('mousemove', (e) => {
                    this.node.css('cursor', inL(e.pageX) ? 'w-resize' : inR(e.pageX) ? 'e-resize' : 'auto');
                })
                .on('click', (e) => {
                    if (inL(e.pageX)) {
                        this.emitter.trigger('prev-page');
                    } else if (inR(e.pageX)) {
                        this.emitter.trigger('next-page');
                    }
                });
        }

        renderSlide(data) {
            $("#loading").removeClass("disabled").addClass("active");
            this.node.attr("src", buildUrl(data.baseUrl, data.pn));
        }


    }

    /**
     * Slide container
     */
    class SlideUI {
        constructor(emitter, selector) {
            this.emitter = emitter;
            this.progressBar = new ProgressBarUI(emitter, '#slide-progress');
            this.slideImage  = new SlideImageUI(emitter, '#slide-image');
            this.slidePosition = $('#slide-position');
            this.emitter
                .on('init', (e, data) => this.init.call(this, e, data))
                .on('preload', (e, data) =>
                    $('<img/>').attr('src', buildUrl(data.baseUrl, data.pn)))
                .on('goto-page', (e, pn) =>
                    $('.current.value', this.slidePosition).text(pn));
        }

        init(e, data) {
            $('.current.value', this.slidePosition).text(1);
            $('.total.value',   this.slidePosition).text(data.total);
            $('#slide-title').text(data.title);
            $('#prev').on('click', (e) => this.emitter.trigger('prev-page'));
            $('#next').on('click', (e) => this.emitter.trigger('next-page'));
            $('#btn-fullscreen').on('click', (e) => {
                document.getElementById('slide-content').webkitRequestFullScreen();
            });

            $(document).on('keydown', (e) => {
                switch(e.which) {
                case 37:
                    emitter.trigger('prev-page');
                    break;
                case 39:
                    emitter.trigger('next-page');
                    break;
                }
            });
        }
    }

    class Slide {
        constructor(emitter) {
            this.emitter = emitter;
            this.pn = 1;
            this.emitter.on('init', (e, data) => this.init.call(this, e, data));
        }

        init(e, data) {
            this.url = data.baseUrl;
            this.total = data.total;
            this.emitter.on('next-page', (e) => this.nextPage());
            this.emitter.on('prev-page', (e) => this.prevPage());
            this.emitter.on('goto-page', (e, pn) => this.gotoPage(pn));
        }

        gotoPage(pn) {
            this.pn = pn;
            this.emitter.trigger('render-slide', {
                pn: this.pn,
                total: this.total,
                baseUrl: this.url
            });
        }

        prevPage() {
            if (this.pn > 1) {
                this.pn -= 1;
                this.emitter.trigger('goto-page', this.pn);
            }
        }

        nextPage() {
            if (this.pn < this.total) {
                this.pn += 1;
                this.emitter.trigger('goto-page', this.pn);
                if (this.pn < this.total) {
                    this.emitter.trigger('preload', {baseUrl: this.url, pn: this.pn+1});
                }
            }
        }
    }

    const emitter = $({}),
          ui = new SlideUI(emitter),
          model = new Slide(emitter);

    chrome.storage.local.get(function(s) {
        emitter.trigger('init', s);
    });
});
