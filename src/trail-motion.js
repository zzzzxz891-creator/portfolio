// Fitted from the supplied 30fps recording: progressive reveal, brief crest,
// then a short exit. Approximate timing, not access to the template's source.
export const MOTION = Object.freeze({
  grow: 550,
  hold: 50,
  shrink: 230,
  duration: 830,
  maxItems: 28,
  aspect: .8,
});

// Reference centres are approximately half a full-size tile apart.
export const stampSpacing = cardWidth => cardWidth * .5;

export function scaleAt(age) {
  if (age <= 0 || age >= MOTION.duration) return 0;
  if (age < MOTION.grow) return 1 - (1 - age / MOTION.grow) ** 2;
  if (age < MOTION.grow + MOTION.hold) return 1;
  return (1 - (age - MOTION.grow - MOTION.hold) / MOTION.shrink) ** 2.5;
}

// Resample actual input segments at a stable arc-length interval. Preserve
// event time as well as position, including when several samples land in one
// render frame. This avoids both skipped fast strokes and same-age backfill.
export function sampleSegment(from, to, carried, spacing) {
  const length = Math.hypot(to.x - from.x, to.y - from.y);
  if (!length) return { samples: [], carried };
  const samples = [];
  for (let travelled = spacing - carried; travelled <= length; travelled += spacing) {
    const t = travelled / length;
    samples.push({
      x: from.x + (to.x - from.x) * t,
      y: from.y + (to.y - from.y) * t,
      at: from.at + (to.at - from.at) * t,
    });
  }
  return { samples, carried: (carried + length) % spacing };
}
