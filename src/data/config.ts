/**
 * CREATOR SETTINGS — everything personal about the site lives here.
 * Change names, passwords, messages, speeds and art prompts in this file only.
 * The normal birthday visitor never sees these values as editable controls.
 */

export const config = {
  /** Who the birthday is for. */
  recipient: 'Thangopillai',
  /** What she calls you. */
  sender: 'Anna',
  /** Shown in the hero and the browser tab. */
  siteTitle: 'SkyBlue Birthday · Starlight Edition',

  /** Chapter 3 — Catch the Love */
  catchTarget: 12,
  catchSeconds: 20,

  /** Chapter 4 — the three secret keys, in order. */
  keys: [
    {
      id: 'date',
      password: '261025062001',
      numeric: true,
      label: 'Secret Key 1 · Our Special Date',
      hint: 'A very special date written as twelve digits.',
      success:
        'Awwww correct da en thangameyyy! 🥹❤️ Intha date oru number mattum illa... Namma azhagana journey oda oru precious memory!',
      wrong: 'Aiyoo close daa chellow… think of the date, twelve digits, no spaces ♡',
    },
    {
      id: 'nickname',
      password: 'THANGOPILLAI',
      numeric: false,
      label: 'Secret Key 2 · Your Special Nickname',
      hint: 'My favourite special nickname for you.',
      success:
        'Aiyoooo chellowww! 😭❤️ Un pera koopidumbothe enakku evlo happiness theriyuma da? Thangopillai nu sollumbothu en manasukulla oru thani santhosham!',
      wrong: 'ANNA EVLO DAA MUDIKUM UHAKU SOLLUUU',
    },
    {
      id: 'sweet',
      password: 'PAPAKUTTYPIYEN',
      numeric: false,
      label: 'Secret Key 3 · The Sweetest Name',
      hint: 'The sweetest secret nickname.',
      success:
        'En kutty pillaiiii! Correct da! ❤️ Nee enakku eppovum special dhaan. Time maaralam, life maaralam... Aana nee en manasukulla vachirukkura idam romba precious!',
      wrong: 'KUTTY MILLU ANNA VOAAA CHELLOWMEYYY MISS YOU THANGOMILLUU',
    },
  ],

  /** Chapter 5 — the infinity challenge. */
  infinity: {
    heading: 'How much does Anna love his Thangopillai?',
    options: ['10%', '25%', '50%', '75%', '99%', '100%', '1000%', '0%', '∞'],
    answer: '∞',
    reveal: 'LOVE YOU DAAAA EN THANGOPILLAIIII! 😭❤️♾️',
    win: `100% ah? 1000% ah? Illa da chellowww...

**Even infinity feels too small to describe how much you mean to me.**

Un mela naan vachirukkura love ku beginning irunthirukkalam... Aana athoda depth ah ennaala measure panna mudiyathu da. Nee en happiness, en peace, en precious ONE!

**One is always ONE... And that ONE is YOU!** 🥹❤️`,
    wrongNotes: ['Aiyooo chellowww! Anna oda love ivlo chinnatha da? Innum yosichu paaru! 🥹❤️'],
  },

  /** Chapter 7 — the gift. */
  gift: {
    primary: 'A Little Gift, Made With All My Love... 🎁🥹❤️',
    secondary: 'I LOVE YOU SOOOOO MUCH, EN THANGOPILLAIIII! ❤️',
    letter: {
      paragraphs: [
        'En chellowww... Unakku oru beautiful gift vaangi kudukkanumnu enakku aasai irunthuchu da.',
        'Aana kadaiyila irunthu oru gift vaangi kudukkuratha vida, **en kaiyaala unakkaga ethavathu create pannanum** nu romba aasai patten.',
        'Athukkaga dhaan naan kashtapattu vaangina ennoda 3D printer ah use panni unakkaga intha kutty gift senjen da.',
        'Konjam sothappal irukkalam... Finishing perfect ah illama irukkalam... Aana ovvoru detail layum naan spend panna time um, effort um, un mela vachirukkura love um irukku da. 🥺❤️',
        '**It may not be the most expensive gift in the world... But it carries one of the most precious feelings in my heart.**',
        'Unakku pudikkuma nu theriyala da... Aana oru naal intha gift ah paakumbothu, "Enakkaga ivlo love oda oruthan senjirukkan" nu oru chinna second ninaicha kooda...',
        '**Athuve enakku pothum da thangameyyy!** 😭🫂❤️',
      ],
    },
  },

  /** Chapter 11 — the last key, and the page it opens. */
  final: {
    key: '26102001',
    hint: 'A very special date written as eight digits — no spaces.',
    wrong: 'Aiyoo not that one daa chellow… eight digits, no spaces ♡',
  },

  /** Music. */
  music: {
    title: 'A Little Sky for You',
    /** 0 – 1 */
    volume: 0.42,
    /** Duck the piano to this level while a voice note plays. */
    duckVolume: 0.08,
  },

  /** AI illustration prompts. Change any of these to re-art the site. */
  art: {
    style:
      'dreamy sky-blue fantasy, glassmorphism, soft cinematic light, premium 3D animated illustration, pastel palette, no text',
    scene1:
      'an affectionate brother and sister sitting together on fluffy sky-blue clouds, glowing white flowers, floating translucent ribbons, delicate stars, a tiny birthday cake, planets and a silver space shuttle in the distance',
    scene2:
      'a premium white writing desk beside a huge circular spaceship window overlooking clouds, pale blue envelopes, white and lavender flowers, a fountain pen, a tiny glowing heart seal and handwritten stationery',
    scene3:
      'an affectionate brother and sister opening a magical glowing present, flower petals, gentle glitter, white clouds, soft blue lighting, a futuristic shuttle crossing a luminous planet',
    scene4:
      'an elegant floating glass heart shaped lock surrounded by soft blue celestial rings, stars and glowing keys',
    scene5:
      'a magical sky garden with small white flowers, pastel blue blossoms, floating kindness notes, glowing butterflies and softly illuminated flower pots',
    scene6:
      'antique cream writing paper with subtle blue floral borders, an elegant peacock feather resting beside a realistic pen nib, tiny gold sparkles, soft morning light',
  },

  /** Chapter 6 — the local-only memory capsule. */
  capsule: {
    slots: [
      { id: 'eye', label: 'Eye', emoji: '👁️' },
      { id: 'feet', label: 'Feet', emoji: '🦶' },
      { id: 'earring', label: 'Earring', emoji: '💎' },
      { id: 'hand', label: 'Hand / fingers', emoji: '🤲' },
    ],
    voicePrompt:
      'Tell your Anna what you want him to understand, remember, or know from your heart.',
  },
} as const

export type Config = typeof config
