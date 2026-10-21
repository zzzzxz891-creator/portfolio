import { assetData } from './site-paths.js';
export const projects = assetData([
  {
    id: 'travel', title: 'Travel, reconsidered', subtitle: 'AI travel planning · Personal project',
    image: '/assets/projects/paths/01-1600.webp?v=e81cf1ded2cf', imageAlt: 'Cover of the Paths travel redesign case study', href: '/#work',
    date: 'Aug — Sep 2026', role: 'Interaction & experience design',
    introduction: 'Making AI-assisted travel planning easier to understand, adjust, and revisit.',
    details: [
      'Reorganised the core journeys for creating, adjusting, and reviewing a trip, with clearer entry points and information hierarchy.',
      'Designed distinct home states for no plan, one plan, and multiple plans, including access to past itineraries.',
      'Explored change summaries, route previews, and place locking so people can understand AI suggestions and keep control of their plans.',
    ],
  },
  {
    id: 'flow', title: 'FLOW', subtitle: 'Emotion & interaction · Course project',
    image: '/assets/projects/flow/01.png', imageAlt: 'Cover of the FLOW case study', href: '/works/flow',
    date: 'Dec 2025 — Jan 2026', role: 'Experience design & motion prototyping',
    introduction: 'Translating ideas from Chinese aesthetics into an experience for recording and sharing emotions.',
    details: [
      'Collaborated on research and the product concept, then developed the functional structure, core flows, and interface proposals.',
      'Designed the core interactions and motion prototypes, using form, colour, and transitions to express emotional change and feedback.',
      'Built interactive demonstrations in Figma Prototype and Figma Make to turn an abstract concept into a tangible experience.',
    ],
  },
  {
    id: 'ideation', title: 'IdeationArch', subtitle: 'AI-assisted architecture · Research project',
    image: '/assets/covers/ideation-cover.webp', imageAlt: 'Illustrative cover: calm mobile interface photographed on stone',
    date: 'Apr — Aug 2026', role: 'System interface design & research support',
    introduction: 'An interface for exploring, reviewing, and editing AI-assisted architectural ideas.',
    details: [
      'Designed the complete system interface, arranging tools and workflows for concept exploration, generated results, and editing.',
      'Translated the research proposal into interface designs for user experiments, and helped conduct sessions and organise information.',
      'Created selected paper figures to communicate system interactions. The related paper was submitted to CHI 2027; third author, under review as stated in my résumé.',
    ],
  },
  {
    id: 'agents', title: 'Curatorial agents', subtitle: 'Multi-agent workflows · Practice project',
    image: '/assets/covers/agents-cover.webp', imageAlt: 'Illustrative cover: ultramarine editorial publication',
    date: 'Nov 2025 — Jan 2026', role: 'Workflow design & teaching content',
    introduction: 'Connecting specialist AI agents into an end-to-end exhibition-planning demonstration.',
    details: [
      'Independently built five Coze workflows for planning, copywriting, visual design, exhibits, and spatial planning, including role prompts and input/output variables.',
      'Combined sequential, parallel, and iterative orchestration into a complete demonstration, from a curatorial brief to a generated proposal.',
      'Produced scripts, illustrations, and operation videos for seven lessons in the sixth module of a faculty-led online course.',
    ],
  },
]);
