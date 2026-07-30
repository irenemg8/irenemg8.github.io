// The CV that the hologram projector beams out, one page per "sheet".
//
// Content is data, not layout: `cvPage.js` knows how to draw each block kind, so
// editing the CV here never means touching the drawing code. Block kinds:
//   { kind: 'lead',  text }                        — an opening paragraph
//   { kind: 'entry', role, org, meta, bullets[] }  — a job / degree / project
//   { kind: 'row',   label, value }                — a label + a list
//   { kind: 'note',  text }                        — a bracketed aside
//   { kind: 'stats', items: [{ value, label }] }   — a row of headline numbers
//   { kind: 'timeline', caption, now, items: [{ label, from, to }] }
//         a Gantt of real date ranges. from/to are decimal years — M(2025, 10)
//         is Oct 2025. `to: null` means still going.
//   { kind: 'bars',  caption, note, items: [{ label, value, display }] }
//   { kind: 'levels', caption, items: [{ label, level 1-6, caption }] }  — CEFR
//   { kind: 'meters', caption, note, items: [{ label, value 0-100 }] }
//   { kind: 'chips', caption, groups: [{ label, items: [string | {name, core}] }] }
//
// Written in English to match the rest of the gallery. Sourced from Irene's
// LinkedIn profile (July 2026) and her April 2026 LaTeX CV.
//
// The gallery's diorama boxes already tell the long version of all this, so the
// CV stays short and scannable — it's the formal artefact, not the story.

export const CV_NAME = 'Irene Medina García'
export const CV_ROLE = 'Researcher in AI for Education · Interactive Technologies'
export const CV_SITE = 'irenemg8.github.io'
export const CV_PHOTO = 'photos/irene_cv.webp'

// Decimal years, so a date reads the same here as it does on the timeline.
const M = (year, month) => year + (month - 1) / 12

