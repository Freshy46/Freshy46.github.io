// Click a command to copy it. Falls back to a text selection when the
// clipboard API is blocked, which it is on file:// in some browsers.
document.querySelectorAll(".cmd").forEach(function (el) {
  var text = el.textContent.trim();
  var btn = document.createElement("button");
  btn.className = "copy";
  btn.type = "button";
  btn.textContent = "copy";
  el.appendChild(btn);

  btn.addEventListener("click", function () {
    var done = function () {
      btn.textContent = "copied";
      btn.classList.add("ok");
      setTimeout(function () {
        btn.textContent = "copy";
        btn.classList.remove("ok");
      }, 1200);
    };

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(done, select);
    } else {
      select();
    }

    function select() {
      var range = document.createRange();
      range.selectNodeContents(el.firstChild);
      var sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
      try {
        document.execCommand("copy") ? done() : (btn.textContent = "select + ⌘C");
      } catch (e) {
        btn.textContent = "select + ⌘C";
      }
    }
  });
});

// A screenshot that hasn't been added yet hides its whole figure rather than
// leaving a broken image on the page.
document.querySelectorAll("figure img").forEach(function (img) {
  function hide() {
    var fig = img.closest("figure");
    if (fig) fig.classList.add("missing");
  }
  img.addEventListener("error", hide);
  // This script runs at the end of the body, so a missing image has usually
  // failed already and the error event is long gone. A loaded-but-zero-width
  // image is one that failed.
  if (img.complete && img.naturalWidth === 0) hide();
});

// Copy-to-clipboard account cards (a Discord username isn't a link).
document.querySelectorAll("[data-copy]").forEach(function (btn) {
  btn.addEventListener("click", function () {
    var text = btn.getAttribute("data-copy");
    var done = function () {
      btn.classList.add("ok");
      setTimeout(function () { btn.classList.remove("ok"); }, 1400);
    };
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(done, done);
    } else {
      var ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand("copy"); done(); } catch (e) {}
      document.body.removeChild(ta);
    }
  });
});

// Sections move in 3D as they come into view, and again every time they come
// back - scrolling up and down replays the effect rather than firing once.
//
// Deliberately NOT IntersectionObserver. The reveal transform shifts the
// element vertically, which changes the rect the observer measures, which
// pushes it back outside the margin, which removes the class, which moves it
// back - it oscillates. offsetTop is layout position and transforms do not
// affect it, so measuring that instead has no feedback loop.
(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return;

  var targets = [].slice.call(document.querySelectorAll(
    '.cards > a, .accounts > a, .accounts > button, .wrap > h2, .wrap > h3, ' +
    '.wrap > p, .wrap > .scroll, .wrap > details, .wrap > figure, ' +
    '.wrap > blockquote, .wrap > pre, .wrap > .empty, .wrap > .cmd'
  ));
  if (!targets.length) return;

  function variant(el, i) {
    var parent = el.parentElement;
    if (parent.classList.contains('cards') || parent.classList.contains('accounts')) {
      return i % 2 ? 'rise-r' : 'rise-l';
    }
    var tag = el.tagName;
    if (tag === 'FIGURE' || tag === 'PRE' || el.classList.contains('scroll')) return 'rise-deep';
    if (tag === 'H2' || tag === 'H3') return 'rise-tilt';
    return '';
  }

  targets.forEach(function (el, i) {
    var v = variant(el, i);
    el.classList.add('rise');
    if (v) el.classList.add(v);
    if (v === 'rise-l' || v === 'rise-r') {
      el.style.transitionDelay = (i % 2) * 80 + 'ms';
    }
  });

  // Distance from the top of the document, walking the offset chain. Unaffected
  // by any transform on the element or its ancestors.
  function docTop(el) {
    var y = 0;
    for (var n = el; n; n = n.offsetParent) y += n.offsetTop;
    return y;
  }

  var spots = [];
  function measure() {
    spots = targets.map(function (el) {
      var top = docTop(el);
      return { el: el, top: top, bottom: top + el.offsetHeight };
    });
  }

  // Separate thresholds for showing and hiding. The reveal transform changes
  // the page's scroll height, which fires more scroll events, so a single
  // boundary would let an element flip back and forth across it. With a wide
  // dead zone between the two, it cannot.
  function apply() {
    var top = window.pageYOffset;
    var h = window.innerHeight;

    // A zero-height viewport - a hidden tab, some embedded views - would make
    // every test fail and leave the page blank. Show everything instead.
    if (!h) {
      for (var k = 0; k < spots.length; k++) spots[k].el.classList.add("in");
      return;
    }

    var bottom = top + h;

    var showTop = top + h * 0.05;
    var showBottom = bottom - h * 0.10;
    var hideTop = top - h * 0.3;
    var hideBottom = bottom + h * 0.3;

    for (var i = 0; i < spots.length; i++) {
      var s = spots[i];
      var shown = s.el.classList.contains('in');
      if (!shown) {
        if (s.top < showBottom && s.bottom > showTop) s.el.classList.add('in');
      } else {
        if (s.top > hideBottom || s.bottom < hideTop) s.el.classList.remove('in');
      }
    }
  }

  // Coalesce scroll events into one update per frame. requestAnimationFrame
  // can be starved - background tabs, some embedded webviews - so a timer
  // backs it up rather than letting updates stop altogether.
  var queued = false;
  function onScroll() {
    if (queued) return;
    queued = true;
    var run = function () {
      if (!queued) return;
      queued = false;
      apply();
    };
    if (window.requestAnimationFrame) {
      requestAnimationFrame(run);
      setTimeout(run, 120);
    } else {
      setTimeout(run, 16);
    }
  }

  function remeasure() { measure(); apply(); }

  measure();
  apply();

  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', remeasure);
  addEventListener('load', remeasure);
  // Opening a details block moves everything below it.
  document.querySelectorAll('details').forEach(function (d) {
    d.addEventListener('toggle', remeasure);
  });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(remeasure);
})();

