// ─────────────────────────────────────────────────────────────────────────────
//  PRESET CONFIG — everything a new studio needs to change lives in this file.
//  Images: drop photos into assets-src/, map them in scripts/images.mjs, run
//  `npm run images`, then reference them here by key.
//  Colours and type weights: tokens at the top of app/globals.css.
//  All content below is demo content for a fictional practice.
// ─────────────────────────────────────────────────────────────────────────────

export type ImageKey =
  | 'stonehouse' | 'ramp' | 'screenhouse' | 'glassfacade' | 'walkway'
  | 'curves' | 'stairwall' | 'facets' | 'interior' | 'cubes' | 'stairs'
  | 'cream' | 'grid' | 'studio' | 'steps';

export const studio = {
  name: 'Halden.',
  wordmark: 'HALDEN.', // giant footer type
  fullName: 'Halden Architecture Studio',
  descriptor: 'Architecture · Interiors · Urban Design',
  founded: 2014,
  city: 'Lisbon',
  country: 'Portugal',
  offices: 'Lisbon — Copenhagen',
  address: ['Rua das Janelas Verdes 12', '1200-690 Lisbon', 'Portugal'],
  phone: '+351 210 000 000',
  phoneHref: 'tel:+351210000000',
  email: 'studio@halden.example',
  coords: '38.71° N  9.16° W',
  timeZone: 'Europe/Lisbon',
  social: [
    { label: 'Instagram', href: 'https://www.instagram.com/' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/' },
  ],
  credit: { label: 'Core Concepts Design', href: 'https://coreconcepts.design' },
};

export const nav = [
  { label: 'Projects', href: '#projects', image: 'stonehouse' as ImageKey },
  { label: 'Studio', href: '#studio', image: 'studio' as ImageKey },
  { label: 'Practice', href: '#practice', image: 'stairwall' as ImageKey },
  { label: 'Approach', href: '#approach', image: 'facets' as ImageKey },
  { label: 'Awards', href: '#recognition', image: 'curves' as ImageKey },
  { label: 'Contact', href: '#contact', image: 'ramp' as ImageKey },
];

export const hero = {
  hint: 'Scroll — from void to form',
  cta: 'View project',
};

export type Project = {
  slug: string;
  title: string[]; // display lines for the hero
  name: string;
  typology: string;
  category: string;
  region: string;
  coords?: string;
  image: ImageKey;
};

export const featured: Project[] = [
  { slug: 'stone-pavilion', title: ['Stone', 'Pavilion'], name: 'Stone Pavilion', typology: 'Architecture', category: 'Private residence', region: 'Sintra, Portugal', coords: '38.80° N  9.39° W', image: 'stonehouse' },
  { slug: 'ramp-house', title: ['Ramp', 'House'], name: 'Ramp House', typology: 'Architecture + Interiors', category: 'Cast-in-place concrete', region: 'Porto, Portugal', coords: '41.15° N  8.61° W', image: 'ramp' },
  { slug: 'screen-house', title: ['Screen', 'House'], name: 'Screen House', typology: 'Residential', category: 'Timber screen façade', region: 'Aarhus, Denmark', coords: '56.16° N  10.20° E', image: 'screenhouse' },
  { slug: 'glass-offices', title: ['Harbour', 'Offices'], name: 'Harbour Offices', typology: 'Workplace', category: 'Competition — 1st prize', region: 'Copenhagen, Denmark', coords: '55.68° N  12.57° E', image: 'glassfacade' },
  { slug: 'campus-walk', title: ['Campus', 'Walk'], name: 'Campus Walk', typology: 'Urban Design', category: 'Public realm', region: 'Braga, Portugal', coords: '41.55° N  8.42° W', image: 'walkway' },
];

export type GridProject = { name: string; location: string; typology: string; year: string; image: ImageKey };

export const selected: GridProject[] = [
  { name: 'White Blocks Housing', location: 'Lisbon, Portugal', typology: 'Housing — 48 units', year: '2023', image: 'cubes' },
  { name: 'Stair Tower', location: 'Oslo, Norway', typology: 'Retrofit', year: '2021', image: 'stairs' },
  { name: 'Cream Court', location: 'Valencia, Spain', typology: 'Mixed use', year: '2022', image: 'cream' },
  { name: 'Frame Library', location: 'Coimbra, Portugal', typology: 'Civic — competition', year: '2019', image: 'grid' },
];

export const manifesto = {
  label: ['Halden.', 'Lisbon'],
  statement: { text: 'We shape buildings around light, material and the life', em: 'within.' },
  lede:
    'An independent practice for architecture, interiors and urban design — working between Lisbon and Copenhagen on houses, workplaces and public buildings.',
  body:
    'We work slowly at the start and precisely at the end: long site studies, few materials, careful details. Every project is drawn, modelled and built with the same small team.',
  disciplines: ['Architecture', 'Interiors', 'Urban design', 'Adaptive reuse', 'Masterplanning', 'Research'],
  facts: [
    { k: 'Base', v: 'Lisbon, PT' },
    { k: 'Est.', v: '2014' },
    { k: 'Reach', v: 'Lisbon — Copenhagen' },
    { k: 'Coord.', v: '38.71° N  9.16° W' },
  ],
  listTitle: 'What we hold to',
  list: [
    { label: 'Fewer materials, used honestly', meta: '01' },
    { label: 'Daylight before lighting', meta: '02' },
    { label: 'Reuse before rebuild', meta: '03' },
    { label: 'Details drawn at 1:1', meta: '04' },
  ],
};

export const index = { label: 'Selected work', title: 'Index of', em: 'works', span: '2014 — Today' };

// Signature section: an outlined word is wiped into a solid one.
// Words must have the same number of letters; shared letters stay in place.
export const morph = {
  label: 'From void to form',
  from: 'VOID',
  to: 'FORM',
  defs: [
    { word: 'void', ipa: '/vɔɪd/', text: 'an empty space; the room before it has walls.' },
    { word: 'form', ipa: '/fɔːm/', text: 'the shape a space takes when light and material give it edges.' },
  ],
  quote: 'Architecture is the thoughtful making of spaces.',
  author: 'Louis I. Kahn',
  role: 'Architect',
};

export const pillars = [
  {
    no: '01',
    title: 'Research',
    kicker: 'Site & material studies',
    body:
      'Each project starts with weeks on site: light, wind, soil, neighbours. We test materials at full scale before they reach the drawings, so decisions are made with the hand as well as the screen.',
    meta: ['Site analysis', 'Daylight studies', 'Material tests', 'Life-cycle carbon'],
    image: 'stairwall' as ImageKey,
    caption: 'Study — light on board-marked concrete',
    tone: 'paper',
  },
  {
    no: '02',
    title: 'Design',
    kicker: 'Architecture & interiors',
    body:
      'One team from first sketch to last detail. Buildings and interiors are designed together, so structure, furniture and light read as a single idea rather than separate layers.',
    meta: ['Concept to detail', 'Interior architecture', 'Furniture', 'Lighting'],
    image: 'facets' as ImageKey,
    caption: 'Façade — folded aluminium panels',
    tone: 'stone',
  },
  {
    no: '03',
    title: 'Build',
    kicker: 'Delivery & site',
    body:
      'We stay on site until handover. Close work with engineers and makers keeps the quality of the drawings in the finished building — and keeps budgets honest.',
    meta: ['Construction supervision', 'Cost planning', 'Specialist makers', 'Post-occupancy'],
    image: 'interior' as ImageKey,
    caption: 'Interior — completed residence',
    tone: 'sand',
  },
];

export const layersCopy = { label: 'Approach', title: 'Architecture is', em: 'a sequence.', caption: 'Fig. 06 — A building read in layers. Top plane: Screen House, Aarhus.', topImage: 'screenhouse' as ImageKey };

export const layers = [
  { no: '01', name: 'Site', note: 'Ground, orientation, the path of the sun.' },
  { no: '02', name: 'Context', note: 'Streets, neighbours and the lines already there.' },
  { no: '03', name: 'Climate', note: 'Wind, water and shade as design materials.' },
  { no: '04', name: 'People', note: 'How the building will be walked, used and shared.' },
  { no: '05', name: 'Structure', note: 'The fewest elements that carry the idea.' },
  { no: '06', name: 'Form', note: 'Space given edges, light and meaning.' },
];

export const honorsCopy = {
  title: 'Awards &',
  em: 'press',
  intro: 'Prizes, publications and exhibitions — shown here as demo content for the preset.',
};

export const honors = [
  { year: '2025', event: 'National Architecture Award', detail: 'Residential — winner', location: 'Lisbon, Portugal', type: 'Award' },
  { year: '2025', event: 'Atlantic Architecture Forum', detail: 'Exhibited — “Material Futures”', location: 'Lisbon, Portugal', type: 'Exhibition' },
  { year: '2024', event: 'Nordic Housing Prize', detail: 'Screen House — shortlist', location: 'Copenhagen, Denmark', type: 'Shortlist' },
  { year: '2023', event: 'Harbour Offices Competition', detail: 'First prize', location: 'Copenhagen, Denmark', type: 'Competition' },
  { year: '2023', event: 'Material Journal', detail: 'Feature — Ramp House', location: 'London, UK', type: 'Press' },
  { year: '2022', event: 'Iberian Design Awards', detail: 'Interiors — gold', location: 'Madrid, Spain', type: 'Award' },
  { year: '2021', event: 'Young Practices Lecture Series', detail: 'Invited lecture', location: 'Porto, Portugal', type: 'Lecture' },
  { year: '2019', event: 'Frame Library Competition', detail: 'Honourable mention', location: 'Coimbra, Portugal', type: 'Competition' },
];

export const interlude = {
  image: 'curves' as ImageKey,
  alt: 'Curving white balconies against the sky',
  words: ['Architecture /', 'Interiors /', 'Urban design'],
  caption: 'Detail — balcony bands, study',
};

export const gridCopy = {
  label: 'Archive',
  title: ['Built, drawn', '& '],
  em: 'imagined',
  drift: 'Void — Form — Void — Form',
  text: 'From a stair retrofit to a civic library: the same method at every scale — read the site, then make the fewest precise moves.',
  cta: 'All projects',
};

// Clients render as typographic wordmarks — swap for logo files if preferred.
export const clientsCopy = {
  label: 'Clients / Collaborators',
  statement: 'Developers, public bodies, hoteliers and private clients — buildings are made together.',
};
export const clients: { name: string; style: 'sans' | 'serif' | 'mono' | 'caps' }[] = [
  { name: 'Aster Hotels', style: 'serif' },
  { name: 'MERIDIAN HOUSING', style: 'caps' },
  { name: 'Kiln & Co.', style: 'sans' },
  { name: 'tessel/dev', style: 'mono' },
  { name: 'Oaken Group', style: 'serif' },
  { name: 'LUMEN', style: 'caps' },
  { name: 'Harbour Arts Trust', style: 'sans' },
  { name: 'fjell.capital', style: 'mono' },
  { name: 'Sable', style: 'serif' },
  { name: 'PARALLEL SCHOOLS', style: 'caps' },
  { name: 'Stone & Salt', style: 'sans' },
];

export const studioCopy = {
  label: 'The studio',
  city: ['Lisbon /', 'Copenhagen'],
  disc: ['Architecture', 'interiors'],
  discEm: '+ urban design',
  image: 'studio' as ImageKey,
  imageAlt: 'Living space with floor-to-ceiling glazing opening to a garden',
  lede:
    'A studio of fourteen architects and designers. Small enough that the partners draw on every project; experienced enough to deliver public buildings.',
  facts: [
    { k: 'Established', v: '2014' },
    { k: 'Offices', v: 'Lisbon · Copenhagen' },
    { k: 'Team', v: '14 people' },
    { k: 'Scale', v: '60 m² — 12,000 m²' },
  ],
  team: [
    { name: 'Inês Halden', role: 'Founding Partner' },
    { name: 'Mads Vey', role: 'Partner, Copenhagen' },
    { name: 'Rita Sousa', role: 'Associate, Interiors' },
  ],
  cta: 'Discover the studio',
};

export const footerCopy = {
  line1: 'Every building',
  line2: 'starts as a',
  em: 'conversation.',
};
