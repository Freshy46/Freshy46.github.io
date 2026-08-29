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
document.querySelectorAll("button.acct[data-copy]").forEach(function (btn) {
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