// A highlight that follows the cursor across the nav and settles back on the
// current page. Purely additive: without JS the .here link keeps its own
// background, so the active page is still obvious.
(function () {
  var nav = document.querySelector(".top nav");
  if (!nav) return;
  var links = [].slice.call(nav.querySelectorAll("a"));
  var current = nav.querySelector("a.here");
  if (!links.length) return;

  var slider = document.createElement("span");
  slider.className = "slider";
  nav.appendChild(slider);

  function moveTo(link, isHere) {
    if (!link) { slider.style.opacity = "0"; return; }
    slider.style.opacity = "1";
    slider.style.width = link.offsetWidth + "px";
    slider.style.transform = "translateX(" + link.offsetLeft + "px)";
    slider.classList.toggle("on-here", !!isHere);
  }

  function settle() { moveTo(current, true); }

  // Only take over the active styling once we know the slider is positioned.
  if (current && current.offsetWidth) {
    nav.classList.add("sliding");
    settle();
  } else {
    slider.style.opacity = "0";
  }

  links.forEach(function (a) {
    a.addEventListener("mouseenter", function () { moveTo(a, a === current); });
    a.addEventListener("focus", function () { moveTo(a, a === current); });
  });
  nav.addEventListener("mouseleave", settle);
  nav.addEventListener("focusout", function (e) {
    if (!nav.contains(e.relatedTarget)) settle();
  });
  addEventListener("resize", settle);
})();

// Theme toggle. Defaults to whatever the OS prefers and only stores a choice
// once the reader actually makes one, so a system switch keeps working for
// anyone who never touches the button.
(function () {
  var nav = document.querySelector(".top nav");
  if (!nav) return;

  var btn = document.createElement("button");
  btn.type = "button";
  btn.className = "themer";
  btn.setAttribute("aria-label", "Switch between light and dark");
  btn.innerHTML =
    '<svg class="sun" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 17a5 5 0 1 1 0-10 5 5 0 0 1 0 10zm0-13a1 1 0 0 1-1-1V1a1 1 0 0 1 2 0v2a1 1 0 0 1-1 1zm0 16a1 1 0 0 1 1 1v2a1 1 0 0 1-2 0v-2a1 1 0 0 1 1-1zM4 12a1 1 0 0 1-1 1H1a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1zm19 0a1 1 0 0 1-1 1h-2a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1zM5.6 5.6a1 1 0 0 1 0-1.4 1 1 0 0 1 1.4 0l1.4 1.4a1 1 0 1 1-1.4 1.4L5.6 5.6zm11 11a1 1 0 0 1 1.4 0l1.4 1.4a1 1 0 0 1-1.4 1.4l-1.4-1.4a1 1 0 0 1 0-1.4zm1.4-11L16.6 7a1 1 0 0 1-1.4-1.4l1.4-1.4a1 1 0 0 1 1.4 1.4zM7 16.6a1 1 0 0 1 0 1.4l-1.4 1.4a1 1 0 0 1-1.4-1.4L5.6 16.6a1 1 0 0 1 1.4 0z"/></svg>' +
    '<svg class="moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M21 13.2A9 9 0 1 1 10.8 3a7 7 0 0 0 10.2 10.2z"/></svg>';
  nav.appendChild(btn);

  var stored = null;
  try { stored = localStorage.getItem("theme"); } catch (e) {}
  if (stored) document.documentElement.setAttribute("data-theme", stored);

  function current() {
    var set = document.documentElement.getAttribute("data-theme");
    if (set) return set;
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches
      ? "light" : "dark";
  }

  btn.addEventListener("click", function () {
    var next = current() === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try { localStorage.setItem("theme", next); } catch (e) {}
  });
})();

// Tag filter on the work index. Cards carry their tags in data-tags.
(function () {
  var bar = document.querySelector(".filter");
  var grid = document.querySelector(".cards");
  if (!bar || !grid) return;

  var cards = [].slice.call(grid.querySelectorAll(".card"));
  var empty = document.createElement("p");
  empty.className = "filter-none";
  empty.hidden = true;
  empty.textContent = "Nothing with that tag.";
  grid.parentNode.insertBefore(empty, grid.nextSibling);

  bar.addEventListener("click", function (e) {
    var btn = e.target.closest(".fbtn");
    if (!btn) return;
    var tag = btn.dataset.tag;

    bar.querySelectorAll(".fbtn").forEach(function (b) {
      b.setAttribute("aria-pressed", String(b === btn));
    });

    // From the first click on, the filter decides what is visible.
    grid.classList.add("filtering");

    var shown = 0;
    cards.forEach(function (c) {
      var tags = (c.dataset.tags || "").split(" ");
      var on = tag === "all" || tags.indexOf(tag) !== -1;
      c.classList.toggle("hidden", !on);
      // A card the filter is showing must be visible immediately. Don't leave
      // that to the scroll effect - it caches layout positions, and filtering
      // has just moved everything.
      if (on) { c.classList.add("in"); shown++; }
    });
    empty.hidden = shown > 0;

    // Hiding cards moves everything below them, and the reveal effect caches
    // layout positions. Without this the surviving cards keep their old
    // positions, never qualify as on-screen, and stay invisible.
    window.dispatchEvent(new Event("resize"));
  });
})();