export const CV_PAGES = [
  {
    title: 'Profile',
    cover: true,
    contact: [
      ['Based in', 'Yecla, Murcia · open to Valencia'],
      ['Email', 'irenebati4@gmail.com'],
      ['LinkedIn', 'in/irene-medina-garcia'],
      ['GitHub', 'github.com/irenemg8'],
      ['Portfolio', 'irenemg8.github.io'],
    ],
    blocks: [
      {
        kind: 'lead',
        text:
          'Researcher in artificial intelligence applied to interactive systems — Large Language Models, agentic architectures, and the empirical evaluation of technology-enhanced learning. Starting the Master’s in Audiovisual Technologies (MUTAV) at ETSIT-UPV, heading for doctoral research in the UPV Telecommunications PhD programme.',
      },
      {
        kind: 'stats',
        items: [
          { value: '10/10', label: 'Thesis, Highest Honours' },
          { value: '2', label: 'Papers (TAEE · IEEE)' },
          { value: '6', label: 'Awards & distinctions' },
          { value: '8', label: 'Roles since 2023' },
        ],
      },
      {
        kind: 'bars',
        caption: 'Areas I work in',
        note: 'Of the 8 roles and 8 projects on this CV, how many involved each area.',
        items: [
          { label: 'UX / UI design', value: 11 },
          { label: 'AI · LLMs · vision', value: 6 },
          { label: 'Web & frontend', value: 6 },
          { label: '3D · AR / VR', value: 4 },
          { label: 'Robotics & IoT', value: 4 },
          { label: 'Research & evaluation', value: 3 },
          { label: 'Branding', value: 2 },
        ],
      },
    ],
  },
  {
    title: 'Career at a glance',
    blocks: [
      // Both timelines are pinned to the same 2022–2028 scale, so a bar means the
      // same span whichever chart it's on.
      {
        kind: 'timeline',
        caption: 'Roles',
        from: 2022,
        to: 2028,
        now: 2026.6,
        items: [
          { label: 'Centromat — web', from: M(2023, 2), to: M(2023, 6) },
          { label: 'Talpa Tunneling UPV', from: M(2025, 4), to: M(2026, 6) },
          { label: 'GOMARCO — Scrum Master', from: M(2025, 4), to: M(2025, 7) },
          { label: 'Beetrics — UX & branding', from: M(2025, 7), to: M(2025, 9) },
          { label: 'Zyndra — co-founder', from: M(2025, 9), to: M(2026, 6) },
          { label: 'Hyperloop UPV — H11', from: M(2025, 9), to: M(2025, 12) },
          { label: 'UPV — Learning Assistant', from: M(2025, 9), to: M(2026, 5) },
          { label: 'strambótica — UX & AR', from: M(2025, 10), to: M(2026, 1) },
        ],
      },
      {
        kind: 'timeline',
        caption: 'Studies',
        from: 2022,
        to: 2028,
        now: 2027,
        items: [
          { label: 'BSc Interactive Technologies', from: M(2022, 9), to: M(2026, 6) },
          { label: 'Erasmus+ BIP — Warsaw', from: M(2025, 7), to: M(2025, 8) },
          { label: 'MSc Audiovisual Technologies', from: M(2026, 9), to: M(2027, 7) },
        ],
      },
      {
        kind: 'chips',
        caption: 'What I work on',
        groups: [
          {
            label: '',
            items: [
              { name: 'Educational research', core: true },
              { name: 'LLMs & agentic RAG', core: true },
              { name: 'AR / VR', core: true },
              { name: 'UX design', core: true },
              'Computer vision',
              'Robotics interfaces',
              'Real-time 3D',
              'Accessibility',
            ],
          },
        ],
      },
      {
        kind: 'note',
        text: 'Open to roles in Valencia — on-site, hybrid or remote.',
      },
    ],
  },
  {
    title: 'Research',
    blocks: [
      {
        kind: 'entry',
        role: 'Bachelor’s thesis — Agentic RAG for a Socratic virtual tutor',
        org: 'Universitat Politècnica de València · 10/10, Highest Honours',
        meta: 'Jul 2026',
        bullets: [
          '“Design, implementation and evaluation of a Socratic virtual tutor based on LLM architectures with Retrieval-Augmented Generation to overcome alternative conceptions about Ohm’s Law.”',
          'A chain of ten specialised agents combining hybrid retrieval, a knowledge graph of the course concepts, dynamic classification of alternative conceptions, and pedagogical guardrails that protect the Socratic role.',
          'Benchmarked against a base model, PEFT/LoRA and In-Context Learning on both latency and retrieval accuracy, and on Socraticity, conceptual accuracy and adaptability — scored automatically and by specialist teaching staff.',
          'Deployed entirely on UPV infrastructure, so no student data ever leaves the university network.',
        ],
      },
      {
        kind: 'entry',
        role: '“Benchmarking LLM-based Socratic tutors for conceptual understanding of Ohm’s Law”',
        org: 'TAEE 2026 — XVII Congreso de Tecnología, Aprendizaje y Enseñanza de la Electrónica',
        meta: 'Jun 2026',
        bullets: [
          'Best Poster award. With Á. Esteban Pérez, Mª A. Pérez Pascual and Mª J. Canet Subiela.',
        ],
      },
      {
        kind: 'entry',
        role: 'Second manuscript in preparation',
        org: 'IEEE Access',
        meta: 'In progress',
        bullets: ['Building on the contributions of the bachelor’s thesis.'],
      },
      {
        kind: 'chips',
        caption: 'Research interests',
        groups: [
          {
            label: '',
            items: [
              { name: 'Agentic RAG', core: true },
              { name: 'LLMs in education', core: true },
              { name: 'Intelligent tutoring systems', core: true },
              'Knowledge graphs',
              'Empirical evaluation',
              'Alternative conceptions',
              'Data sovereignty',
            ],
          },
        ],
      },
    ],
  },
  {
    title: 'Experience — I',
    blocks: [
      {
        kind: 'entry',
        role: 'Learning Assistant',
        org: 'Universitat Politècnica de València — internship contract',
        meta: 'Sept 2025 – May 2026',
        bullets: [
          'Researched and built an LLM-based conversational tutor, deployed as course material for Basic Electronics.',
          'Designed and implemented an Agentic RAG architecture that guides students by questioning rather than answering.',
          'Built the knowledge base and retrieval pipeline, and defined an evaluation protocol measuring conceptual gain rather than user satisfaction.',
          'Ran the empirical evaluation with engineering students and analysed the results.',
        ],
      },
      {
        kind: 'entry',
        role: 'Co-founder & Project Coordinator',
        org: 'Zyndra — Generación Espontánea UPV · Gandía',
        meta: 'Sept 2025 – Jun 2026',
        bullets: [
          'Co-founded a student research group building an AI-powered robotic guide dog for blind and visually impaired people — autonomous navigation, computer vision and AI decision-making for safe urban operation.',
          'Coordinated a multidisciplinary team of 20 students across engineering, design and communication.',
          'Led the human–robot interaction model from accessibility requirements gathered with real users.',
          'Directed design, partnerships and communications, securing institutional collaborations.',
        ],
      },
      {
        kind: 'entry',
        role: 'Automation Specialist',
        org: 'Talpa Tunneling UPV — Not-A-Boring Competition · Valencia / Texas',
        meta: 'Apr 2025 – Jun 2026',
        bullets: [
          'Built the operator dashboard that controls a micro-tunnel boring machine and monitors its telemetry in real time, from interface prototype through to production code.',
          'Designed it around the operator’s decision-making under time and safety pressure, favouring legibility of critical data over visual density.',
          'Designed and developed the team’s website end to end, from information architecture to deployment.',
        ],
      },
    ],
  },
  {
    title: 'Experience — II',
    blocks: [
      {
        kind: 'entry',
        role: 'UX Designer & AR Developer',
        org: 'strambótica — freelance · Remote',
        meta: 'Oct 2025 – Jan 2026',
        bullets: [
          'End-to-end design and frontend development of an e-commerce platform.',
          'Marker-based AR app for interactive product viewing at trade fairs.',
        ],
      },
      {
        kind: 'entry',
        role: 'UX Designer',
        org: 'Hyperloop UPV — H11 · Valencia',
        meta: 'Sept – Dec 2025',
        bullets: [
          'Audited and redesigned the team’s website — user flows, layout and visual hierarchy — and handed the designs over for implementation.',
        ],
      },
      {
        kind: 'entry',
        role: 'Scrum Master & Software Developer',
        org: 'GOMARCO — internship contract · Yecla',
        meta: 'Apr – Jul 2025',
        bullets: [
          'Ran planning, review and retrospective ceremonies for the IT department, coordinating workload with Scrum and Trello.',
          'Automated internal processes and built desktop applications for internal use.',
        ],
      },
      {
        kind: 'entry',
        role: 'UX/UI & Branding Designer',
        org: 'Beetrics — freelance · Remote',
        meta: 'Jul – Sept 2025',
        bullets: ['Visual identity, web prototyping and an internal dashboard for staff management.'],
      },
      {
        kind: 'entry',
        role: 'Web Designer & Developer',
        org: 'Centromat — freelance · Remote',
        meta: 'Feb – Jun 2023',
        bullets: [
          'Corporate site with a full catalogue, plus an automated task board assigning jobs by availability and speciality.',
          'Result: +3,500 platform visits, calls and sales within six months.',
        ],
      },
    ],
  },
  {
    title: 'Education & Languages',
    blocks: [
      {
        kind: 'entry',
        role: 'BSc in Interactive Technologies',
        org: 'Universitat Politècnica de València — Campus de Gandia',
        meta: 'Sept 2022 – Jun 2026',
        bullets: [
          'Completed within the High Academic Performance Programme (Mención ARA).',
          'Bachelor’s thesis: 10/10 with Highest Honours (Matrícula de Honor).',
        ],
      },
      {
        kind: 'entry',
        role: 'MSc in Audiovisual Technologies (MUTAV)',
        org: 'UPV — ETSIT · founding cohort',
        meta: '2026 – 2027',
        bullets: ['Part of the programme’s very first intake, heading toward doctoral research.'],
      },
      {
        kind: 'entry',
        role: 'Erasmus+ BIP — ENHANCE Summer School “Green Campus 2.0”',
        org: 'Warsaw University of Technology, with UPV and RWTH Aachen',
        meta: 'Jul 2025',
        bullets: [
          'Selected among 21 students from 8 universities across 7 countries.',
          'Interdisciplinary work on nature-based solutions for sustainable campus design: expert lectures, field visits, team prototyping and solution testing.',
        ],
      },
      {
        kind: 'levels',
        caption: 'Languages · CEFR',
        items: [
          { label: 'Spanish', level: 6, caption: 'Native' },
          { label: 'English', level: 4, caption: 'B2 — EOI | OUP' },
        ],
      },
    ],
  },
  {
    title: 'Projects — I',
    blocks: [
      {
        kind: 'entry',
        role: 'Zyndra — VR, AR & 3D for accessibility',
        org: 'Unity · Meta Quest · Vuforia · Blender · Substance 3D',
        meta: 'Sept 2025 – Jan 2026',
        bullets: [
          'A first-person VR blindness simulation set in a supermarket, an AR app that turns a paper map into 3D landmarks and routes, and a 3D animated trailer — modelling, animation and texturing throughout.',
        ],
      },
      {
        kind: 'entry',
        role: 'AidGuide — robotic guide dog',
        org: 'ROS2 · Computer Vision · RViz · Gazebo · Figma',
        meta: '2025',
        bullets: [
          'Adaptive pathfinding with automatic re-routing, plus object, text (OCR) and shape recognition in urban settings.',
        ],
      },
      {
        kind: 'entry',
        role: 'Aura — Zero-UI assistant',
        org: 'Computer vision · NLP · speech-to-text',
        meta: '2025',
        bullets: [
          'A voice assistant for blind users that reads the street in real time — no screen, no extra hardware. 2nd prize, Smart City Challenge.',
        ],
      },
      {
        kind: 'entry',
        role: 'URBANVIVE — sustainable paving',
        org: 'Permeable paving with a beneficial microbiota',
        meta: 'May – Nov 2025',
        bullets: [
          'Soil layers, materials and substrates, irrigation sensors and drainage for flood-prone urban areas. Aligned with the UN 2030 Agenda.',
        ],
      },
    ],
  },
  {
    title: 'Projects — II',
    blocks: [
      {
        kind: 'entry',
        role: '3D Portfolio',
        org: 'Three.js · WebGL · Blender · Mixamo',
        meta: '2026',
        bullets: ['An explorable 3D web portfolio — the one you’re standing in.'],
      },
      {
        kind: 'entry',
        role: 'NeuroSpot — ADHD platform',
        org: 'Figma · Next.js · AWS',
        meta: '2024',
        bullets: ['Gamified cross-platform pre-screening for early signs of ADHD in children.'],
      },
      {
        kind: 'entry',
        role: 'VIMYP · EcoCity — environmental IoT',
        org: 'React · Android · Firebase · ESP-IDF',
        meta: '2023 – 2024',
        bullets: ['Air-quality keyrings and smart streetlight control, with 3D-printed sensor housings.'],
      },
      {
        kind: 'entry',
        role: 'Yummy Fish · Othello · PyCatan · Blackjack',
        org: 'Unity · Blender · 3ds Max · Substance 3D',
        meta: '2024',
        bullets: ['Four games built end to end: interfaces, mechanics and player experience.'],
      },
    ],
  },
  {
    title: 'Awards & distinctions',
    blocks: [
      {
        kind: 'entry',
        role: 'Highest Honours — Bachelor’s thesis (10/10)',
        org: 'Universitat Politècnica de València',
        meta: 'Jul 2026',
        bullets: [],
      },
      {
        kind: 'entry',
        role: 'Best Poster Award — TAEE 2026',
        org: 'XVII Congreso de Tecnología, Aprendizaje y Enseñanza de la Electrónica',
        meta: 'Jun 2026',
        bullets: [],
      },
      {
        kind: 'entry',
        role: 'Mención ARA — High Academic Performance Programme',
        org: 'UPV · recorded on the European Diploma Supplement',
        meta: '2022 – 2026',
        bullets: [],
      },
      {
        kind: 'entry',
        role: '1st prize — Campus Salud Gandía, 3rd edition',
        org: 'Digital-health hackathon, with URBANVIVE',
        meta: 'May 2025',
        bullets: [
          'Chosen as the winning project to represent the UPV at the International Congress on Technological Innovation, Guangzhou 2025.',
          'Selected for the local round of “Innovative Company of Gandía 2025” and the VII Innpulso Emprende, Gijón.',
        ],
      },
      {
        kind: 'entry',
        role: '2nd prize — Smart City Challenge 2025',
        org: 'VRAIN · Cátedra ENIA · Cátedra Telefónica, with Aura',
        meta: 'Jun 2025',
        bullets: [],
      },
      {
        kind: 'entry',
        role: 'Semifinalist — eMobility Hackathon',
        org: 'Las Naves, Valencia',
        meta: 'Sept 2023',
        bullets: [],
      },
    ],
  },
  {
    title: 'Toolbox',
    blocks: [
      {
        kind: 'meters',
        caption: 'How much I reach for each',
        note: 'Self-assessed — my own read on how often and how deeply I use each tool.',
        items: [
          { label: 'Figma', value: 95 },
          { label: 'Python · LLM tooling', value: 85 },
          { label: 'Blender', value: 85 },
          { label: 'Three.js · WebGL', value: 80 },
          { label: 'React · Next.js', value: 80 },
          { label: 'Unity · C#', value: 75 },
          { label: 'Substance 3D', value: 65 },
          { label: 'ROS2', value: 55 },
        ],
      },
      {
        kind: 'chips',
        caption: 'Everything else in the bag',
        groups: [
          {
            label: 'AI & research',
            items: ['LangGraph', 'Ollama', 'RAG', 'Knowledge graphs', 'PEFT/LoRA', 'OpenCV', 'MATLAB'],
          },
          {
            label: 'Code',
            items: ['C++', 'C#', 'Java', 'Python', 'JavaScript', 'TypeScript', 'HTML/CSS', 'CLIPS'],
          },
          {
            label: 'Design & 3D',
            items: ['Figma', 'Axure', 'Blender', '3ds Max', 'Substance 3D', 'Photoshop', 'Illustrator'],
          },
          {
            label: 'AR/VR & robotics',
            items: ['Unity', 'Meta Quest', 'Vuforia', 'Three.js', 'WebGL', 'ROS2', 'RViz', 'Gazebo'],
          },
          {
            label: 'CAD & prototyping',
            items: ['AutoCAD', 'SketchUp', 'Fritzing', 'LTSpice', 'PrusaSlicer', 'Arduino', 'ESP-IDF'],
          },
          {
            label: 'Ways of working',
            items: ['CDIO', 'Scrum', 'Trello', 'Git/GitHub', 'Statgraphics'],
          },
        ],
      },
    ],
  },
  {
    title: 'Certifications',
    blocks: [
      {
        kind: 'entry',
        role: 'Agentic AI — Private Agentic RAG with LangGraph and Ollama',
        org: 'Udemy',
        meta: 'Apr 2026',
        bullets: [],
      },
      { kind: 'entry', role: 'AutoCAD 2D for Engineering', org: 'CFP — UPV', meta: 'Feb 2026', bullets: [] },
      { kind: 'entry', role: 'Three.js Journey', org: 'Three.js Journey', meta: 'Dec 2025', bullets: [] },
      { kind: 'entry', role: 'Advanced User Experience (UX)', org: 'LinkedIn Learning', meta: 'Mar 2025', bullets: [] },
      { kind: 'entry', role: 'UX & accessibility in video games', org: 'LinkedIn Learning', meta: 'Mar 2025', bullets: [] },
      { kind: 'entry', role: 'Figma for UI Design', org: 'ESAT Online', meta: 'Feb 2024', bullets: [] },
      {
        kind: 'note',
        text: '17 certifications in total — the full list is on LinkedIn.',
      },
    ],
  },
]
