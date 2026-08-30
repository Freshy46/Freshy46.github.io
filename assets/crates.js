// Weighted-roll simulator for the KyronCrates page. Same selection the plugin
// does: sum the weights, pick a number below the total, walk the list until the
// running total passes it.
(function () {
  var root = document.getElementById("sim");
  if (!root) return;

  var rewards = [
    { name: "Netherite Ingot", weight: 1,  colour: "#8f7f74" },
    { name: "Enchanted Diamond Kit", weight: 3, colour: "#4ce0d5" },
    { name: "Golden Apple x8", weight: 10, colour: "#ffd63c" },
    { name: "Diamond Block x4", weight: 25, colour: "#3fd6f5" },
    { name: "Iron Block x8", weight: 60, colour: "#b7bfc9" }
  ];

  var rolls = [];

  function total() {
    return rewards.reduce(function (n, r) { return n + r.weight; }, 0);
  }

  function roll() {
    var t = total();
    if (t <= 0) return null;
    var pick = Math.random() * t;
    var acc = 0;
    for (var i = 0; i < rewards.length; i++) {
      acc += rewards[i].weight;
      if (pick < acc) return i;
    }
    return rewards.length - 1;
  }

  function pct(n) { return (n * 100).toFixed(1) + "%"; }

  function render() {
    var t = total();
    var body = rewards.map(function (r, i) {
      var expected = t ? r.weight / t : 0;
      var got = rolls.filter(function (x) { return x === i; }).length;
      var actual = rolls.length ? got / rolls.length : 0;
      return '<tr>' +
        '<td><span class="dot" style="background:' + r.colour + '"></span>' + r.name + "</td>" +
        '<td class="wcell">' +
          '<button type="button" class="wbtn" data-i="' + i + '" data-d="-1" aria-label="Lower weight">−</button>' +
          '<span class="wval">' + r.weight + "</span>" +
          '<button type="button" class="wbtn" data-i="' + i + '" data-d="1" aria-label="Raise weight">+</button>' +
        "</td>" +
        '<td class="cd">' + pct(expected) + "</td>" +
        '<td class="cd">' + (rolls.length ? pct(actual) + ' <span class="dim">(' + got + ")</span>" : "—") + "</td>" +
        '<td class="barcell"><span class="bar" style="width:' + (expected * 100).toFixed(1) +
          "%;background:" + r.colour + '"></span></td>' +
        "</tr>";
    }).join("");

    root.querySelector(".sim-body").innerHTML = body;
    root.querySelector(".sim-total").textContent = t;
    root.querySelector(".sim-count").textContent = rolls.length;
  }

  function announce(i) {
    var out = root.querySelector(".sim-last");
    if (i === null) { out.textContent = "Every weight is zero — nothing to win."; return; }
    out.innerHTML = 'You won <strong style="color:' + rewards[i].colour + '">' +
      rewards[i].name + "</strong>";
  }

  root.addEventListener("click", function (e) {
    var w = e.target.closest(".wbtn");
    if (w) {
      var i = Number(w.dataset.i);
      var d = Number(w.dataset.d) * (e.shiftKey ? 10 : 1);
      rewards[i].weight = Math.max(0, rewards[i].weight + d);
      rolls = [];
      render();
      root.querySelector(".sim-last").textContent = "Weights changed — counts reset.";
      return;
    }
    var act = e.target.closest("[data-sim]");
    if (!act) return;
    var n = act.dataset.sim;
    if (n === "reset") { rolls = []; render(); root.querySelector(".sim-last").textContent = "Reset."; return; }
    var times = Number(n);
    var last = null;
    for (var k = 0; k < times; k++) { last = roll(); if (last !== null) rolls.push(last); }
    render();
    announce(last);
  });

  render();
})();
