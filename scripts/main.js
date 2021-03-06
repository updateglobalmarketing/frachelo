﻿var template = {
    config: {
        error_404_page: "404.html",
        showSubmenuOn: "click",
        portfolio_initialCount: 20,
        portfolio_count: 10,
        portfolio_masonry_unitWidth: 320,
        portfolio_grid_unitWidth: 320,
        portfolio_metro_unitWidth: 320,
        portfolio_metro_dynamic: false,
        portfolio_metro_pattern: false
    },
    init: function () {
        this.config.showSubmenuOn = this.config.showSubmenuOn == "hover" ? "mouseenter" : "click";
        this.dock.init();
        this.page.init();
        this.preloader.init();
        this.background.init();
        $(window).resize(function () {
            clearTimeout(template.windowResizeTO);
            template.windowResizeTO = setTimeout(function () {
                template.windowResize()
            }, 200)
        });
        template.windowResize();
        $(window).scroll(function () {
            template.windowScroll()
        });
        template.windowScroll();
        $("body").find("img").error(function () {
            $(this).data("404", true)
        });
        template.animator.init();
        $(window).bind("popstate", function () {
            if (history.pushState) {
                var e = location.href.slice(location.href.lastIndexOf("/") + 1);
                if (e == "#" || e == "" || e.indexOf("#", 0) == e.length - 1 || e == template.page.url) return false;
                template.page.load(e, false)
            }
        })
    },
    windowResizeTO: false,
    windowResize: function () {
        if (!template.dock.header.menu.active) {
            this.dock.header.height = this.dock.header.element.outerHeight();
            this.dock.footer.height = this.dock.footer.element.outerHeight()
        }
        if (this.dock.hidden) {
            this.dock.hide();
            this.dock.element.stop(true, true)
        } else {
            this.dock.show();
            this.dock.element.stop(true, true)
        }
        this.dock.toggleDock.mouseout();
        this.dock.toggleDock.element.stop(true, true);
        this.dock.pageTopLink.mouseout();
        this.dock.pageTopLink.element.stop(true, true);
        this.background.resize();
        this.preloader.resize();
        this.page.components.portfolio.filterable.refresh();
        this.page.components.portfolio.layouts.order();
        this.page.components.fullscreenComponents.homeAccordion.resize()
    },
    windowScroll: function () {
        this.dock.pageTopLink.updateOpacity();
        this.page.components.portfolio.layouts.scroll()
    },
    page: {
        element: $("#page"),
        url: false,
        loading: false,
        data: false,
        onReady: false,
        init: function () {
            this.components.init(this.element)
        },
        load: function (e, t) {
            if (e == "#" || e == "" || e.indexOf("#", 0) == e.length - 1 || e == template.page.url) return false;
            this.loading = true;
            if (window.stop !== undefined) {
                window.stop()
            } else if (document.execCommand !== undefined) {
                document.execCommand("Stop", false)
            }
            template.page.components.portfolio.layouts.element = false;
            if (history.pushState && t == undefined) history.pushState(null, null, e);
            template.page.element.stop(true, false).animate({
                opacity: 0
            }, 300, "easeInOutCubic", function () {
                template.preloader.onStart = function () {
                    template.page.startLoading(e)
                };
                template.preloader.onFinish = function () {
                    template.page.finishLoading()
                };
                template.preloader.show()
            });
            template.background.element.stop(true, false).delay(300).animate({
                opacity: 0
            }, 300, "easeInOutCubic")
        },
        startLoading: function (e) {
            $.ajax({
                type: "post",
                dataType: "html",
                cache: false,
                url: e,
                success: function (t) {
                    var n = template.page;
                    var r = $(t);
                    n.data = {};
                    n.url = e;
                    var i = t.indexOf("<title>") + "<title>".length;
                    var s = t.indexOf("</title>");
                    n.data.title = $.trim(t.slice(i, s));
                    n.data.page = r.find("#page");
                    n.data.scripts = r.filter("script");
                    n.data.background = r.find("#background");
                    if (n.onReady != false) {
                        n.onReady();
                        n.onReady = false
                    } else {
                        template.preloader.hide()
                    }
                },
                error: function (e, t, n) {
                    console.log("XHR:" + e);
                    console.log("TEXT_STATUS:" + t);
                    console.log("ERROR:" + n);
                    if (e.status == 404) {
                        page.load(template.config.error_404_page)
                    }
                }
            })
        },
        finishLoading: function () {
            document.title = this.data.title;
            var e = $(window).scrollTop() == 0 ? 0 : Math.min(Math.max(400, $(window).scrollTop()), 1e3);
            $(window.opera ? "html" : "html, body").stop(true, false).animate({
                scrollTop: 0
            }, e, "easeInOutCubic");
            setTimeout(function () {
                var e = template.page.data.background.clone();
                e.css({
                    opacity: 0
                });
                template.background.element.after(e);
                template.background.element.remove();
                template.background.element = e;
                template.background.reset();
                template.background.init();
                var t = template.page.data.page.clone();
                t.css({
                    opacity: 0
                });
                template.page.element.after(t);
                template.page.element.remove();
                template.page.element = t;
                template.page.components.init(template.page.element);
                template.windowResize();
                template.windowScroll();
                template.dock.stateChange();
                template.page.data.scripts.each(function () {
                    $.globalEval(this.text || this.textContent || this.innerHTML || "")
                });
                template.page.element.stop(true, false).delay(300).animate({
                    opacity: 1
                }, 300, "easeInOutCubic", function () {
                    template.page.loading = false
                });
                template.background.element.stop(true, false).delay(600).animate({
                    opacity: 1
                }, 300, "easeInOutCubic")
            }, e)
        },
        components: {
            init: function (e) {
                var t = this;
                template.imagesReady(t, function () {
                    t.imageCropper.init(e);
                    t.textInputs.init(e);
                    t.portfolio.init(e);
                    t.colorbox.init(e);
                    t.flexslider.init(e);
                    t.mediaelement.init(e);
                    t.tabs.init(e);
                    t.toggle.init(e);
                    t.twitter.init(e);
                    t.flickr.init(e);
                    t.contact.init(e);
                    t.fullscreenComponents.homeAccordion.init(e);
                    t.fullscreenComponents.homeSlider.init(e);
                    t.ie_init(e)
                })
            },
            ie_init: function (e) {
                if (window._ie != undefined) {
                    window._ie.components.init(e)
                }

            },
            imageCropper: {
                init: function (e) {
                    e.find(".crop").each(function () {
                        $(this).css({
                            overflow: "hidden",
                            position: "relative"
                        });
                        var e = $(this);
                        $(this).data("update", function () {
                            var t = e.width();
                            var n = e.height();
                            e.children().each(function () {
                                if ($(this).is("img")) {
                                    var e = this.width;
                                    var r = this.height;
                                    $(this).width(t);
                                    $(this).height(r * t / e);
                                    if ($(this).height() < n) {
                                        $(this).height(n);
                                        $(this).width(e * n / r)
                                    }
                                    $(this).css({
                                        position: "absolute",
                                        top: -($(this).height() - n) / 2,
                                        left: -($(this).width() - t) / 2
                                    })
                                }
                            })
                        });
                        $(this).data("update")()
                    })
                }
            },
            textInputs: {
                init: function (e) {
                    e.find("input[type='text'],input[type='email'],input[type='search'],input[type='tel'],input[type='url'],input[type='password'],textarea").each(function () {
                        var e = $(this).data("prompt");
                        if (e == undefined) return;
                        $(this).val(e).data("original-value", e);
                        if ($(this).val() == e) $(this).addClass("js-original");
                        $(this).keyup(function () {
                            if ($(this).val().length == 0) {
                                $(this).removeClass("has-input")
                            } else {
                                $(this).addClass("has-input")
                            }
                        });
                        $(this).focusin(function () {
                            if ($(this).val() == $(this).data("original-value")) $(this).val("");
                            $(this).removeClass("js-original")
                        });
                        $(this).focusout(function () {
                            if ($(this).val() == "") {
                                $(this).val($(this).data("original-value"));
                                $(this).addClass("js-original")
                            }
                        })
                    })
                }
            },
            portfolio: {
                init: function (e) {
                    this.layouts.initialCount = template.config.portfolio_initialCount;
                    this.layouts.count = template.config.portfolio_count;
                    this.layouts.masonry.unitWidth = template.config.portfolio_masonry_unitWidth;
                    this.layouts.grid.unitWidth = template.config.portfolio_grid_unitWidth;
                    this.layouts.metro.unitLength = template.config.portfolio_metro_unitWidth;
                    this.layouts.metro.dynamic = template.config.portfolio_metro_dynamic;
                    if (template.config.portfolio_metro_pattern != false) this.layouts.metro.pattern = template.config.portfolio_metro_pattern;
                    this.filterable.init(e);
                    this.layouts.init(e)
                },
                layouts: {
                    element: false,
                    initialCount: 20,
                    count: 10,
                    height: 0,
                    data: false,
                    interval: false,
                    loading: false,
                    type: false,
                    init: function (e) {
                        this.element = e.find(".portfolio.entries").eq(0);
                        if (this.element.size() > 0) {
                            if (this.element.hasClass("single")) {
                                this.element = false;
                                return
                            }
                            if (this.element.hasClass("masonry")) {
                                this.type = "masonry"
                            } else if (this.element.hasClass("grid")) {
                                this.type = "grid"
                            } else if (this.element.hasClass("metro")) {
                                this.type = "metro"
                            }
                        } else {
                            this.element = false
                        }
                        if (this.type) {
                            this.load(this.initialCount)
                        }
                    },
                    load: function (e) {
                        if (!this.type || !this.element) return;
                        var t = this;
                        t.loading = true;
                        if (!e) e = t.count;
                        template.preloader.onStart = function () {
                            if (!t.element) return;
                            $.ajax({
                                type: "post",
                                dataType: "html",
                                url: "ajax_portfolio_entries.php?from=" + t.element.children().size() + "&count=" + e, //link.com was fix this for you! ;)//
                                success: function (e) {
                                    if (!t.type || !t.element) return;
                                    t.data = $("<div>" + e + "</div>");
                                    if (e == "none") {
                                        t.finish();
                                        return
                                    }
                                    t.data.children().each(function () {
                                        $(this).appendTo(t.element).addClass("newitem").css({
                                            opacity: 0,
                                            visibility: "hidden"
                                        })
                                    });
                                    t.dataLoaded()
                                },
                                error: function (e, n, r) {
                                    t.dataError()
                                }
                            })
                        };
                        template.preloader.show()
                    },
                    dataLoaded: function () {
                        var e = this;
                        template.preloader.onFinish = function () {
                            e.typeInit();
                            e.order();
                            e.element.find(".newitem").each(function (e) {
                                $(this).css({
                                    visibility: "visible"
                                }).removeClass("newitem").delay(200 + 100 * e).animate({
                                    opacity: 1
                                }, 600, "easeInOutCubic");
                                template.page.components.colorbox.init($(this));
                                template.page.components.ie_init($(this))
                            })
                        };
                        clearInterval(e.interval);
                        e.interval = setInterval(function () {
                            var t = true;
                            e.element.find(".newitem img").each(function () {
                                if (this.naturalHeight == 0 && !$(this).data("404")) {
                                    t = false
                                }
                            });
                            if (t) {
                                clearInterval(e.interval);
                                template.preloader.hide()
                            }
                        }, 100)
                    },
                    dataError: function () {
                        console.log("ajax error")
                    },
                    order: function () {
                        if (this.type) {
                            this[this.type].order(this)
                        }
                    },
                    finish: function () {
                        template.preloader.hide()
                    },
                    scroll: function () {
                        if (!this.element) return;
                        if ($(window).scrollTop() + $(window).height() - this.height >= -500 && !this.loading) {
                            this.load()
                        }
                    },
                    typeInit: function () {
                        if (this.type) {
                            this[this.type].init(this)
                        }
                    },
                    masonry: {
                        unitWidth: 320,
                        init: function (e) {},
                        order: function (e) {
                            if (!e.data || !e.element) return;
                            e.height = 0;
                            var t = Math.floor(e.element.width() / this.unitWidth);
                            var n = Math.ceil(e.element.width() / t);
                            e.element.children().each(function () {
                                $(this).css({
                                    width: Math.floor(n)
                                }).data("resv", false)
                            });
                            e.element.children().each(function () {
                                var r = 0;
                                var i = $(this).index() % t * n;
                                if ($(this).index() > t - 1) {
                                    var s;
                                    r = Infinity;
                                    e.element.children(":lt(" + $(this).index() + ")").each(function () {
                                        var e = parseInt($(this).css("top")) + $(this).outerHeight();
                                        if (e < r && !$(this).data("resv")) {
                                            r = e;
                                            i = parseInt($(this).css("left"));
                                            s = $(this)
                                        }
                                    });
                                    if (s) s.data("resv", true)
                                }
                                $(this).css({
                                    top: Math.floor(r),
                                    left: Math.floor(i)
                                });
                                e.height = Math.max(e.height, parseInt($(this).css("top")) + $(this).outerHeight())
                            });
                            e.element.height(e.height);
                            e.loading = false
                        }
                    },
                    grid: {
                        unitWidth: 320,
                        init: function (e) {
                            var t = Math.floor(e.element.width() / this.unitWidth);
                            var n = Math.ceil(e.element.width() / t);
                            e.element.children(".newitem").each(function () {
                                $(this).find("img").wrap("<div class='crop' style='width: " + n + "px; height: " + n + "px;'></div>");
                                template.page.components.imageCropper.init($(this))
                            })
                        },
                        order: function (e) {
                            if (!e.data || !e.element) return;
                            var t = Math.floor(e.element.width() / this.unitWidth);
                            var n = Math.ceil(e.element.width() / t);
                            e.element.children().each(function () {
                                $(this).find(".crop").each(function () {
                                    $(this).width(n);
                                    $(this).height(n);
                                    $(this).data("update")()
                                })
                            });
                            e.masonry.order(e)
                        }
                    },
                    metro: {
                        unitLengthRef: 240,
                        unitLength: 320,
                        dynamic: false,
                        count: 4,
                        segments: [],
                        pattern: ["1-1", "2-1", "1-2", "3-1", "1-3", "2-2"],
                        init: function (e) {
                            e.element.children(".newitem").each(function () {
                                $(this).find("img").wrap("<div class='crop' style='width: " + e.metro.unitLength + "px; height: " + e.metro.unitLength + "px;'></div>");
                                template.page.components.imageCropper.init($(this))
                            })
                        },
                        order: function (e) {
                            if (!e.data || !e.element) return;
                            var t = this;
                            t.count = Math.floor(e.element.outerWidth() / t.unitLengthRef);
                            t.unitLength = Math.ceil(e.element.width() / t.count);
                            var n = 0;
                            e.element.children().each(function () {
                                var e = t.pattern[n].split("-");
                                if ($(this).attr("data-size") != undefined) {
                                    e = $(this).attr("data-size").split("-")
                                } else {
                                    n++;
                                    if (n > t.pattern.length - 1) n = 0
                                }
                                $(this).addClass("size-" + t.pattern[n]);
                                var r = $(this).find(".crop").eq(0);
                                var i = r.children("img").get(0);
                                var s = Number(e[0]) * t.unitLength;
                                var o = Number(e[1]) * t.unitLength;
                                if (t.dynamic) {
                                    s = Math.floor(Math.max(t.unitLength, i.naturalWidth * .8) / t.unitLength) * t.unitLength;
                                    o = Math.floor(Math.max(t.unitLength, i.naturalHeight * .8) / t.unitLength) * t.unitLength
                                }
                                r.css("width", s);
                                r.css("height", o);
                                if (r.data("update")) r.data("update")();
                                $(this).css("width", s);
                                $(this).css("height", o)
                            });
                            t.segments = [];
                            t.getSegments();
                            e.height = 0;
                            e.element.children().each(function () {
                                var n = parseInt($(this).css("width")) / t.unitLength;
                                var r = parseInt($(this).css("height")) / t.unitLength;
                                var s = 0;
                                n = Math.min(3, n);
                                r = Math.min(3, r);
                                var o = 1;
                                for (var u = 0; u < o; u++) {
                                    for (i = s; i < t.segments.length; i++) {
                                        if (t.segments[i].free) {
                                            s = i;
                                            break
                                        }
                                    }
                                    var a = t.segments[s];
                                    for (i = 0; i < n * r; i++) {
                                        var f = t.segments[a.index + t.count * Math.floor(i / n) + i % n];
                                        if (f.free == false || f.x < a.x) {
                                            o++;
                                            s++;
                                            break
                                        }
                                    }
                                }
                                $(this).css({
                                    left: a.x,
                                    top: a.y
                                });
                                for (i = 0; i < n * r; i++) {
                                    t.segments[a.index + t.count * Math.floor(i / n) + i % n].free = false
                                }
                                e.height = Math.max(e.height, a.y + $(this).outerHeight())
                            });
                            e.element.height(e.height);
                            e.loading = false
                        },
                        getSegments: function () {
                            var e = this.segments.length;
                            for (var t = e; t < e + 5e3; t++) {
                                this.segments.push({
                                    index: t,
                                    x: t % this.count * this.unitLength,
                                    y: Math.floor(t / this.count) * this.unitLength,
                                    free: true
                                })
                            }
                        }
                    }
                },
                filterable: {
                    gutter: 30,
                    init: function (e) {
                        var t = this;
                        e.find(".filterable").each(function () {
                            var e = 1;
                            var n = $(this).attr("class");
                            var r = n.indexOf("classic-", 0);
                            if (r != -1) {
                                var i = n.charAt(r + "classic-".length);
                                if (!isNaN(i)) {
                                    e = i
                                }
                            }
                            t.build($(this), Number(e))
                        })
                    },
                    build: function (e, t) {
                        var n = this;
                        var r = e.children();
                        e.data("items", r);
                        r.each(function () {
                            if ($(this).attr("data-tags") == undefined) {
                                var e = [];
                                $(this).find(".entry-tags > *").not(".separator").each(function () {
                                    e.push($(this).text())
                                });
                                $(this).attr("data-tags", e.join(","))
                            }
                        });
                        var i = {};
                        var s = $(".filterable-nav[data-id=" + e.data("id") + "] > ul");
                        var o = $("input[data-id=" + e.data("id") + "]");
                        var u = s.children().eq(0).html();
                        s.empty();
                        r.each(function (e, t) {
                            if ($(t).data("tags") != undefined) {
                                var n = $(t).data("tags").split(",");
                                $(t).attr("data-id", e);
                                $.each(n, function (e, n) {
                                    n = $.trim(n);
                                    if (!(n in i)) {
                                        i[n] = []
                                    }
                                    i[n].push($(t))
                                })
                            }
                        });
                        n.createList(u, r, s);
                        $.each(i, function (e, t) {
                            n.createList(e, t, s)
                        });
                        s.children().on("click", function (r) {
                            $(this).addClass("active").siblings().removeClass("active");
                            o.val("");
                            o.focusout();
                            n.update(e, $(this).data("list").data("ids"), t, true);
                            return false
                        });
                        o.keyup(function () {
                            var i = $(this).val();
                            clearTimeout($(this).data("to"));
                            $(this).data("to", setTimeout(function () {
                                var o = [];
                                r.each(function () {
                                    if ($(this).text().toLowerCase().indexOf(i.toLowerCase(), 0) != -1) {
                                        o.push($(this).data("id"))
                                    }
                                });
                                if (i == "") {
                                    s.children().eq(0).addClass("active")
                                } else {
                                    s.children().removeClass("active")
                                }
                                n.update(e, o, t, true)
                            }, 500))
                        });
                        s.children().eq(0).addClass("active");
                        this.update(e, s.children().eq(0).data("list").data("ids"), t, false)
                    },
                    createList: function (e, t, n) {
                        var r = $("<ul/>");
                        var i = [];
                        $.each(t, function (e) {
                            var t = $(this).clone();
                            t.appendTo(r);
                            i.push(t.data("id"))
                        });
                        r.data("ids", i);
                        var s = $("<li>", {
                            html: e,
                            data: {
                                list: r
                            }
                        });
                        s.wrapInner("<a href='#' />").appendTo(n)
                    },
                    update: function (e, t, n, r) {
                        var i = this;
                        e.children().not(".default").each(function () {
                            if ($.inArray(Number($(this).data("id")), t) != -1) {
                                $(this).addClass("active")
                            } else {
                                $(this).removeClass("active")
                            }
                        });
                        var s = e.children(".active");
                        var o = 0;
                        var u = 0;
                        s.each(function (t) {
                            if (t % n == 0) {
                                o = u
                            }
                            var s = (e.width() - i.gutter * (n - 1)) / n;
                            $(this).width(s);
                            $(this).css("position", "absolute");
                            $(this)[r ? "data" : "css"]({
                                top: o,
                                left: t % n * (i.gutter + s)
                            });
                            u = Math.max(u, o + $(this).outerHeight() + i.gutter)
                        });
                        var a = e.find(".default");
                        if (t.length == 0) {
                            a.delay(600).fadeIn(150);
                            u = a.outerHeight()
                        } else {
                            if (!a.is(":hidden")) {
                                a.fadeOut(150)
                            }
                        }
                        if (r != true) {
                            e.css({
                                height: u
                            });
                            return
                        }
                        var f = 600;
                        var l = 1e3;
                        var c = 0;
                        e.children().not(".default").not(".active").each(function (e) {
                            $(this).stop(true, false).delay(e * c).animate({
                                opacity: 0
                            }, f, "easeInOutCubic", function () {
                                $(this).hide()
                            })
                        });
                        s.each(function (e) {
                            $(this).show();
                            $(this).stop(true, false).delay(e * c).css({
                                display: "block"
                            }).animate({
                                opacity: 1,
                                top: $(this).data("top"),
                                left: $(this).data("left")
                            }, l, "easeInOutCubic")
                        });
                        e.stop(true, false).animate({
                            height: u
                        }, s.size() * c + l, "easeInOutCubic")
                    },
                    refresh: function () {
                        $(".filterable").each(function () {
                            var e = $(".filterable-nav[data-id=" + $(this).data("id") + "] > ul");
                            if (e.size() > 0) {
                                e.find(".active").click()
                            }
                        })
                    }
                }
            },
            colorbox: {
                init: function (e) {
                    e.find(".colorbox").each(this.createColorbox)
                },
                createColorbox: function (e, t) {
                    var n = new Object;
                    n.innerWidth = $(t).data("width") || false;
                    n.innerHeight = $(t).data("height") || false;
                    n.slideshow = String($(t).data("slideshow")).toLowerCase() == "true";
                    n.slideshowAuto = String($(t).data("slideshowauto")).toLowerCase() == "true";
                    n.iframe = String($(t).data("iframe")).toLowerCase() == "true";
                    n.inline = String($(t).data("inline")).toLowerCase() == "true";
                    n.photo = String($(t).data("photo")).toLowerCase() == "true";
                    n.title = $(t).data("title");
                    n.rel = $(t).data("group");
                    n.fixed = true;
                    n.transition = "none";
                    if (!$(t).is("a")) n.href = $(t).data("href");
                    if (!n.innerWidth) n.innerWidth = n.iframe ? 480 : false;
                    if (!n.innerHeight) n.innerHeight = n.iframe ? 360 : false;
                    n.width = "80%";
                    n.height = "80%";
                    n.maxWidth = "100%";
                    n.maxHeight = "100%";
                    n.overlayClose = false;
                    n.speed = 600;
                    n.opacity = 1;
                    n.current = "{current}/{total}";
                    if (n.iframe) {
                        n.width = 640;
                        n.height = 480
                    }
                    n.onComplete = function () {
                        if ($("#cboxLoadedContent").children().eq(0).is("img")) {
                            $("#cboxLoadedContent").hide().delay(500).fadeIn(400)
                        }
                        if ($("#colorbox").data("init")) return;
                        $("#colorbox").data("init", true);
                        $("#colorbox")[$("#cboxSlideshow").css("display") != "none" ? "addClass" : "removeClass"]("cb-slideshow");
                        $("#colorbox")[$("#cboxNext").css("display") != "none" ? "addClass" : "removeClass"]("cb-group");
                        $("#cboxTitle").css("bottom", "-100%").delay(200).animate({
                            bottom: 0
                        }, 800, "easeInOutCubic")
                    };
                    n.onOpen = function () {
                        $("#cboxLoadingGraphic").css("opacity", "0").delay(200).animate({
                            opacity: 1
                        }, 800, "easeInOutCubic");
                        $("#cboxClose").css("margin-right", "-220px").delay(900).animate({
                            "margin-right": 0
                        }, 800, "easeInOutCubic");
                        $("#cboxNext").css("margin-right", "-220px").delay(850).animate({
                            "margin-right": 0
                        }, 800, "easeInOutCubic");
                        $("#cboxPrevious").css("margin-right", "-220px").delay(800).animate({
                            "margin-right": 0
                        }, 800, "easeInOutCubic");
                        $("#cboxCurrent").css("margin-right", "-220px").delay(750).animate({
                            "margin-right": 0
                        }, 800, "easeInOutCubic")
                    };
                    n.onClose = function () {
                        $("#colorbox").data("init", false)
                    };
                    $(t).colorbox(n)
                }
            },
            flexslider: {
                init: function (e) {
                    e.find(".flexslider").each(this.createFlexSlider)
                },
                createFlexSlider: function (e, t) {
                    t = $(t);
                    var n = t.data("controls") == false ? false : true;
                    var r = t.data("nav") == false ? false : true;
                    var i = t.data("slideshow") == false ? false : true;
                    var s = t.data("animation") == "slide" ? "slide" : "fade";
                    var o = t.data("pauseonhover") == false ? false : true;
                    var u = t.data("autohide") == false ? false : true;
                    var a = t.data("duration") == undefined ? 5e3 : Number(t.data("duration"));
                    var f = t.data("speed") == undefined ? 600 : Number(t.data("speed"));
                    t.flexslider({
                        directionNav: false,
                        controlNav: n,
                        pauseOnAction: false,
                        pauseOnHover: o,
                        animation: s,
                        easing: "easeInOutQuad",
                        slideshow: i,
                        slideshowSpeed: a,
                        animationSpeed: f,
                        smoothHeight: true,
                        start: function (e) {
                            e.height(e.children(".slides").height());
                            var t = $("<div class = 'controls right-nav'></div>");
                            var i = $("<a class = 'next'>Next</a>");
                            var s = $("<a class = 'prev'>Prev</a>");
                            var o = e.find(".flex-control-nav");
                            e.find(".flex-control-nav").css("visibility", "visible");
                            if (!r) {
                                return
                            } else {
                                e.addClass("has-nav")
                            }
                            t.append(s).append(i);
                            e.append(t);
                            i.click(function () {
                                e.flexAnimate(e.getTarget("next"))
                            });
                            s.click(function () {
                                e.flexAnimate(e.getTarget("prev"))
                            });
                            var a = t.clone(true).removeClass("right-nav").addClass("left-nav").appendTo(e);
                            var f = a.find("a.next");
                            t.prepend(i);
                            o.appendTo(t).after(o.prev());
                            s.stop(true, true).css({
                                right: -s.outerWidth() - 40,
                                opacity: 0
                            });
                            f.stop(true, true).css({
                                left: -s.outerWidth() - 40,
                                opacity: 0
                            });
                            o.stop(true, true).css({
                                right: -o.outerWidth() - 40,
                                opacity: 0
                            });
                            if (!n) {
                                return
                            } else {
                                e.addClass("has-controls")
                            }
                            t.hover(function () {
                                var t = $(this).find(".flex-control-nav");
                                if (e.width() < 240) return;
                                if (t.length == 0) {
                                    t = $(this).next().find(".flex-control-nav");
                                    t.appendTo(this).after(t.prev())
                                }
                                s.stop(true, true).css({
                                    right: -t.outerWidth() - s.outerWidth(),
                                    opacity: 0,
                                    left: "auto"
                                }).animate({
                                    right: 0,
                                    opacity: 1
                                }, 250);
                                t.stop(true, true).css({
                                    right: -t.outerWidth(),
                                    opacity: 0,
                                    left: "auto"
                                }).animate({
                                    right: 0,
                                    opacity: 1
                                }, 250)
                            }, function () {
                                var e = $(this).find(".flex-control-nav");
                                s.stop(true, true).animate({
                                    right: -e.outerWidth() - s.outerWidth(),
                                    opacity: 0
                                }, 300, "easeInOutCubic");
                                e.stop(true, true).css("left", "auto").animate({
                                    right: -e.outerWidth(),
                                    opacity: 0
                                }, 300, "easeInOutCubic")
                            });
                            a.hover(function () {
                                var t = $(this).find(".flex-control-nav");
                                if (e.width() < 240) return;
                                if (t.length == 0) {
                                    t = $(this).prev().find(".flex-control-nav");
                                    t.appendTo(this).after(t.prev())
                                }
                                f.stop(true, true).css({
                                    left: -t.outerWidth() - f.outerWidth(),
                                    opacity: 0,
                                    right: "auto"
                                }).animate({
                                    left: 0,
                                    opacity: 1
                                }, 250);
                                t.stop(true, true).css({
                                    left: -t.outerWidth(),
                                    opacity: 0,
                                    right: "auto"
                                }).animate({
                                    left: 0,
                                    opacity: 1
                                }, 250)
                            }, function () {
                                var e = $(this).find(".flex-control-nav");
                                f.stop(true, true).animate({
                                    left: -e.outerWidth() - f.outerWidth(),
                                    opacity: 0
                                }, 300, "easeInOutCubic");
                                e.stop(true, true).css("right", "auto").animate({
                                    left: -e.outerWidth(),
                                    opacity: 0
                                }, 300, "easeInOutCubic")
                            });
                            if (u) {
                                e.mouseover(function () {
                                    clearTimeout(e.data("to"));
                                    e.find(".controls").stop(true, false).animate({
                                        opacity: 1
                                    }, 150)
                                });
                                e.mouseout(function () {
                                    clearTimeout(e.data("to"));
                                    e.data("to", setTimeout(function () {
                                        e.find(".controls").stop(true, false).animate({
                                            opacity: 0
                                        }, 200)
                                    }, 1e3))
                                });
                                e.mouseout()
                            }
                        }
                    })
                }
            },
            mediaelement: {
                init: function (e) {
                    e.find("audio.ts-player[data-poster]").each(function () {
                        var e = $("<div class='mejs-wrap'/>");
                        var t = $("<img src='" + $(this).attr("data-poster") + "' alt='" + $(this).attr("data-poster-alt") + "'/>");
                        $(this).wrap(e);
                        $(this).before(t)
                    });
                    e.find("video.ts-player,audio.ts-player").mediaelementplayer({
                        startVolume: 1,
                        videoWidth: "100%",
                        videoHeight: "100%",
                        audioWidth: "100%",
                        audioHeight: 36,
                        features: ["playpause", "current", "progress", "duration", "volume"]
                    })
                }
            },
            tabs: {
                init: function (e) {
                    e.find(".tabs").each(function () {
                        var e = $(this).children("ul").children("li");
                        var t = $(this).children("ol").children("li");
                        e.click(function () {
                            if ($(this).hasClass("active")) return false;
                            e.removeClass("active");
                            $(this).addClass("active");
                            t.hide();
                            t.eq($(this).index()).fadeIn(500);
                            return false
                        });
                        t.hide();
                        t.eq(e.filter(".active").eq(0).index()).fadeIn(500)
                    })
                }
            },
            toggle: {
                init: function (e) {
                    e.find(".toggle").each(function () {
                        var e = $(this);
                        var t = e.children("a").eq(0);
                        var n = e.children("div").eq(0);
                        e.data("open", function () {
                            e.addClass("active");
                            if (n.css("position") == "absolute") {
                                n.css({
                                    position: "relative",
                                    "margin-top": -n.outerHeight()
                                })
                            }
                            n.stop(true, false).animate({
                                "margin-top": 0,
                                opacity: 1
                            }, 600, "easeInOutCubic")
                        });
                        e.data("close", function () {
                            e.removeClass("active");
                            n.stop(true, false).animate({
                                "margin-top": -n.outerHeight(),
                                opacity: 0
                            }, 600, "easeInOutCubic", function () {
                                $(this).css({
                                    position: "absolute"
                                })
                            })
                        });
                        if (!e.hasClass("active")) {
                            n.css({
                                position: "absolute",
                                opacity: 0
                            })
                        }
                        t.click(function () {
                            if (e.parent().hasClass("accordion")) {
                                e.parent().find(".toggle").each(function () {
                                    $(this).data("close")()
                                });
                                e.data("open")()
                            } else {
                                if (e.hasClass("active")) {
                                    e.data("close")()
                                } else {
                                    e.data("open")()
                                }
                            }
                            return false
                        })
                    })
                }
            },
            twitter: {
                init: function (e) {
                    e.find(".twitter-feed").each(function () {
                        var e = $(this).html().replace(/%7B/g, "{").replace(/%7D/g, "}");
                        $(this).html("");
                        $(this).social({
                            network: "twitter",
                            loadingText: "Loading...",
                            user: $(this).attr("data-user"),
                            count: $(this).attr("data-count") == undefined ? 3 : $(this).attr("data-count"),
                            twitter: {
                                output: String(e)
                            }
                        })
                    })
                }
            },
            flickr: {
                init: function (e) {
                    e.find(".flickr-feed").each(function () {
                        var e = $(this).html().replace(/%7B/g, "{").replace(/%7D/g, "}");
                        $(this).html("");
                        $(this).social({
                            network: "flickr",
                            loadingText: "Loading...",
                            user: $(this).attr("data-user"),
                            count: $(this).attr("data-count") == undefined ? 6 : $(this).attr("data-count"),
                            flickr: {
                                output: String(e)
                            }
                        })
                    })
                }
            },
            contact: {
                init: function (e) {
                    e.find(".contact-form").each(function () {
                        var e = $(this);
                        e.find("*[type='submit']").click(function () {
                            var t = e.find("input[name='name']");
                            var n = e.find("input[name='email']");
                            var r = e.find("textarea[name='message']");
                            var i = e.find("textarea[name='website']");
                            var s = e.find("input[name='to']");
                            n.removeClass("invalid");
                            e.parent().find(".form-failure").hide();
                            if (t.val() == t.attr("data-prompt") || t.val() == "") {
                                t.focus();
                                return false
                            }
                            if (n.val() == n.attr("data-prompt") || n.val() == "") {
                                n.focus();
                                return false
                            }
                            if (n.val().indexOf("@", 0) == -1 || n.val().indexOf(".", 0) == -1) {
                                n.focus();
                                n.addClass("invalid");
                                return false
                            }
                            if (r.val() == r.attr("data-prompt") || r.val() == "") {
                                r.focus();
                                return false
                            }
                            var o = "name=" + t.val() + "&email=" + n.val() + "&message=" + r.val() + "&to=" + s.val();
                            if (i != undefined) o += "&website=" + i.val();
                            $.ajax({
                                type: "POST",
                                url: e.attr("action"),
                                data: o,
                                success: function (i) {
                                    if (i == "missing_name") {
                                        t.focus()
                                    } else if (i == "missing_email") {
                                        n.focus()
                                    } else if (i == "missing_message") {
                                        r.focus()
                                    } else if (i == "invalid_email") {
                                        n.focus();
                                        n.addClass("invalid")
                                    } else if (i == "success") {
                                        e.children().fadeOut(150);
                                        e.find(".form-success").delay(300).fadeIn(300).delay(2e3).fadeOut(150);
                                        e.children().not(".form-success,.form-failure").delay(2600).fadeIn(300);
                                        setTimeout(function () {
                                            e.children("input,textarea").val("").focusout()
                                        }, 2600)
                                    } else if (i == "failure") {
                                        e.children().fadeOut(150);
                                        e.find(".form-failure").delay(300).fadeIn(300).delay(2e3).fadeOut(150);
                                        e.children().not(".form-success,.form-failure").delay(2600).fadeIn(300)
                                    }
                                },
                                error: function (t) {
                                    e.children().fadeOut(150);
                                    e.find(".form-failure").delay(300).fadeIn(300).delay(2e3).fadeOut(150);
                                    e.children().not(".form-success,.form-failure").delay(2600).fadeIn(300)
                                }
                            });
                            return false
                        })
                    })
                }
            },
            fullscreenComponents: {
                homeAccordion: {
                    init: function (e) {
                        var t = this;
                        t.resize();
                        template.dock.onAfterStateChange.homeAccordion = function () {
                            t.resize()
                        };
                        template.dock.onBeforeStateChange.homeAccordion = function () {
                            t.resize()
                        };
                        e.find("#home-accordion").each(function () {
                            var e = $(this);
                            e.children().each(function () {
                                $(this).width(e.width());
                                $(this).data("p0", e.width() / e.children().size() * $(this).index());
                                $(this).data("pbefore", e.children(":lt(" + $(this).index() + ")"));
                                $(this).data("pafter", e.children(":gt(" + $(this).index() + ")"));
                                var t = $(this).find("img");
                                $(this).find(".fullscreen-caption").hide();
                                if (Modernizr.csstransitions) {
                                    $(this).css({
                                        left: $(this).data("p0")
                                    });
                                    t.css("transform", "translateX(" + Number(t.attr("data-pos") == undefined ? 0 : Math.min(0, -Number(t.attr("data-pos")) * t.width() + e.width() / e.children().size() * .5)) + "px)")
                                } else {
                                    $(this).css({
                                        left: $(this).data("p0")
                                    });
                                    t.css("margin-left", t.attr("data-pos") == undefined ? 0 : Math.min(0, -Number(t.attr("data-pos")) * t.width() + e.width() / e.children().size() * .5))
                                }
                                $(this).mouseenter(function () {
                                    var t = $(this).find("img");
                                    var n = t.outerWidth();
                                    var r = (e.width() - n) / (e.children().size() - 1);
                                    var i = $(this).index();
                                    var s = $(this).data("pbefore").size();
                                    r = Math.max(50, r);
                                    n = e.width() - r * (e.children().size() - 1);
                                    if (Modernizr.csstransitions) {
                                        $(this).data("pbefore").each(function () {
                                            $(this).stop(true, false).css({
                                                left: Number($(this).index() * r)
                                            })
                                        });
                                        $(this).data("pafter").each(function () {
                                            $(this).stop(true, false).css({
                                                left: Number(s * r + n + ($(this).index() - i - 1) * r)
                                            })
                                        });
                                        $(this).stop(true, false).css({
                                            left: Number(s * r)
                                        });
                                        t.stop(true, false).css({
                                            transform: "translateX(" + 0 + "px)"
                                        })
                                    } else {
                                        $(this).data("pbefore").each(function () {
                                            $(this).stop(true, false).animate({
                                                left: $(this).index() * r
                                            }, 600, "easeOutCubic")
                                        });
                                        $(this).data("pafter").each(function () {
                                            $(this).stop(true, false).animate({
                                                left: s * r + n + ($(this).index() - i - 1) * r
                                            }, 600, "easeOutCubic")
                                        });
                                        $(this).stop(true, false).animate({
                                            left: s * r
                                        }, 600, "easeOutCubic");
                                        t.stop(true, false).animate({
                                            "margin-left": 0
                                        }, 600, "easeOutCubic")
                                    }
                                    $(this).siblings().find(".fullscreen-caption").hide();
                                    $(this).children(".fullscreen-caption").show().children().each(function () {
                                        $(this).stop(true, false).css({
                                            display: "block",
                                            "margin-left": -200,
                                            opacity: 0
                                        }).delay(200 + $(this).index() * 100).animate({
                                            "margin-left": 0,
                                            opacity: 1
                                        }, 600, "easeInOutCubic")
                                    });
                                    $(this).children(".fullscreen-caption").find(".slide").each(function () {
                                        $(this).stop(true, false).css({
                                            "margin-left": -200
                                        }).delay(200 + $(this).index() * 150).animate({
                                            "margin-left": 0
                                        }, 600, "easeInOutCubic")
                                    })
                                });
                                $(this).mouseleave(function () {
                                    var t = $(this).find("img");
                                    $(this).find(".fullscreen-caption").stop(true, true).hide();
                                    if (Modernizr.csstransitions) {
                                        $(this).parent().children().each(function () {
                                            $(this).stop(true, false).css({
                                                left: $(this).data("p0")
                                            })
                                        });
                                        t.stop(true, false).css({
                                            transform: "translateX(" + Number(t.attr("data-pos") == undefined ? 0 : Math.min(0, -Number(t.attr("data-pos")) * t.width() + e.width() / e.children().size() * .5)) + "px)"
                                        })
                                    } else {
                                        $(this).parent().children().each(function () {
                                            $(this).stop(true, false).animate({
                                                left: $(this).data("p0")
                                            }, 600, "easeOutCubic")
                                        });
                                        t.stop(true, false).animate({
                                            "margin-left": t.attr("data-pos") == undefined ? 0 : Math.min(0, -Number(t.attr("data-pos")) * t.width() + e.width() / e.children().size() * .5)
                                        }, 600, "easeOutCubic")
                                    }
                                })
                            })
                        })
                    },
                    resize: function () {
                        $("#main-wrap").find("#home-accordion").each(function () {
                            var e = $(this);
                            e.width($(window).width());
                            e.children().each(function () {
                                $(this).width(e.width());
                                $(this).data("p0", e.width() / e.children().size() * $(this).index());
                                $(this).mouseleave();
                                var t = $(this).find("img");
                                t.stop(true, true)
                            })
                        })
                    }
                },
                homeSlider: {
                    element: false,
                    autoplayMode: true,
                    index: -1,
                    slides: false,
                    updating: false,
                    navPrev: $("<a href='#' class='nav-link prev'><span><span></span></span></a>"),
                    navNext: $("<a href='#' class='nav-link next'><span><span></span></span></a>"),
                    controls: false,
                    preloader: $("<div class='home-slider-preloader'></div>"),
                    init: function (e) {
                        var t = this.autoplay;
                        this.element = e.find("#home-slider");
                        if (this.element.size() == 0) return;
                        template.background.dir = false;
                        this.index = -1;
                        this.controls = $("<div class='controls'></div>");
                        this.autoplayMode = this.element.attr("data-autoplay") == "false" ? false : true;
                        if (this.element.attr("data-autoplayduration") != undefined) this.autoplay.duration = this.element.attr("data-autoplayduration");
                        this.slides = this.element.find(".slides").children();
                        this.element.prepend(this.navPrev).prepend(this.navNext);
                        this.navNext.click(function () {
                            template.page.components.fullscreenComponents.homeSlider.getNext();
                            return false
                        });
                        this.navNext.css({
                            opacity: 0,
                            "margin-right": -50
                        });
                        this.navNext.mouseover(function () {
                            $(this).stop(true, false).animate({
                                opacity: 1,
                                "margin-right": 0
                            }, 200, "easeOutCubic");
                            t.stop();
                            t.pause = true
                        });
                        this.navNext.mouseout(function () {
                            $(this).stop(true, false).animate({
                                opacity: 0,
                                "margin-right": -50
                            }, 200, "easeInCubic");
                            t.pause = false;
                            t.start()
                        });
                        this.navPrev.mouseover(function () {
                            $(this).stop(true, false).animate({
                                opacity: 1,
                                "margin-left": 0
                            }, 200, "easeOutCubic");
                            t.stop();
                            t.pause = true
                        });
                        this.navPrev.mouseout(function () {
                            $(this).stop(true, false).animate({
                                opacity: 0,
                                "margin-left": -50
                            }, 200, "easeInCubic");
                            t.pause = false;
                            t.start()
                        });
                        this.navPrev.click(function () {
                            template.page.components.fullscreenComponents.homeSlider.getPrev();
                            return false
                        });
                        this.navPrev.css({
                            opacity: 0,
                            "margin-left": -50
                        });
                        this.controls.prependTo(this.element).hover(function () {
                            t.stop();
                            t.pause = true
                        }, function () {
                            t.pause = false;
                            t.start()
                        });
                        for (var n = 0; n < this.slides.size(); n++) {
                            var r = $("<a href='#'>" + (n + 1) + "</a>");
                            r.data("index", n);
                            this.controls.append(r)
                        }
                        this.controls.find("a").click(function () {
                            template.page.components.fullscreenComponents.homeSlider.show($(this).data("index"));
                            return false
                        });
                        this.controls.prepend(this.preloader);
                        this.show(0)
                    },
                    getNext: function () {
                        this.show(this.index + 1)
                    },
                    getPrev: function () {
                        this.show(this.index - 1)
                    },
                    show: function (e) {
                        if (!this.element || this.element.size() == 0 || this.updating || template.isMobile()) return;
                        var t = this;
                        var n = e > this.index ? "right" : "left";
                        e = this.getCorrectIndex(e);
                        if (e == this.index) return;
                        template.background.dir = n;
                        this.updating = true;
                        this.autoplay.stop();
                        var r = this.slides.eq(this.getCorrectIndex(this.index + 1)).children("img").eq(0).attr("data-thumb");
                        var i = this.slides.eq(this.getCorrectIndex(this.index - 1)).children("img").eq(0).attr("data-thumb");
                        template.background.onAnimationFinish = function () {
                            template.page.components.fullscreenComponents.homeSlider.updating = false;
                            template.page.components.fullscreenComponents.homeSlider.autoplay.start();
                            template.page.components.fullscreenComponents.homeSlider.captions.update()
                        };
                        template.background.onReady = function () {
                            $("<img/>").load(function () {
                                $("<img/>").load(function () {
                                    t.preloader.stop(true, false).animate({
                                        opacity: 0
                                    }, 600, "easeInOutCubic");
                                    template.page.components.fullscreenComponents.homeSlider.captions.hide();
                                    var e = 600 + 100 * template.page.components.fullscreenComponents.homeSlider.element.find(".slides").children(".active").find(".fullscreen-caption").children().size();
                                    setTimeout(function () {
                                        template.page.components.fullscreenComponents.homeSlider.update()
                                    }, e)
                                }).attr("src", i)
                            }).attr("src", r)
                        };
                        t.preloader.stop(true, false).animate({
                            opacity: 1
                        }, 600, "easeInOutCubic");
                        template.background.load("<img src='" + this.slides.eq(e).children("img").eq(0).attr("data-large") + "' />");
                        this.controls.find("a").eq(e).addClass("active").siblings().removeClass("active");
                        this.index = e
                    },
                    update: function () {
                        var e = this.navNext.children("span").eq(0);
                        var t = $("<img src='" + this.slides.eq(this.getCorrectIndex(this.index + 1)).children("img").eq(0).attr("data-thumb") + "' />");
                        template.animator.animate(e, "v", "easeInOutCubic", 0, -e.children("img").eq(0).width(), 450, function () {
                            e.css("margin-right", e.data("v"))
                        }, function () {
                            e.children("img").remove().end().css("margin-right", 0);
                            setTimeout(function () {
                                e.prepend(t).css("margin-right", -e.children("img").eq(0).width());
                                template.animator.animate(e, "v", "easeInOutCubic", parseInt(e.css("margin-right")), 0, 450, function () {
                                    e.css("margin-right", e.data("v"))
                                })
                            }, 100)
                        });
                        var n = this.navPrev.children("span").eq(0);
                        var r = $("<img src='" + this.slides.eq(this.getCorrectIndex(this.index - 1)).children("img").eq(0).attr("data-thumb") + "' />");
                        template.animator.animate(n, "v", "easeInOutCubic", 0, -n.children("img").eq(0).width(), 450, function () {
                            n.css("margin-left", n.data("v"))
                        }, function () {
                            n.children("img").remove().end().css("margin-left", 0);
                            setTimeout(function () {
                                n.prepend(r).css("margin-left", -n.children("img").eq(0).width());
                                template.animator.animate(n, "v", "easeInOutCubic", parseInt(n.css("margin-left")), 0, 450, function () {
                                    n.css("margin-left", n.data("v"))
                                })
                            }, 100)
                        });
                        template.background.finish();
                        var i = template.page.components.fullscreenComponents.homeSlider;
                        var s = i.element.find(".slides");
                        var o = s.children().eq(i.index);
                        o.siblings().removeClass("active").end().addClass("active")
                    },
                    getCorrectIndex: function (e) {
                        if (e > this.slides.size() - 1) e = 0;
                        if (e < 0) e = this.slides.size() - 1;
                        return e
                    },
                    autoplay: {
                        to: false,
                        pause: false,
                        duration: 15e3,
                        start: function () {
                            var e = template.page.components.fullscreenComponents.homeSlider;
                            if (!e.autoplayMode || this.pause) return;
                            this.stop();
                            this.to = setTimeout(function () {
                                e.getNext()
                            }, this.duration)
                        },
                        stop: function () {
                            clearTimeout(this.to)
                        }
                    },
                    captions: {
                        hide: function () {
                            var e = template.page.components.fullscreenComponents.homeSlider;
                            var t = e.element.find(".slides");
                            var n = t.children();
                            var r = n.find(".fullscreen-caption").children();
                            r.each(function () {
                                $(this).stop(true, false).delay(200 + $(this).index() * 100).animate({
                                    "margin-left": -200,
                                    opacity: 0
                                }, 600, "easeInOutCubic")
                            })
                        },
                        update: function () {
                            var e = template.page.components.fullscreenComponents.homeSlider;
                            var t = e.element.find(".slides");
                            var n = t.children().eq(e.index);
                            var r = n.find(".fullscreen-caption").children();
                            t.children().fadeIn();
                            n.show().siblings().hide();
                            r.each(function () {
                                $(this).stop(true, false).css({
                                    display: "block",
                                    "margin-left": -200,
                                    opacity: 0
                                }).delay(200 + $(this).index() * 100).animate({
                                    "margin-left": 0,
                                    opacity: 1
                                }, 600, "easeInOutCubic")
                            });
                            r.find(".slide").each(function () {
                                $(this).stop(true, false).css({
                                    "margin-left": -200
                                }).delay(200 + $(this).index() * 150).animate({
                                    "margin-left": 0
                                }, 600, "easeInOutCubic")
                            })
                        }
                    }
                }
            }
        }
    },
    dock: {
        element: $("#dock"),
        hidden: false,
        onStateChange: {},
        onAfterStateChange: {},
        onBeforeStateChange: {},
        init: function () {
            this.header.menu.init();
            this.header.mobileMenu.init();
            this.pageTopLink.init();
            this.toggleDock.init();
            this.stateChange();
            this.hide();
            this.element.stop(true, true);
            if ($.cookie) {
                if ($.cookie("ts-hide-dock") == "1") {
                    this.hide();
                    this.element.stop(true, true)
                } else {
                    this.show();
                    this.element.stop(true, true)
                }
            }
        },
        show: function () {
            this.beforeStateChange();
            this.hidden = false;
            this.element.addClass("active");
            $("body").addClass("active-dock");
            this.element.stop(true, false).animate({
                bottom: 0
            }, {
                duration: 600,
                easing: "easeInOutCubic",
                step: this.stateChange,
                complete: function () {
                    if (template.page.element.hasClass("no-scroll")) {
                        template.page.element.height($(window).height() - template.dock.header.height - template.dock.footer.height)
                    }
                    template.dock.afterStateChange()
                }
            })
        },
        hide: function () {
            if (template.page.element.hasClass("no-scroll")) {
                template.page.element.height($(window).height())
            }
            this.beforeStateChange();
            this.hidden = true;
            this.element.removeClass("active");
            $("body").removeClass("active-dock");
            this.element.stop(true, false).animate({
                bottom: -(this.header.height + this.footer.height)
            }, {
                duration: 600,
                easing: "easeInOutCubic",
                step: this.stateChange,
                complete: this.afterStateChange
            })
        },
        stateChange: function () {
            template.page.element.css("padding-bottom", template.dock.element.outerHeight() + parseInt(template.dock.element.css("bottom")) + (template.page.element.hasClass("fullscreen") ? 0 : 35));
            for (var e in template.dock.onStateChange) {
                if ($.isFunction(template.dock.onStateChange[e])) template.dock.onStateChange[e]()
            }
        },
        afterStateChange: function () {
            for (var e in template.dock.onAfterStateChange) {
                if ($.isFunction(template.dock.onAfterStateChange[e])) template.dock.onAfterStateChange[e]()
            }
        },
        beforeStateChange: function () {
            for (var e in template.dock.onBeforeStateChange) {
                if ($.isFunction(template.dock.onBeforeStateChange[e])) template.dock.onBeforeStateChange[e]()
            }
        },
        header: {
            element: $("#header"),
            height: $("#header").outerHeight(),
            logo: {
                element: $("#site-logo")
            },
            menu: {
                element: $("#main-nav1"),
                root: $("#main-nav1").children("ul"),
                height: 0,
                active: false,
                hasSubmenus: false,
                init: function () {
                    var e = this;
                    e.root.children("li").each(function () {
                        if ($(this).children("ul").size() > 0) {
                            e.hasSubmenus = true;
                            $(this).children("ul").find("li").each(function () {
                                if ($(this).children("ul").size() > 0) {
                                    $(this).addClass("has-submenu");
                                    if (template.config.showSubmenuOn == "click") {
                                        $(this).mouseenter(function () {
                                            var e = $(this).children("ul").eq(0);
                                            clearTimeout(e.data("to"))
                                        })
                                    }
                                    $(this).children("a")[template.config.showSubmenuOn](function (t) {
                                        var n = $(this).parent().children("ul").eq(0);
                                        if (template.config.showSubmenuOn != "click") {
                                            clearTimeout(n.data("to"))
                                        }
                                        e.root.find("li > ul > li ul").not(n).not(n.parentsUntil(e.root)).hide().parent().removeClass("active");
                                        if ($(this).parent().hasClass("active") && template.config.showSubmenuOn == "click") {
                                            $(this).parent().removeClass("active");
                                            n.fadeOut(200);
                                            return false
                                        } else {
                                            $(this).parent().addClass("active")
                                        }
                                        n.show().css("top", 0);
                                        var r = template.dock.footer.element.offset().top - (n.offset().top + n.outerHeight() + 10);
                                        if (r < 0) {
                                            n.css("top", r)
                                        }
                                        if (template.config.showSubmenuOn != "click") n.css("margin", 0);
                                        n.stop(true, true).css({
                                            opacity: 0,
                                            right: "auto",
                                            left: "75%"
                                        }).animate({
                                            opacity: 1,
                                            left: "100%"
                                        }, 300, "easeOutCubic");
                                        if (n.offset().left + n.outerWidth() > $(window).width()) {
                                            n.stop(true, true).css({
                                                opacity: 0,
                                                right: "75%",
                                                left: "auto"
                                            }).animate({
                                                opacity: 1,
                                                right: "100%"
                                            }, 300, "easeOutCubic")
                                        }
                                        return false
                                    });
                                    $(this).mouseleave(function () {
                                        var e = $(this);
                                        var t = $(this).children("ul").eq(0);
                                        clearTimeout(t.data("to"));
                                        t.data("to", setTimeout(function () {
                                            e.removeClass("active");
                                            template.config.showSubmenuOn == "click" ? t.fadeOut(200) : t.hide()
                                        }, 400))
                                    })
                                }
                            })
                        }
                        $(this).find("a").each(function () {
                            $(this).click(function () {
                                if ($(this).parent().hasClass("has-submenu")) return;
                                var e = $(this).attr("href");
                                if (e.indexOf("http://", 0) == -1 && e.indexOf("https://", 0) == -1) {
                                    template.page.load(e);
                                    template.dock.header.menu.element.find("li").removeClass("current");
                                    $(this).parents("li").addClass("current");
                                    return false
                                }
                            })
                        })
                    });
                    e.element.mouseenter(function () {
                        if (!e.hasSubmenus) return;
                        e.open()
                    });
                    template.dock.element.mouseleave(function () {
                        e.close()
                    })
                },
                open: function () {
                    var e = this;
                    if (e.active) return;
                    if (template.isMobile()) return;
                    e.root.children("li").each(function () {
                        $(this).data("tmpw", $(this).width());
                        $(this).css("width", "auto");
                        $(this).data("w", $(this).width()).width($(this).data("tmpw"));
                        $(this).data("h", $(this).height()).height($(this).data("h"))
                    });
                    template.dock.header.element.css({
                        opacity: 1,
                        bottom: 0
                    });
                    var t = Math.max.apply(Math, e.root.children("li").map(function () {
                        return $(this).data("w")
                    }).get()) * 1.5;
                    if (t * e.root.children("li").size() > template.dock.header.element.width() - 40) {
                        t = (template.dock.header.element.width() - 40) / e.root.children("li").size()
                    }
                    e.height = 0;
                    e.root.children("li").stop(true, false).children("ul").css({
                        width: t,
                        "margin-left": -t * .5
                    });
                    e.root.children("li").each(function () {
                        e.height = Math.max(e.height, $(this).children("a").height() + $(this).children("ul").height() + 40)
                    });
                    e.root.children("li").stop(true, false).animate({
                        width: t,
                        height: this.height
                    }, 400, "easeInOutQuad");
                    template.dock.header.element.stop(true, false).delay(50).animate({
                        height: this.height
                    }, {
                        duration: 600,
                        easing: "easeInOutCubic"
                    });
                    if ($(window).width() - (t + 1) * this.root.children("li").size() < template.dock.header.logo.element.outerWidth() + 50) {
                        template.dock.header.logo.element.fadeOut(300)
                    }
                    this.active = true;
                    template.dock.header.element.addClass("active")
                },
                close: function () {
                    var e = this;
                    if (template.isMobile()) return;
                    e.root.children("li").each(function (t) {
                        $(this).stop(true, false).animate({
                            width: $(this).data("w"),
                            height: $(this).data("h")
                        }, {
                            duration: 600,
                            easing: "easeInOutCubic",
                            complete: function () {
                                $(this).css("width", "auto");
                                e.active = false;
                                template.dock.header.element.removeClass("active")
                            }
                        })
                    });
                    template.dock.header.element.stop(true, false).animate({
                        height: template.dock.header.height
                    }, {
                        duration: 400,
                        easing: "easeOutCubic"
                    });
                    template.dock.header.logo.element.fadeIn(600)
                }
            },
            mobileMenu: {
                header: $("<div id='mobile-header'/>"),
                nav: $("<nav id='mobile-nav'/>"),
                logo: false,
                select: $("<select/>"),
                init: function () {
                    this.logo = template.dock.header.logo.element.clone().attr("id", "mobile-site-logo");
                    this.header.append(this.logo);
                    this.header.append(this.nav);
                    this.nav.append(this.select);
                    $("#main-wrap1").prepend(this.header);
                    this.select.change(function () {
                        window.location = this.value
                    });
                    this.createChildren(template.dock.header.menu.root, 0)
                },
                createChildren: function (e, t) {
                    var n = this;
                    $(e).children("li").each(function (e, r) {
                        var i = "";
                        for (var s = 0; s < t; s++) {
                            i += "Â Â Â Â Â Â "
                        }
                        i += $(r).children("a").text();
                        n.select.append("<option " + ($(r).hasClass("current") ? "selected = 'selected' " : "") + "value = '" + $(r).children("a").attr("href") + "'>" + i + "</option>");
                        if ($(r).children("ul").size() == 1) {
                            n.createChildren($(r).children("ul"), t + 1)
                        }
                    })
                }
            }
        },
        footer: {
            element: $("#footer"),
            height: $("#footer").outerHeight()
        },
        toggleDock: {
            element: $("#toggle-dock"),
            init: function () {
                this.element.hover(function () {
                    template.dock.toggleDock.mouseover()
                }, function () {
                    template.dock.toggleDock.mouseout()
                });
                this.element.click(this.click)
            },
            mouseover: function () {
                this.element.stop(true, false).animate({
                    left: 0
                }, 400, "easeOutCubic");
                this.element.children("span").children("span").stop(true, false).animate({
                    opacity: 1,
                    left: 0
                }, 400, "easeOutCubic")
            },
            mouseout: function (e) {
                this.element.stop(true, false).animate({
                    left: -this.element.outerWidth() + 102
                }, e == true ? 300 : 600, e == true ? "easeOutCubic" : "easeInOutCubic");
                this.element.children("span").children("span").stop(true, false).animate({
                    opacity: 0,
                    left: -this.element.children("span").children("span").width() + 30
                }, e == true ? 300 : 600, e == true ? "easeOutCubic" : "easeInOutCubic")
            },
            click: function () {
                if (template.dock.hidden) {
                    template.dock.toggleDock.element.removeClass("active");
                    template.dock.show();
                    if ($.cookie) $.cookie("ts-hide-dock", "0", {
                        path: "/"
                    })
                } else {
                    template.dock.toggleDock.element.addClass("active");
                    template.dock.hide();
                    template.dock.header.menu.close();
                    if ($.cookie) $.cookie("ts-hide-dock", "1", {
                        path: "/"
                    })
                }
                template.dock.toggleDock.mouseout(true);
                return false
            }
        },
        pageTopLink: {
            element: $("#page-top-link"),
            init: function () {
                this.element.hover(function () {
                    template.dock.pageTopLink.mouseover()
                }, function () {
                    template.dock.pageTopLink.mouseout()
                });
                this.element.click(this.click)
            },
            mouseover: function () {
                this.element.stop(true, false).animate({
                    right: 0,
                    opacity: 1
                }, 400, "easeOutCubic");
                this.element.children("span").children("span").stop(true, false).animate({
                    opacity: 1,
                    right: 0
                }, 400, "easeOutCubic")
            },
            mouseout: function () {
                this.element.stop(true, false).animate({
                    right: -this.element.outerWidth() + 102,
                    opacity: 1
                }, 600, "easeInOutCubic");
                this.element.children("span").children("span").stop(true, false).animate({
                    opacity: 0,
                    right: -this.element.children("span").children("span").width() + 30
                }, 600, "easeInOutCubic")
            },
            click: function () {
                $(window.opera ? "html" : "html, body").stop(true, false).animate({
                    scrollTop: 0
                }, 1e3, "easeInOutCubic");
                return false
            },
            updateOpacity: function () {
                if ($(window).scrollTop() == 0) {
                    this.element.hide()
                } else if ($(window).scrollTop() > 200) {
                    this.element.fadeIn(300)
                } else {
                    this.element.fadeOut(300)
                }
            }
        }
    },
    background: {
        element: $("#background"),
        dir: "right",
        content: false,
        width: false,
        height: false,
        onReady: false,
        onAnimationFinish: false,
        firstLoad: true,
        loading: false,
        reset: function () {
            this.dir = "right";
            this.content = false;
            this.width = false;
            this.height = false;
            this.firstLoad = true;
            this.loading = false
        },
        init: function () {
            this.load(this.element.children().eq(0).clone().get(0))
        },
        load: function (e) {
            if (!e) return;
            this.content = $(e);
            this.loading = true;
            if (this.content.is("img")) {
                if (this.firstLoad) {
                    this.empty()
                }
                $("<img/>").load(function () {
                    template.background.width = this.width;
                    template.background.height = this.height;
                    template.background.complete()
                }).attr("src", this.content.attr("src"))
            } else {
                this.complete()
            }
        },
        complete: function () {
            if (this.onReady != false) {
                this.onReady();
                this.onReady = false
            } else {
                this.finish()
            }
        },
        finish: function () {
            this.element.children().addClass("old");
            this.element.append(this.content);
            this.resize();
            if (!this.firstLoad) {
                this.animate()
            } else {
                if (this.onAnimationFinish != false) {
                    this.onAnimationFinish();
                    this.onAnimationFinish = false
                }
                this.content.css({
                    opacity: 0
                });
                if (Modernizr.csstransitions) {
                    setTimeout(function () {
                        template.background.content.css({
                            opacity: 1,
                            WebkitTransition: "opacity 0.5s ease-in-out",
                            MozTransition: "opacity 0.5s ease-in-out",
                            MsTransition: "opacity 0.5s ease-in-out",
                            OTransition: "opacity 0.5s ease-in-out",
                            transition: "opacity 0.5s ease-in-out"
                        })
                    }, 1e3)
                } else {
                    this.content.animate({
                        opacity: 1
                    }, 600, "easeInOutCubic")
                }
            }
            this.firstLoad = false;
            this.loading = false
        },
        animate: function (e) {
            var t = this;
            var n;
            var r;
            var i;
            e = e || this.dir;
            switch (e) {
            case "right":
                n = $(window).width() - parseInt(t.content.css("left"));
                r = 0;
                i = "margin-left";
                break;
            case "left":
                n = -$(window).width() + parseInt(t.content.css("left"));
                r = 0;
                i = "margin-left";
                break;
            case "top":
                n = -$(window).height() + parseInt(t.content.css("top"));
                r = 0;
                i = "margin-top";
                break;
            case "bottom":
                n = $(window).height() - parseInt(t.content.css("top"));
                r = 0;
                i = "margin-top";
                break
            }
            if (Modernizr.csstransitions) {
                var s = {};
                s["-webkit-transform"] = "translateX(" + n + "px)";
                s["-moz-transform"] = "translateX(" + n + "px)";
                s["-ms-transform"] = "translateX(" + n + "px)";
                s["-o-transform"] = "translateX(" + n + "px)";
                s["transform"] = "translateX(" + n + "px)";
                t.content.css(s);
                s["-webkit-transform"] = "translateX(0px)";
                s["-moz-transform"] = "translateX(0px)";
                s["-ms-transform"] = "translateX(0px)";
                s["-o-transform"] = "translateX(0px)";
                s["transform"] = "translateX(0px)";
                t.element.children(".old").css(s);
                setTimeout(function () {
                    s = {
                        WebkitTransition: "-webkit-transform 1000ms cubic-bezier(0.475, 0.015, 0.505, 1.000)",
                        MozTransition: "-moz-transform 1000ms cubic-bezier(0.475, 0.015, 0.505, 1.000)",
                        MsTransition: "-ms-transform 1000ms cubic-bezier(0.475, 0.015, 0.505, 1.000)",
                        OTransition: "-o-transform 1000ms cubic-bezier(0.475, 0.015, 0.505, 1.000)",
                        transition: "transform 1000ms cubic-bezier(0.475, 0.015, 0.505, 1.000)"
                    };
                    s["-webkit-transform"] = "translateX(" + r + "px)";
                    s["-moz-transform"] = "translateX(" + r + "px)";
                    s["-ms-transform"] = "translateX(" + r + "px)";
                    s["-o-transform"] = "translateX(" + r + "px)";
                    s["transform"] = "translateX(" + r + "px)";
                    t.content.bind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function () {
                        t.clear();
                        if (t.onAnimationFinish != false) {
                            t.onAnimationFinish();
                            t.onAnimationFinish = false
                        }
                    });
                    t.content.css(s);
                    s = {
                        WebkitTransition: "-webkit-transform 1000ms cubic-bezier(0.475, 0.015, 0.505, 1.000)",
                        MozTransition: "-moz-transform 1000ms cubic-bezier(0.475, 0.015, 0.505, 1.000)",
                        MsTransition: "-ms-transform 1000ms cubic-bezier(0.475, 0.015, 0.505, 1.000)",
                        OTransition: "-o-transform 1000ms cubic-bezier(0.475, 0.015, 0.505, 1.000)",
                        transition: "transform 1000ms cubic-bezier(0.475, 0.015, 0.505, 1.000)"
                    };
                    s["-webkit-transform"] = "translateX(" + (r - n) + "px)";
                    s["-moz-transform"] = "translateX(" + (r - n) + "px)";
                    s["-ms-transform"] = "translateX(" + (r - n) + "px)";
                    s["-o-transform"] = "translateX(" + (r - n) + "px)";
                    s["transform"] = "translateX(" + (r - n) + "px)";
                    t.element.children(".old").css(s)
                }, 100)
            } else {
                t.content.css(i, n);
                t.element.children(".old").css(i, 0);
                var s = {};
                s[i] = r;
                t.content.animate(s, {
                    duration: 1e3,
                    easing: "easeInOutCubic",
                    step: function () {
                        t.element.children(".old").css(i, parseInt(t.content.css(i)) - n)
                    },
                    complete: function () {
                        t.clear();
                        if (t.onAnimationFinish != false) {
                            t.onAnimationFinish();
                            t.onAnimationFinish = false
                        }
                    }
                })
            }
        },
        resize: function () {
            if (!this.content) return;
            if (this.content.is("img")) {
                this.content.width($(window).width());
                this.content.height(this.content.width() * this.height / this.width);
                if (this.content.height() < $(window).height()) {
                    this.content.height($(window).height());
                    this.content.width(this.content.height() * this.width / this.height)
                }
                this.content.css("left", .5 * ($(window).width() - this.content.width()));
                this.content.css("top", .5 * ($(window).height() - this.content.height()))
            }
            if (this.content.is("iframe")) {
                this.content.width($(window).width());
                this.content.height($(window).height());
                this.content.css("left", 0);
                this.content.css("top", 0)
            }
        },
        empty: function () {
            this.element.empty()
        },
        clear: function () {
            this.element.children(".old").remove()
        }
    },
    preloader: {
        element: $("#preloader"),
        onStart: false,
        onFinish: false,
        init: function () {
            this.element.hide().children("span").css("opacity", 0);
            template.dock.onStateChange.preloader = function () {
                template.preloader.resize()
            }
        },
        show: function () {
            this.element.show().children("span").stop(true, false).css({
                opacity: 0,
                width: 80 * 1.5,
                height: 80 * 1.5,
                "margin-top": -80 * .5 * 1.5,
                "margin-left": -80 * .5 * 1.5
            }).animate({
                opacity: 1,
                width: 80,
                height: 80,
                "margin-top": -80 * .5,
                "margin-left": -80 * .5
            }, 400, "easeInOutCubic", function () {
                if ($.isFunction(template.preloader.onStart)) {
                    template.preloader.onStart();
                    template.preloader.onStart = false
                }
            })
        },
        hide: function () {
            this.element.children("span").stop(true, false).animate({
                opacity: 0,
                width: 20,
                height: 20,
                "margin-top": -10,
                "margin-left": -10
            }, 400, "easeInBack", function () {
                template.preloader.element.hide();
                if ($.isFunction(template.preloader.onFinish)) {
                    template.preloader.onFinish();
                    template.preloader.onFinish = false
                }
            })
        },
        resize: function () {}
    },
    animator: {
        animations: 0,
        renderList: {},
        init: function () {
            window.requestAnimFrame = function () {
                return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
                function (e) {
                    window.setTimeout(e, 1e3 / 60)
                }
            }();
            this.render()
        },
        animate: function (e, t, n, r, i, s, o, u) {
            var a = "_anim" + this.animations;
            n = n == undefined ? "easeInOutCubic" : n;
            r = r == undefined ? 0 : r;
            i = i == undefined ? 1 : i;
            s = s == undefined ? 1e3 : s;
            e.data("time", 0);
            e.data(t, r);
            this.renderList[a] = function () {
                var f = e.data("time");
                if (f < s) {
                    e.data(t, $.easing[n](null, f, r, i - r, s));
                    if ($.isFunction(o)) {
                        o()
                    }
                    f += 1e3 / 60
                } else {
                    delete template.animator.renderList[a];
                    if ($.isFunction(u)) {
                        u()
                    }
                }
                e.data("time", f)
            };
            this.animations++
        },
        render: function () {
            requestAnimFrame(template.animator.render);
            for (var e in template.animator.renderList) {
                if ($.isFunction(template.animator.renderList[e])) template.animator.renderList[e]()
            }
        }
    },
    isMobile: function () {
        return $(window).width() <= 800 || /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)
    },
    imagesReady: function (e, t) {
        clearInterval($(e).data("tout"));
        $(e).data("tout", setInterval(function () {
            var n = true;
            $(e).find("img").each(function () {
                if ((this.width == 0 || this.height == 0) && !$(this).data("404")) {
                    n = false
                }
            });
            if (n) {
                clearInterval($(e).data("tout"));
                t()
            }
        }, 100))
    }
};
template.preloader.element.addClass("landing");
$("#main-wrap").children().not(template.preloader.element).css("visibility", "hidden");
$("body").css("visibility", "visible");
$(window).bind("load", function () {
    template.preloader.onFinish = function () {
        template.init();
        template.dock.element.css({
            opacity: 0,
            "margin-bottom": -template.dock.element.outerHeight()
        }).animate({
            opacity: 1,
            "margin-bottom": 0
        }, 600, "easeInOutCubic");
        template.page.element.css({
            opacity: 0
        }).delay(600).animate({
            opacity: 1
        }, 600, "easeInOutCubic");
        $("#preloader").removeClass("landing");
        $("#main-wrap").children().css("visibility", "visible")
    };
    template.preloader.hide()
})

$(document).ready(function() {
    $(document).delegate('.open', 'click', function(event){
        $(this).addClass('oppenned');
        event.stopPropagation();
    })
    $(document).delegate('body', 'click', function(event) {
        $('.open').removeClass('oppenned');
    })
    $(document).delegate('.cls', 'click', function(event){
        $('.open').removeClass('oppenned');
        event.stopPropagation();
    });
});