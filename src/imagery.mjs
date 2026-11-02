export const descriptions = {
  hero: 'AI concept: a winding forest pathway leading toward a sandstone villa',
  villa: 'AI concept: contemporary sandstone villa within a wooded landscape',
  exterior: 'AI concept: stone doorway, warm plaster and timber screens',
  interior: 'AI concept: linen bedroom opening to a leafy courtyard',
  pool: 'AI concept: a shaded pool and sandstone terrace beside the forest',
  garden: 'AI concept: a sun-dappled gravel path among trees and meadow grasses',
  dining: 'AI concept: a table set with handmade ceramics on a shaded veranda',
  evening: 'AI concept: a sandstone villa glowing softly at dusk',
  lifestyle: 'AI concept: two people walking along a woodland pathway',
  texture: 'AI concept: terracotta, stone and linen in soft sunlight'
};

export function conceptImage(name, { eager = false, sizes = '100vw', portrait = false } = {}) {
  if (!descriptions[name]) throw new Error('Unknown conceptual image: ' + name);
  if (portrait) return `<img src="assets/concepts/${name}-portrait.webp" width="640" height="800" loading="lazy" decoding="async" alt="${descriptions[name]}">`;
  return `<img src="assets/concepts/${name}-960.webp" srcset="assets/concepts/${name}-640.webp 640w, assets/concepts/${name}-960.webp 960w, assets/concepts/${name}-1600.webp 1600w" sizes="${sizes}" width="1672" height="941" ${eager ? 'fetchpriority="high" loading="eager"' : 'loading="lazy"'} decoding="async" alt="${descriptions[name]}">`;
}
export const conceptCaption = '<span class="concept-label">AI concept · not actual property photography</span>';
