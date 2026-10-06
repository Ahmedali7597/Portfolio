// The Jack of Spades hero. Scrolling spins the Jack once, then the skills slide out of it;
// once dealt, the skills orbit the Jack on their own until the section leaves the screen.
// The cards themselves come from src/data/skills.ts; this file only moves them.

// Scroll milestones, as fractions of the pinned distance.
const SPIN = [0.04, 0.4]; // the Jack turns once (storyboard frames 2-4)
const DEAL = [0.42, 0.8]; // the skills slide out of the Jack to their place on the ring
const ORBIT_SECONDS = 40; // one lap of the ring once everything is dealt
const ROUNDNESS = 1.1; // the ring stays within 10% of a perfect circle, whatever the stage's shape

const clamp = (v) => Math.min(1, Math.max(0, v));
// A point on the ring, clockwise from twelve o'clock.
const ring = (a) => [Math.sin(a), -Math.cos(a)];
const range = (p, [a, b]) => clamp((p - a) / (b - a));
const smooth = (t) => t * t * (3 - 2 * t);
const lerp = (a, b, t) => a + (b - a) * t;

export function initDeck() {
  const deck = document.querySelector(".deck");
  if (!deck) return;
  const stage = deck.querySelector(".deck-stage");
  const table = deck.querySelector(".deck-table");
  const jack = deck.querySelector(".jack");
  const cards = [...deck.querySelectorAll(".skill")];
  const n = cards.length;

  let geo;
  let frame = 0;
  let orbit = 0; // radians the ring has turned so far
  // How far each card trails its slot, in radians. A hovered or focused card stops, so its lag grows;
  // once released, the lag eases back to zero and the card glides home.
  const lag = cards.map(() => 0);
  let dealt = false;
  let inView = false;
  let looping = false;
  let last = 0;

  // Layout sizes only change on resize, so measure them once here, not every frame.
  function measure() {
    const w = table.clientWidth;
    const h = table.clientHeight;
    const cw = cards[0]?.offsetWidth || 1;
    const ch = cw * 1.5;
    // On tall, narrow stages (phones) the ring may overhang the sides a little, so it can stay
    // round and still leave the Jack the largest card; cards swing past the edge like a carousel.
    const overhang = w < h ? cw * 0.3 : 0;
    const maxX = Math.max(0, (w - cw) / 2 - 8 + overhang);
    const maxY = Math.max(0, (h - ch) / 2);
    const r = Math.min(maxX, maxY);
    const rx = Math.min(maxX, r * ROUNDNESS);
    const ry = Math.min(maxY, r * ROUNDNESS);
    const jw = jack.offsetWidth || 1;
    const jh = jack.offsetHeight || 1;
    // Largest Jack that no card touches anywhere on the ring: at each degree, the card must clear
    // the Jack either sideways or vertically, with a small gap.
    let jackScale = 1;
    for (let deg = 0; deg < 360; deg++) {
      const [ux, uy] = ring((deg * Math.PI) / 180);
      const x = Math.abs(rx * ux);
      const y = Math.abs(ry * uy);
      jackScale = Math.min(jackScale, Math.max((x - cw / 2 - 14) / (jw / 2), (y - ch / 2 - 14) / (jh / 2)));
    }
    geo = {
      cw, rx, ry,
      stackScale: jw / cw,
      // By the end of the deal the Jack is one card among equals: the size of a skill card,
      // or smaller if the ring needs the room.
      jackScale: Math.max(0.2, Math.min(jackScale, cw / jw)),
      pin: deck.offsetHeight - stage.offsetHeight,
      top: parseFloat(getComputedStyle(stage).top) || 0,
    };
    render();
  }

  function render() {
    frame = 0;
    if (!geo || document.body.dataset.motion !== "on") return;
    const p = clamp((geo.top - deck.getBoundingClientRect().top) / geo.pin);
    stage.style.setProperty("--p", p.toFixed(4));
    jack.style.transform =
      `rotateY(${smooth(range(p, SPIN)) * 360}deg) ` +
      `scale(${lerp(1, geo.jackScale, smooth(range(p, DEAL)))})`;

    cards.forEach((card, i) => {
      // Stagger each card's exit so they leave the Jack one after another.
      const start = DEAL[0] + (0.1 * i) / Math.max(1, n - 1);
      const b = smooth(range(p, [start, start + DEAL[1] - DEAL[0] - 0.1]));
      // Until its turn, a card waits hidden behind the Jack's face, so the Jack reads as one card.
      card.style.visibility = b > 0 ? "visible" : "hidden";
      // The Ace starts at twelve o'clock; the rest follow clockwise.
      const a = (i / n) * 2 * Math.PI + orbit + lag[i];
      const [ux, uy] = ring(a);
      const x = geo.rx * ux * b;
      const arc = Math.sin(Math.PI * b) * geo.cw * 0.6; // lift while in flight, like a dealt card
      const y = geo.ry * uy * b - arc;
      // Cards stay behind the Jack until they are clear of it, then share its flat plane. A small
      // step per card keeps overlaps steady, and a held card rises above any card passing it.
      const z = lerp(-10, i * 0.5, b * b) + (lag[i] ? 12 : 0);
      const tilt = Math.sin(Math.PI * b) * 12 * Math.sign(Math.sin(a) || 1);
      // Shrink from the Jack's size early in the flight, so the text never looms over the Jack.
      const scale = lerp(geo.stackScale, 1, 1 - (1 - b) ** 3);
      card.style.transform = `translate3d(${x}px, ${y}px, ${z}px) rotate(${tilt}deg) scale(${scale})`;
    });

    dealt = p >= DEAL[1];
    if (dealt) startOrbit();
  }

  // The orbit runs on time, not scroll. It stops off screen, in hidden tabs (rAF pauses there),
  // under reduced motion and when the visitor presses Pause.
  function tick(now) {
    if (!dealt || !inView || document.body.dataset.motion !== "on") {
      looping = false;
      last = 0;
      return;
    }
    if (last) {
      const dt = Math.min(now - last, 100) / 1000;
      const step = dt * ((2 * Math.PI) / ORBIT_SECONDS);
      orbit += step;
      cards.forEach((card, i) => {
        if (card.matches(":hover, :focus-within")) lag[i] -= step;
        else if (lag[i]) {
          // Return the short way round (wrap the angle into -π..π), then settle smoothly into the slot.
          lag[i] = Math.atan2(Math.sin(lag[i]), Math.cos(lag[i]));
          lag[i] = Math.abs(lag[i]) < 0.001 ? 0 : lag[i] * Math.exp(-dt * 2.5);
        }
      });
    }
    last = now;
    render();
    requestAnimationFrame(tick);
  }
  function startOrbit() {
    if (looping) return;
    looping = true;
    requestAnimationFrame(tick);
  }

  const queue = () => {
    if (!frame) frame = requestAnimationFrame(render);
  };
  window.addEventListener("scroll", queue, { passive: true });
  new ResizeObserver(measure).observe(table);
  new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
    queue();
  }).observe(deck);
  // Pause/Resume and the reduced-motion setting swap between the animated and static layouts.
  document.addEventListener("motionchange", () => requestAnimationFrame(measure));
}
