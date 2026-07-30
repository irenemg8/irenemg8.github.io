// The CV that the hologram projector beams out, one page per "sheet".
//
// Four pages, because nobody reads eleven. The way it stays at four is the
// `columns` block: two stacks side by side hold about twice what one does, so
// the pages are dense without the type getting any smaller.
//
// Content is data, not layout — `cvPage.js` knows how to draw each block kind,
// so editing the CV never means touching the drawing code. Block kinds:
//   { kind: 'lead',  text }                        — an opening paragraph
//   { kind: 'entry', role, org, meta, bullets[] }  — a full entry with bullets
//   { kind: 'cards', caption, cols, items: [{ title, org, meta, text }] }
//   { kind: 'stats', items: [{ value, label }] }   — a row of headline numbers
//   { kind: 'timeline', caption, from, to, now, items: [{ label, from, to }] }
//         a Gantt of real date ranges. from/to are decimal years — M(2025, 10)
//         is Oct 2025. `to: null` means still going.
//   { kind: 'spine', caption, items: [{ title, org, meta }] }  — milestone dots
//   { kind: 'bars',  caption, note, items: [{ label, value, display }] }
//   { kind: 'levels', caption, items: [{ label, level 1-6, caption }] }  — CEFR
//   { kind: 'meters', caption, note, items: [{ label, value 0-100 }] }
//   { kind: 'chips', caption, groups: [{ label, items: [string | {name, core}] }] }
//   { kind: 'columns', ratio, left: [blocks], right: [blocks] }
//   { kind: 'row' / 'note' }                       — label + value / an aside
//
// Written in English to match the rest of the gallery. Sourced from Irene's
// LinkedIn profile (July 2026) and her April 2026 LaTeX CV.
//
// The gallery's diorama boxes already tell the long version of all this, so the
// CV stays short and scannable — it's the formal artefact, not the story.

export const CV_NAME = 'Irene Medina García'
export const CV_ROLE = 'Aspiring PhD in Telecommunications · Researcher in AI for Education'
export const CV_SITE = 'irenemg8.github.io'
export const CV_PHOTO = 'photos/irene_cv.webp'

// Decimal years, so a date reads the same here as it does on the timeline.
const M = (year, month) => year + (month - 1) / 12

