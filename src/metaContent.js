// Nested content for the Meta-glasses VR hub. Sections -> items -> a view with
// image(s) + typewriter text + optional clickable links. Photos use left/right
// (stylised / real); projects and press use a single `image` in both lenses.
export const META_SECTIONS = [
  {
    label: 'Camera roll 📷',
    prompt: 'Which shot?',
    items: [
      { label: 'Me 👋', left: 'photos/styled/me.webp', right: null, text: ['That’s me — welcome to my little world!'] },
      { label: 'Chocolate bun 🍫', left: 'photos/styled/pastry.webp', right: null, text: ['A warm chocolate-filled bun — the little joys count.'] },
      { label: 'Nilo 🐶', left: 'photos/styled/nilo.webp', right: null, text: ['Nilo, my pug — the tiny king of the house.'] },
      { label: 'Warsaw 🌸', left: 'photos/styled/warsaw.webp', right: null, text: ['Warsaw at sunset, during my Erasmus.'] },
      { label: 'China 🏯', left: 'photos/styled/china.webp', right: null, text: ['A garden pavilion in China — it left me speechless.'] },
      { label: 'Paris 2024 🥐', left: 'photos/styled/paris.webp', right: null, text: ['Paris during the 2024 Olympics.'] },
      { label: 'Fallas 🔥', left: 'photos/styled/fallas.webp', right: null, text: ['The Fallas of Valencia — art, fire and fiesta.'] },
      { label: 'Polish feast 🥟', left: 'photos/styled/polishfood.webp', right: null, text: ['A proper Polish feast — pierogi everywhere!'] },
      { label: 'Ayora 💙', left: 'photos/styled/ayora.webp', right: null, text: ['“Bésame en este rincón” — a corner of Ayora.'] },
    ],
  },
  {
    label: 'Projects 💻',
    prompt: 'Pick a project:',
    items: [
      {
        label: 'Socratic Tutor · TFG',
        image: 'meta/projects/tfg.webp',
        text: [
          'My bachelor’s thesis: a Socratic virtual tutor for Ohm’s law, built on an Agentic-RAG pipeline.',
          'LLMs · RAG · knowledge graph · deployed on UPV infrastructure',
        ],
        links: [
          { label: 'GitHub ↗', url: 'https://github.com/irenemg8/TFG-Tutor-Virtual' },
          { label: 'Try it ↗', url: 'https://tutor-virtual.dsic.upv.es/v2/' },
        ],
      },
      {
        label: 'PromptGen',
        image: 'meta/projects/promptgen.webp',
        text: ['PromptGen — create, tag and reuse AI prompts, fast.', 'Next.js · Tailwind · TypeScript · Firebase'],
        links: [
          { label: 'GitHub ↗', url: 'https://github.com/irenemg8/promptgen' },
          { label: 'Open live ↗', url: 'https://irenemg8.github.io/promptgen/' },
        ],
      },
      {
        label: 'Aura',
        image: 'meta/projects/aura.webp',
        text: ['Aura — an all-in-one assistant for blind and visually impaired users.', 'Voice-first, camera-powered · React Native · TF Lite · Cloud Vision'],
        links: [{ label: 'GitHub ↗', url: 'https://github.com/agonfer/auraFlutter' }],
      },
      {
        label: 'Othello AI',
        image: 'meta/projects/othello.webp',
        text: ['A competitive Othello AI — Minimax with alpha-beta pruning.', 'Unity · C#'],
        links: [
          { label: 'GitHub ↗', url: 'https://github.com/irenemg8/othello_game' },
          { label: 'Play it ↗', url: 'https://irenemg8.github.io/othello_game/' },
        ],
      },
      {
        label: '3D Portfolio',
        image: 'meta/projects/portfolio.webp',
        text: ['A 3D portfolio blending real-time graphics with clean UX.', 'Three.js · React · Blender'],
        links: [
          { label: 'GitHub ↗', url: 'https://github.com/irenemg8/Portfolio' },
          { label: 'Open live ↗', url: 'https://irene.divdev.es/' },
        ],
      },
      {
        label: 'Geospatial Repo',
        image: 'meta/projects/carto.webp',
        text: ['A web platform to explore thematic cartographic studies.', 'QGIS · Python'],
        links: [
          { label: 'GitHub ↗', url: 'https://github.com/irenemg8/Repo-Cartografia' },
          { label: 'Open live ↗', url: 'https://cartografia.divdev.es/' },
        ],
      },
      {
        label: 'PyCatan',
        image: 'meta/projects/catan.webp',
        text: ['A full terminal implementation of Settlers of Catan.', 'Python · OOP'],
        links: [{ label: 'GitHub ↗', url: 'https://github.com/vjrivmon/PyCatan' }],
      },
    ],
  },
  {
    label: 'Press 📰',
    prompt: 'Pick a story:',
    items: [
      {
        label: 'URBANVIVE · 1st prize',
        image: 'meta/press/upvgandia.webp',
        text: ['URBANVIVE won 1st prize at the 3rd Campus Salud Gandía Hackathon.'],
        links: [{ label: 'Read it ↗', url: 'https://cienciagandia.webs.upv.es/ca/2025/05/tercera-edicio-campus-salud-gandia/' }],
      },
      {
        label: 'EcoCity',
        image: 'meta/press/upv.webp',
        text: ['EcoCity — our smart urban-planning IoT prototype, featured by GTI.'],
        links: [{ label: 'Read it ↗', url: 'https://gandiainnova.webs.upv.es/blog/2024/02/26/prototipos-gti-iot-2024/' }],
      },
      {
        label: 'Talpa Tunneling',
        image: 'meta/press/upv.webp',
        text: ['Talpa Tunneling UPV — our tunnel-boring project on the UPV podcast.'],
        links: [{ label: 'Listen ↗', url: 'https://podcast.upv.es/programa/un-dia-perfecte/?episodio=talpa-tunneling-upv-las-locuritas-de-ursula' }],
      },
      {
        label: 'Campus Salud Gandía',
        image: 'meta/press/gandia.webp',
        text: ['Gandía hosted the 3rd edition of Campus Salud Gandía.'],
        links: [{ label: 'Read it ↗', url: 'https://www.gandia.es/atg/news/new.php?id=5250' }],
      },
      {
        label: 'Innpulso Emprende',
        image: 'meta/press/urbalab.webp',
        text: ['UrbanVive showcased at Innpulso Emprende Gandía.'],
        links: [{ label: 'Read it ↗', url: 'https://www.urbalabgandia.com/es/innpulso-emprende-2025/' }],
      },
    ],
  },
]
