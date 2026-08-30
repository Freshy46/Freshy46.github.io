// Kit data for the Crysgear explorer. Transcribed from AspectCatalog.java so the
// page shows exactly what /cores info prints in game.
//
// `text` as an object means the wording changes with tier: take the highest key
// that is <= the selected tier.
(function () {
  var ASPECTS = {
    strength: {
      name: "Strength", colour: "#e05252",
      blurb: "Straight-ahead melee. Removes your weaknesses as much as it adds damage.",
      passives: [
        { min: 1, text: { 1: "Strength I at all times", 2: "Strength II at all times" } },
        { min: 1, text: "Weakness cannot be applied to you" },
        { min: 3, text: "Wither cannot be applied to you" },
        { min: 3, text: "Poison cannot be applied to you" }
      ],
      abilities: [
        { min: 1, name: "Brawl", cd: 30,
          trigger: { 1: "Right click, core in main hand", 2: "Right click, core in off hand" },
          desc: "A ball of unbreakable crimson hyphae 5 blocks across. Lasts 10 seconds, then every block reverts. Anyone stood inside gets Weakness II." },
        { min: 2, name: "Fury", cd: 60, trigger: "Right click, core in main hand",
          desc: "20 seconds of black sparks and a red crown. Each crit you land multiplies your damage by another 1.25x. Taking two hits wipes the stacks." },
        { min: 3, name: "Hunger", cd: 120, trigger: "Left click air, core in main hand",
          desc: "Sharpness VI on that sword for 30 seconds, draining your food bar as it burns." },
        { min: 3, name: "Fear", cd: 50, trigger: "Left click a target, core in main hand",
          desc: "Nausea, Blindness, Slowness I and Weakness I on the target for 10 seconds." }
      ],
      infusionAbilities: [
        { min: 3, name: "Revenge", cd: 45, trigger: "Right click, infused sword",
          desc: "A 30 second window. Land 3 crits without being hit and every swing crits on its own. Being hit, or 5 quiet seconds, drops you back." }
      ],
      infusionPassives: [
        { min: 2, text: "Armour: 1 in 10 hits you take gives the attacker Weakness I for 6s" },
        { min: 3, text: "Sword: at 4 hearts or below you rage into Strength III" }
      ]
    },

    mirror: {
      name: "Mirror", colour: "#e3d36b",
      blurb: "Turns other people's advantages into yours. Copies, reflects, and throws out decoys.",
      passives: [
        { min: 1, text: "10% chance to copy an attacker's effects onto you for 8s" },
        { min: 1, text: "20% chance to reflect a projectile back at whoever fired it" },
        { min: 2, text: "20% chance to throw out an afterimage when you are hit" }
      ],
      abilities: [
        { min: 1, name: "Afterimage", cd: 30,
          trigger: { 1: "Right click, core in main hand", 2: "Right click, core in off hand" },
          desc: "A decoy takes your place and you turn invisible. It pops in pale yellow when struck, or fades on its own after 5 seconds." },
        { min: 2, name: "Visualize", cd: 35, trigger: "Right click, core in main hand",
          desc: "A 6 block field that follows you for 15 seconds, copying the potion effects of everyone inside it onto you." },
        { min: 3, name: "Shatter", cd: 100, trigger: "Left click air, core in main hand",
          desc: "Five clones batter the target in turn for two hearts each, with knockback, then vanish together." }
      ],
      infusionAbilities: [
        { min: 3, name: "Replicate", cd: 20, trigger: "Right click, infused sword",
          desc: "Land two knockback hits without being hit and you start replicating. Every hit after adds a clone beside your target, up to five, and the whole set strikes with you. Taking a knockback hit breaks the chain." }
      ],
      infusionPassives: [
        { min: 2, text: "Armour: 12% chance a clone of your attacker turns their own hit back on them" }
      ]
    },

    light: {
      name: "Light", colour: "#ffd63c",
      blurb: "Ranged and disruptive. The only aspect that changes how you fight at distance.",
      passives: [
        { min: 1, text: {
            1: "10% chance to call lightning when you hit with a bow or crossbow",
            2: "10% chance to call lightning when you hit with a bow, crossbow or trident" } },
        { min: 1, text: "Your body gives off torch light" },
        { min: 2, text: "Blindness cannot be applied to you" }
      ],
      abilities: [
        { min: 1, name: "Reflection", cd: 30,
          trigger: { 1: "Right click, core in main hand", 2: "Right click, core in off hand" },
          desc: "Coat yourself in light for 5 seconds. The next hit you take lands on your attacker instead." },
        { min: 2, name: "Bolt", cd: 45, trigger: "Right click, core in main hand",
          desc: "Throw a yellow bolt. Whatever it hits gets struck by lightning for 3 hearts." },
        { min: 3, name: "Beams", cd: 80, trigger: "Left click air, core in main hand",
          desc: "Summon 3 runes that angle wherever you aim. Each left click fires one beam - left, right, then middle - and spends that rune." }
      ],
      infusionAbilities: [],
      infusionPassives: [
        { min: 2, text: {
            2: "Armour: 15% chance an attacker gains yellow glow for 8s, plus Slowness I and Nausea",
            3: "Armour: 15% chance an attacker gains yellow glow for 8s, plus Mining Fatigue I and Nausea" } },
        { min: 3, text: "Sword: 15% chance to mark a target with 6s of glow and Slowness I" }
      ]
    },

    fire: {
      name: "Fire", colour: "#ff8c1e",
      blurb: "The one that changes where you can go. Lava stops being terrain and starts being cover.",
      passives: [
        { min: 1, text: "Fire resistance at all times" },
        { min: 1, text: "Lava fog cannot blind you" },
        { min: 2, text: "You move through lava as though it were water" },
        { min: 3, text: "Standing in lava gives your hits a 1.10x boost" }
      ],
      abilities: [
        { min: 1, name: "Ember", cd: 45, trigger: "Right click, core in off hand",
          desc: "For 10 seconds anything you land a hit with sets the target alight, with no fire aspect enchant involved." },
        { min: 2, name: "Fry", cd: 35, trigger: "Right click, core in main hand",
          desc: "A 6 block ring that follows you, cooking anyone inside and boiling away water. Fire resistance does not save them." },
        { min: 3, name: "Fireball", cd: 100, trigger: "Left click air, core in main hand",
          desc: "Charges over 60 seconds, growing as it goes. Release any time for 2 hearts and a 3 block crater, up to 6 hearts and 8 blocks at full." }
      ],
      infusionAbilities: [],
      infusionPassives: [
        { min: 1, text: "Armour: standing in lava grants Regeneration I" },
        { min: 3, text: "Sword: Fire Aspect II for as long as it stays infused" }
      ]
    }
  };

  var root = document.getElementById("explorer");
  if (!root) return;

  var state = { aspect: "strength", tier: 3 };
  var timers = {};

  // A tiered string picks the highest key that the current tier reaches.
  function atTier(text, tier) {
    if (typeof text === "string") return text;
    var best = "";
    Object.keys(text).forEach(function (k) {
      if (Number(k) <= tier) best = text[k];
    });
    return best;
  }

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function abilityRow(a, tier, infused) {
    var trig = esc(atTier(a.trigger, tier));
    return '<li class="ab" data-cd="' + a.cd + '">' +
      '<div class="ab-head">' +
        '<span class="ab-name">' + esc(a.name) + "</span>" +
        (infused ? '<span class="tier">infused</span>' : '<span class="tier">T' + a.min + "</span>") +
        '<button type="button" class="cdbtn" aria-label="Run the ' + esc(a.name) + ' cooldown">' +
          a.cd + "s</button>" +
      "</div>" +
      '<p class="ab-trig">' + trig + "</p>" +
      '<p class="ab-desc">' + esc(a.desc) + "</p>" +
      "</li>";
  }

  function render() {
    var a = ASPECTS[state.aspect];
    var t = state.tier;
    root.style.setProperty("--c", a.colour);

    var avail = function (list) { return list.filter(function (x) { return x.min <= t; }); };
    var pas = avail(a.passives).map(function (p) { return "<li>" + esc(atTier(p.text, t)) + "</li>"; });
    var abil = avail(a.abilities).map(function (x) { return abilityRow(x, t, false); });
    var inf = avail(a.infusionAbilities).map(function (x) { return abilityRow(x, t, true); });
    var infPas = avail(a.infusionPassives).map(function (p) { return "<li>" + esc(atTier(p.text, t)) + "</li>"; });

    root.querySelectorAll(".ex-pick[data-aspect]").forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.dataset.aspect === state.aspect));
    });
    root.querySelectorAll(".ex-pick[data-tier]").forEach(function (b) {
      b.setAttribute("aria-pressed", String(Number(b.dataset.tier) === t));
    });

    root.querySelector(".ex-out").innerHTML =
      '<p class="ex-blurb">' + esc(a.blurb) + "</p>" +
      "<h3>Passives</h3><ul class=\"ex-list\">" + pas.join("") + "</ul>" +
      "<h3>Abilities <span class=\"ex-note\">click a cooldown to run it</span></h3>" +
      (abil.length ? '<ul class="ab-list">' + abil.join("") + "</ul>"
                   : '<p class="ex-none">No active abilities at this tier.</p>') +
      (inf.length || infPas.length
        ? "<h3>Infused into gear</h3>" +
          (infPas.length ? '<ul class="ex-list">' + infPas.join("") + "</ul>" : "") +
          (inf.length ? '<ul class="ab-list">' + inf.join("") + "</ul>" : "")
        : "");

    timers = {};
  }

  // The cooldown demo. Real seconds, matching the plugin's own numbers.
  root.addEventListener("click", function (e) {
    var btn = e.target.closest(".cdbtn");
    if (btn) {
      var li = btn.closest(".ab");
      var total = Number(li.dataset.cd);
      if (btn.dataset.running === "1") return;
      btn.dataset.running = "1";
      li.classList.add("cooling");
      var left = total;
      btn.textContent = left + "s";
      var id = setInterval(function () {
        left--;
        if (left <= 0) {
          clearInterval(id);
          btn.dataset.running = "";
          li.classList.remove("cooling");
          li.classList.add("ready");
          btn.textContent = total + "s";
          setTimeout(function () { li.classList.remove("ready"); }, 900);
          return;
        }
        btn.textContent = left + "s";
        li.style.setProperty("--pct", ((total - left) / total * 100).toFixed(1) + "%");
      }, 1000);
      li.style.setProperty("--pct", "0%");
      return;
    }

    var pick = e.target.closest(".ex-pick");
    if (!pick) return;
    if (pick.dataset.aspect) state.aspect = pick.dataset.aspect;
    if (pick.dataset.tier) state.tier = Number(pick.dataset.tier);
    render();
  });

  render();
})();