export const CV_PAGES = [
  // ---------------------------------------------------------------- 1. who
  {
    title: 'Profile',
    cover: true,
    contact: [
      ['Based in', 'Valencia'],
      ['GitHub', 'https://github.com/irenemg8'],
      ['LinkedIn', 'https://www.linkedin.com/in/irene-medina-garcia/'],
    ],
    blocks: [
      {
        kind: 'lead',
        text:
          'Researcher in AI for education, interactive systems, agentic architectures, and the empirical evaluation of technology-enhanced learning. Starting the Master’s in Audiovisual Technologies (MUTAV) at ETSIT-UPV, heading for doctoral research in the UPV Telecommunications PhD programme.',
      },
      {
        kind: 'stats',
        items: [
          { value: '10/10', label: 'BSc Thesis, Highest Honours' },
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
      {
        kind: 'columns',
        ratio: 0.46,
        left: [
          {
            kind: 'levels',
            caption: 'Languages',
            items: [
              { label: 'Spanish', level: 6, caption: 'Native' },
              { label: 'English', level: 4, caption: 'B2 — EOI | OUP' },
            ],
          },
        ],
        right: [
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
                  'Robotics',
                  'Real-time 3D',
                  'Accessibility',
                ],
              },
            ],
          },
        ],
      },
      {
        kind: 'note',
        text: 'Open to research and product roles in Valencia — on-site, hybrid or remote.',
      },
    ],
  },

  // ------------------------------------------------------------- 2. career
  {
    title: 'Career',
    blocks: [
      {
        kind: 'cards',
        items: [
          {
            title: 'Learning Assistant',
            meta: '2025 – 26',
            org: 'UPV — internship contract',
            text: 'An LLM tutor deployed as course material for Basic Electronics. Designed the Agentic RAG that guides by questioning rather than answering, built its knowledge base and retrieval pipeline, and ran the evaluation with engineering students — measuring conceptual gain rather than satisfaction.',
          },
          {
            title: 'Co-founder & Coordinator',
            meta: '2025 – 26',
            org: 'Zyndra — Generación Espontánea UPV',
            text: 'Co-founded a student research group building an AI robotic guide dog for blind users: autonomous navigation, computer vision and safe decision-making on the street. Coordinated 20 students across engineering, design and communication, and led the human–robot interaction model from requirements gathered with real users.',
          },
          {
            title: 'Automation Specialist',
            meta: '2025 – 26',
            org: 'Talpa Tunneling UPV · Not-A-Boring Competition',
            text: 'Built the operator dashboard that drives a micro-tunnel boring machine and reads its telemetry live, from prototype through to production code — designed around the operator’s decisions under time and safety pressure. Also the team’s website, end to end.',
          },
          {
            title: 'UX Designer & AR Developer',
            meta: '2025 – 26',
            org: 'strambótica — freelance',
            text: 'End-to-end design and frontend of an e-commerce platform, plus a marker-based AR app that lets buyers view products interactively at trade fairs — built to improve engagement on the stand.',
          },
          {
            title: 'UX Designer',
            meta: '2025',
            org: 'Hyperloop UPV — H11',
            text: 'Audited the team’s existing site and redesigned its interfaces — user flows, layout and visual hierarchy — grounded in benchmarking against other competition teams, then handed the designs over for implementation.',
          },
          {
            title: 'Scrum Master & Developer',
            meta: '2025',
            org: 'GOMARCO — internship contract',
            text: 'Ran planning, review and retrospective ceremonies for the IT department and coordinated its workload with Scrum and Trello. Automated internal processes and built desktop applications for internal use.',
          },
          {
            title: 'UX/UI & Branding Designer',
            meta: '2025',
            org: 'Beetrics — freelance',
            text: 'Brand visual identity from scratch, web prototyping, and an internal dashboard for managing staff.',
          },
          {
            title: 'Web Designer & Developer',
            meta: '2023',
            org: 'Centromat — freelance',
            text: 'Corporate website with a full product and services catalogue, plus a task board that assigns each job to the right worker by availability and speciality. Result: +3,500 platform visits, calls and sales within six months.',
          },
        ],
      },
    ],
  },

  // --------------------------------------------------- 3. research & study
  {
    title: 'Research, study & recognition',
    blocks: [
      {
        kind: 'entry',
        role: 'Agentic RAG for a Socratic virtual tutor',
        org: 'Bachelor’s thesis · UPV · 10/10, Highest Honours',
        meta: 'Jul 2026',
        bullets: [
          'A chain of ten specialised agents combining hybrid retrieval, a knowledge graph of the course concepts, dynamic classification of alternative conceptions about Ohm’s Law, and pedagogical guardrails that protect the Socratic role.',
          'Benchmarked against a base model, PEFT/LoRA and In-Context Learning on latency and retrieval accuracy, and on Socraticity, conceptual accuracy and adaptability — scored automatically and by specialist teaching staff.',
          'Deployed entirely on UPV infrastructure, so no student data ever leaves the university network.',
        ],
      },
      {
        kind: 'columns',
        ratio: 0.52,
        left: [
          {
            kind: 'cards',
            caption: 'Publications',
            cols: 1,
            items: [
              {
                title: 'Benchmarking LLM-based Socratic tutors',
                meta: '2026',
                org: 'TAEE 2026 — Best Poster award',
                text: 'With Á. Esteban Pérez, Mª A. Pérez Pascual and Mª J. Canet Subiela.',
              },
              {
                title: 'Second manuscript',
                meta: 'In progress',
                org: 'IEEE Access — building on the thesis',
              },
            ],
          },
          {
            kind: 'cards',
            caption: 'Education',
            cols: 1,
            items: [
              {
                title: 'MSc Audiovisual Technologies',
                meta: '2026 – 27',
                org: 'UPV — ETSIT · founding cohort',
              },
              {
                title: 'BSc Interactive Technologies',
                meta: '2022 – 26',
                org: 'UPV — Campus de Gandia · Mención ARA',
              },
              {
                title: 'Erasmus+ BIP — Green Campus 2.0',
                meta: '2025',
                org: 'Warsaw University of Technology',
                text: '21 students, 8 universities, 7 countries.',
              },
            ],
          },
        ],
        right: [
          {
            kind: 'spine',
            caption: 'Awards & distinctions',
            items: [
              { title: 'Highest Honours — thesis, 10/10', meta: 'Jul 2026', org: 'UPV' },
              { title: 'Best Poster Award', meta: 'Jun 2026', org: 'TAEE 2026' },
              { title: 'Mención ARA', meta: '2022 – 26', org: 'High Academic Performance, UPV' },
              { title: '1st prize — Campus Salud Gandía', meta: 'May 2025', org: 'With URBANVIVE · Guangzhou 2025 · Innpulso VII' },
              { title: '2nd prize — Smart City Challenge', meta: 'Jun 2025', org: 'VRAIN · Cátedra ENIA · Telefónica' },
              { title: 'Semifinalist — eMobility Hackathon', meta: 'Sept 2023', org: 'Las Naves, Valencia' },
            ],
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
                  'Tutoring systems',
                  'Knowledge graphs',
                  'Empirical evaluation',
                  'Data sovereignty',
                ],
              },
            ],
          },
        ],
      },
    ],
  },

  // -------------------------------------------------- 4. projects & tools
  {
    title: 'Projects & toolbox',
    blocks: [
      {
        kind: 'cards',
        items: [
          {
            title: 'Zyndra — VR, AR & 3D',
            meta: '2025 – 26',
            org: 'Unity · Meta Quest · Vuforia · Blender',
            text: 'A first-person VR blindness simulation, an AR app turning a paper map into 3D routes, and a 3D trailer.',
          },
          {
            title: 'AidGuide — guide robot',
            meta: '2025',
            org: 'ROS2 · Computer Vision · Gazebo',
            text: 'Adaptive pathfinding with re-routing, plus object, text (OCR) and shape recognition on the street.',
          },
          {
            title: 'Aura — Zero-UI assistant',
            meta: '2025',
            org: 'Computer vision · NLP · speech-to-text',
            text: 'A voice assistant that reads the street for blind users. No screen, no extra hardware.',
          },
          {
            title: 'URBANVIVE — living paving',
            meta: '2025',
            org: 'Permeable paving with a microbiota',
            text: 'Soil layers, substrates, irrigation sensors and drainage for flood-prone streets.',
          },
          {
            title: '3D Portfolio',
            meta: '2026',
            org: 'Three.js · WebGL · Blender · Mixamo',
            text: 'An explorable 3D web portfolio — the one you’re standing in.',
          },
          {
            title: 'NeuroSpot · VIMYP · EcoCity',
            meta: '2023 – 24',
            org: 'Next.js · AWS · React · ESP-IDF',
            text: 'ADHD pre-screening by gamification; air-quality keyrings and smart streetlights with printed housings.',
          },
        ],
      },
      {
        kind: 'columns',
        ratio: 0.47,
        left: [
          {
            kind: 'meters',
            caption: 'How much I reach for each',
            note: 'Self-assessed — my own read on how often and how deeply I use each.',
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
            kind: 'row',
            label: 'Certifications',
            value:
              'Agentic AI — RAG with LangGraph & Ollama (Udemy, 2026) · Three.js Journey (2025) · AutoCAD 2D (UPV, 2026) · 17 in total, on LinkedIn.',
          },
        ],
        right: [
          {
            kind: 'chips',
            caption: 'Everything else in the bag',
            groups: [
              { label: 'AI & research', items: ['LangGraph', 'Ollama', 'RAG', 'Knowledge graphs', 'PEFT/LoRA', 'OpenCV'] },
              { label: 'Code', items: ['C++', 'C#', 'Java', 'Python', 'JavaScript', 'TypeScript', 'HTML/CSS'] },
              { label: 'Design & 3D', items: ['Figma', 'Axure', 'Blender', '3ds Max', 'Substance 3D', 'Photoshop'] },
              { label: 'AR/VR & robotics', items: ['Unity', 'Meta Quest', 'Vuforia', 'Three.js', 'ROS2', 'Gazebo'] },
              {
                label: 'Prototyping & ways of working',
                items: ['AutoCAD', 'Fritzing', 'Arduino', 'Scrum', 'Git'],
              },
            ],
          },
        ],
      },
    ],
  },
]
