/** All the words. Edit freely — nothing here is referenced by structure. */

export const chapters = [
  { id: 1, key: 'welcome', title: 'Magical Birthday Welcome', short: 'Welcome', emoji: '🎀' },
  { id: 2, key: 'letter', title: 'The First Emotional Letter', short: 'First Letter', emoji: '💌' },
  { id: 3, key: 'games', title: 'Birthday Mini-Games', short: 'Mini-Games', emoji: '🎮' },
  { id: 4, key: 'vault', title: 'Secret Password Vault', short: 'Vault', emoji: '🔐' },
  { id: 5, key: 'infinity', title: 'Infinity Love Challenge', short: 'Infinity', emoji: '♾️' },
  { id: 6, key: 'capsule', title: 'Private Memory Capsule', short: 'Capsule', emoji: '🫙' },
  { id: 7, key: 'gift', title: 'The Grand Birthday Surprise', short: 'Surprise', emoji: '🎁' },
  { id: 8, key: 'notes', title: 'Forever Emotional Notes', short: 'Notes', emoji: '📜' },
  { id: 9, key: 'garden', title: 'Love and Kindness Garden', short: 'Garden', emoji: '🌷' },
  { id: 10, key: 'arcade', title: 'Letters and Love Arcade', short: 'Arcade', emoji: '🕹️' },
  { id: 11, key: 'final', title: 'The Final Letter', short: 'Final Letter', emoji: '💌' },
] as const

export type ChapterKey = (typeof chapters)[number]['key']

export const welcome = {
  heading: `Happy Birthday, En Thangopillaiiiii! 🎂🥹❤️`,
  sub: 'Innaiku un birthday da! Enakku romba romba special aana naal. 🥹❤️',
  eyebrow: 'A little universe, built by hand',
  body: `En chellowww... En thangameyyy... En azhaguuu kutty pillaiiii...!

Innaiku un birthday da! Enakku romba romba special aana naal. Because intha ulagathula enakku romba precious aana oru uyir vantha naal ithu! 🥹❤️

Unakku theriyuma da? Nee en life la vanthathukku appuram, chinna chinna vishayangal kooda enakku romba beautiful ah therinja aarambichuthu.

**You are my happiness, my peace, my favourite person, and my everything!** ❤️

Intha website la irukkura ovvoru page um, ovvoru animation um, ovvoru kutty surprise um unakkaga naan love oda create pannathu da.

Ithu just a birthday website illa...

**En manasukulla 5 years 7 months ah naan serthu vachirukkura anbu, memories, and feelings oda oru kutty ulagam da!** 🥹🫂

Innaiku unakku oru request mattum dhaan...

Happy ah iru da, nalla sirichitte iru. Un sirippu enakku eppovume romba precious!

**Welcome to my little universe, en Thangopillai!** 🌌❤️`,
  primaryCta: 'Begin Your Birthday Journey ✨',
  secondaryCta: 'Explore the Little Games 🎮',
  hint: 'Move across the sky',
  hintTouch: 'Touch the sky',
  floatingNotes: [
    'for my little star ✨',
    'worth more than words 💙',
    'made slowly, with love',
    'always cheering for you 🌷',
  ],
  heroAlt: 'A brother and sister sitting together on sky-blue clouds',
}

/** Chapter 2 — the first letter inside the envelope. */
export const firstLetter = {
  to: 'To My Dearest Thangopillai... 🥹❤️',
  paragraphs: [
    'En chellowww...',
    'Unkitta naan neraya vishayangal sollanum nu ninaichirukken da. Aana sila feelings ah vaarthaiyaala sollave mudiyathu.',
    'Unna first time en life la special ah feel panna aarambicha antha moments... Unkooda pesina kutty kutty conversations... Un sirippu... Un kobam... Un paasam... Ellame innaikum en manasukulla apdiye irukku da. 🥺❤️',
    'Sila neram namma sandai pottirukkalam, sila neram pesama irunthirukkalam... Aana oru naal kooda nee enakku ordinary person ah therinjathilla.',
    '**You were never just a part of my life. You became a part of who I am.** ❤️',
    'Unna pathi ninaikkumbothu enakku oru azhagana happiness irukku da. Antha happiness ah explain panna enakku vaarthaigale illa.',
    'En life la enakku oru kutty idam kuduthathukku thank you da thangameyyy.',
    '**I love you more than these little words can ever explain.**',
  ],
  sign: 'With all my love,',
  from: 'Un Anna ♡',
}

/** Chapter 3 — the three mini-games. */
export const memoryPairs = ['💌', '🌸', '🧸', '🎁', '🌙', '💙']

export const bondQuiz = {
  questions: [
    {
      q: 'What makes our bond special?',
      options: [
        { text: 'We fight, then forget in five minutes', score: 3 },
        { text: 'We can be fully ourselves together', score: 3 },
        { text: 'We share food without asking', score: 2 },
      ],
    },
    {
      q: 'Who creates the most silly arguments?',
      options: [
        { text: 'Definitely me (I said sorry first, remember?)', score: 2 },
        { text: 'Definitely you, but you are cute so it is allowed', score: 3 },
        { text: 'Both of us, equally, all the time', score: 3 },
      ],
    },
    {
      q: 'What matters most between us?',
      options: [
        { text: 'That you are happy', score: 3 },
        { text: 'That we always come back to each other', score: 3 },
        { text: 'That I keep annoying you forever', score: 2 },
      ],
    },
  ],
  resultTitle: 'Infinity out of 100! ❤️',
  resultLine:
    'Because sila relationships ah numbers la measure panna mudiyathu. Namma 5 years 7 months um apdi dhaan da! 🥹❤️',
  playAgain: 'Play again',
}

/** Chapter 6 — sample memories for the jar, and the capsule copy. */
export const memoryJar = [
  'The day you laughed so hard you could not finish your sentence.',
  'Every time you sent me a voice note just to say nothing at all.',
  'That one photo we took badly on purpose and kept anyway.',
  'The night you stayed up with me on the phone doing nothing.',
  'All the times you said “I am fine” and I still worried 💙',
]

/** Chapter 6 — the little letter shown above the capsule slots. */
export const capsuleNote = {
  title: 'Some moments are too precious to forget... 🥹❤️',
  paragraphs: [
    'En thangopillai... Namma life la neraya photos irukkalam, neraya messages irukkalam... Aana sila chinna moments mattum namma heart la permanent ah irukkum da.',
    'Un kannu... Un kutty kai... Un sirippu... Un voice... Unkooda pesina antha chinna chinna nerangal... Ellame enakku romba special.',
    '**5 years 7 months...**',
    'Ithu just time illa da. Naan un kooda spend panna ovvoru second um en life la oru precious memory.',
    'Intha capsule la nee ethavathu photo illa voice note vachalum, vaikkalanaalum, athu okay da. Unakku comfortable ah irukkura memories mattum keep panniko.',
    '**Because the most beautiful memories are not always stored in photos... Some are carried quietly in our hearts.** 🥹🫂❤️',
  ],
  sealedShared:
    'Thank you for sharing a little piece of your world, en Thangopillai. Un memories ah eppovum precious ah mathippen da. ❤️',
}

export const compliments = [
  'You make ordinary days feel like celebrations.',
  'Your laugh is genuinely my favourite sound.',
  'You are the bravest person I know, even on the tired days.',
  'Somebody is very lucky to be your Anna.',
  'You do not have to be perfect to be deeply loved.',
  'The world is softer because you are in it.',
  'You are somebody’s reason to smile today.',
  'Keep going. You are doing far better than you think.',
]

export const wishes = [
  'That you always feel safe.',
  'That your dreams get loud enough to be heard.',
  'That you never run out of things to laugh about.',
  'That every hard day ends gently.',
  'That you always know how loved you are.',
]

/** Chapter 8 — the three forever notes. */
export const foreverNotes = [
  {
    title: 'When You Doubt Yourself',
    emoji: '🌤️',
    body: `En thangopillai... Unna pathi nee eppovathu doubt pannina, onnu mattum nyabagam vachiko da.

Nee ninaikkuratha vida nee romba strong, romba precious, romba beautiful soul. Unna nee kammiya ninaikkatha da.

**You are enough, you are worthy, and you deserve every beautiful thing life has to offer.**

Unna nambu da chellowww... Anna eppovum un happiness ah dhaan aasai paduven! 🥹❤️`,
  },
  {
    title: 'When We Fight',
    emoji: '🍃',
    body: `En chellowww... Namma rendu perum sila neram misunderstand pannirukkalam, sandai pottirukkalam, azhuthirukkalam...

Aana oru sandai nala namma share panna azhagana moments ellam poi aagidathu da.

Naan thappu panniruntha, un manasa hurt panniruntha, manasaara sorry da.

**I never wanted my love to become a reason for your tears.**

Nee eppovum peaceful ah, happy ah irukkanum da. 🥺❤️`,
  },
  {
    title: 'When You Miss Home',
    emoji: '🏡',
    body: `En thangameyyy... Sila naal romba lonely ah feel aagalam da. Sila neram yaarum namma feelings ah purinjukkala nu thonalam.

Antha nerathula nee thaniya illa nu nyabagam vachiko. Unna nesikkura manushanga irukkanga. Unakku santhosham kidaikkanumnu aasai padura hearts irukku.

**Wherever life takes you, I hope you always find a place where your heart feels safe.**

Nalla iru da en chellowww! 🫂❤️`,
  },
]

/** Chapter 9 — the kindness garden. */
export const gardenFlowers = [
  {
    kind: 'Patience',
    emoji: '🌼',
    choice: 'Someone wants to tell you about their whole day. What do you do?',
    answers: [
      { text: 'Put the phone down and listen properly', good: true },
      { text: 'Half listen while scrolling', good: false },
    ],
    bloom: 'Unakku pesanum nu thonumbothu, un feelings ah yaaravathu porumaiya kekkanum da. Un voice matters.',
  },
  {
    kind: 'Respect',
    emoji: '🌷',
    choice: 'A friend is upset about something you think is small. What do you say?',
    answers: [
      { text: '“It matters because it matters to you.”', good: true },
      { text: '“It is not a big deal, forget it.”', good: false },
    ],
    bloom: 'Love na just care mattum illa da. Un feelings, un choices, un dreams ellathayum respect pannurathum love dhaan.',
  },
  {
    kind: 'Forgiveness',
    emoji: '🌸',
    choice: 'Someone apologises awkwardly. What do you do?',
    answers: [
      { text: 'Accept it kindly and let it go', good: true },
      { text: 'Bring it up again later', good: false },
    ],
    bloom: 'Sila thappugal namakku pain kudukkalam. Aana forgiveness namma heart ku peace kudukkum da.',
  },
  {
    kind: 'Encouragement',
    emoji: '🌻',
    choice: 'Someone is nervous before something important. What do you do?',
    answers: [
      { text: 'Remind them how far they have come', good: true },
      { text: 'Say nothing, they will manage', good: false },
    ],
    bloom: 'Nee enna dream vachirunthalum atha achieve pannu da. Un success ah paathu manasaara santhoshappaduven.',
  },
  {
    kind: 'Happiness',
    emoji: '💮',
    choice: 'You think of someone far away. What do you do?',
    answers: [
      { text: 'Send a small message, just to say you hope they are well', good: true },
      { text: 'Wait for them to message first', good: false },
    ],
    bloom: 'Enakku nee kidaikkanumnu aasai irunthatha vida, nee eppovum santhoshama irukkanumnu romba aasai da.',
  },
]

/** Chapter 9 — shown when the mended heart is complete. */
export const heartClosing = {
  title: 'A heart is made beautiful by love, trust, respect, care, and understanding. ❤️',
  paragraphs: [
    'En thangopillai... Namma life la ellame perfect ah irukkathu da. Sila memories sirikka vaikkum, sila memories azha vaikkum.',
    'Aana naan un kooda share panna azhagana moments ku eppovum grateful ah iruppen.',
    '**Thank you for being one of the most beautiful parts of my life.** 🥹❤️',
  ],
}

export const heartPieces = [
  { label: 'Trust', emoji: '🤍' },
  { label: 'Kindness', emoji: '💙' },
  { label: 'Respect', emoji: '💜' },
  { label: 'Care', emoji: '💚' },
  { label: 'Understanding', emoji: '💛' },
]

export const postcards = [
  'You are doing better than you think. Keep going.',
  'Whatever today looks like, I am on your side.',
  'Take the rest you need. You have earned it.',
  'Something good is on its way to you.',
  'You are allowed to be a whole person, not just a strong one.',
]

export const postcardSign = 'Sent from my little sky, with love ♡'

/** Chapter 10 — the arcade. */
export const sentenceGame = {
  template: 'Your ______ matters more than you know.',
  words: ['Happiness', 'Smile', 'Peace', 'Kindness'],
  sentences: {
    Happiness: 'Your happiness matters more than you know. ❤️',
    Smile: 'Your smile is one of my favourite things in the world. 🥹',
    Peace: 'Your peace will always be important to me. 🫂',
    Kindness: 'Your kindness makes you more beautiful than words can say. 🌷',
  },
} as const

export const emotionalEnvelopes = [
  {
    title: 'Open When You Feel Happy',
    emoji: '☀️',
    note: 'Aiyoooo en chellowww! Sirikkiriya da? 😭❤️ Antha sirippu apdiye irukkanum. Un happiness ah paakumbothu enakkum oru thani happiness da!',
  },
  {
    title: 'Open When You Feel Sad',
    emoji: '🌧️',
    note: 'En thangameyyy... Azhugatha nu solla maatten da. Azhuganum na azhu. Aana nee ellathayum thaniya sumakkanumnu ninaikkatha. You deserve care, comfort, and peaceful days. 🥺❤️',
  },
  {
    title: 'Open When You Miss Someone',
    emoji: '🌙',
    note: 'Sila per namma pakkathula illanalum, avanga kudutha memories namma koodave irukkum da. Distance can change where people are, but it cannot erase the beautiful moments they shared. 🥹🫂',
  },
]

export const promiseStars = [
  { promise: 'I wish you a lifetime of happiness. ❤️', emoji: '✨' },
  { promise: 'I wish your dreams come true. ✨', emoji: '🌟' },
  { promise: 'I wish you never lose your beautiful smile. 🥹', emoji: '💫' },
  { promise: 'I wish your heart always finds peace. 🫂', emoji: '⭐' },
  { promise: 'I promise to treasure our memories with gratitude. ♾️', emoji: '💙' },
]

export const arcadeClosing =
  'En Thangopillai... Intha five stars ah vida nee en life la romba bright ah shine pannirukka da. One last letter is waiting for you... Athula Anna oda heart la irukkura ellame sollirukken. 🥹❤️'

/** Chapter 11 — the final letter. Spelling preserved on purpose.
 *  Every entry in `cards` becomes one card on the page. `**bold**` and
 *  `*italic*` marks are rendered as emphasis, so keep the markers. */
export const finalLetter = {
  to: 'For my Thangopillai',
  tag: 'the last page ♡',
  cards: [
    `**Happy Birthday, En Uyirana Thangopillaiiiii...!** 🎂😭❤️

En chellowww... En thangameyyy... En azhaguuu kutty pillaiiii... 🥹🫂`,
    `Intha letter ah epdi start pannurathune enakku theriyala da...

Unkitta sollanum nu nenacha vaarthaigal romba irukku. Aana atha ezhuthumbothu en manasu romba heavy ah irukku da... 🥺❤️`,
    `**5 years 7 months...**

Intha 5 years 7 months la nee enakku kudutha happiness, memories, love, care, chinna chinna sandai, sirippu, kanneer... Ellame en life la naan marakka mudiyatha oru azhagana journey da. 😭❤️`,
    `Enakku theriyala da... Next year un birthday varumbothu naan ipdi wish pannuvana, unakkaga gifts create pannuvana, illa un life la oru chinna space aavathu irukkuma nu...

Life namma ninaikkura maathiri eppovum irukkathu la da... 🥺💔`,
    `Unakkunu oru family, unakkunu oru future, unakkunu oru azhagana life irukku.

Antha life la naan irukkanumnu aasai irukku da... Aana ellame namma kaiyila illanu enakku puriyuthu.

**Aana naan un kooda iruntha 5 years 7 months ah ennaala oru naalum marakka mudiyathu da...!** 😭🫂`,
    `Nee en life la vanthathu enakku oru beautiful blessing.

Sila neram unna ninaikkumbothu sirippu varuthu... Sila neram un memories ah ninaikkumbothu kanneer varuthu... Aana antha sirippulayum, antha kanneerlayum, en manasukulla irukkura oru precious person nee mattum dhaan da... 🥹❤️`,
    `**You are my everything, Thangopillai.**

My happiness... My peace... My favourite memory... My most precious ONE... ❤️`,
    `Un mela naan vachirukkura love ah, en God kitta kooda ivlo deep ah vachirukkena nu enakku theriyala da... Aana athu romba pure, romba precious, romba meaningful.

**1 is always 1... And that ONE is always YOU!** ♾️❤️`,
    `Innaiku unakku naan kudukkura gift perusa illama irukkalam da...

Ennoda 3D printer la, en kaiyaala, ennaala mudinja alavukku create pannirukken. Ellarum buy panni gift kudukkumbothu, naan unakkaga naane senju kudukkanumnu aasai patten da. Perfect ah illanalum, athula irukkura ovvoru detail um unakkaga naan spend panna time oda oru chinna adaiyaalam.

**Because I wanted to give you something made by my hands, carrying the love in my heart.** 🥹❤️`,
    `Enakku un kitta irunthu ethavathu return venumnu illa da...

Nee happy ah irukkanum... Nalla saapidanum... Nalla thoonganum... Un dreams ellathayum achieve pannanum... Unna unmaiya love pannura, respect pannura manushangaloda nee santhoshama irukkanum.

**Even if life takes us in different directions, I will always wish beautiful things for you.** 🥺🫂`,
    `En life la enakku oru kutty space kuduthathuku thank you da... Enna sirikka vachathuku thank you... Enakku neraya beautiful memories kuduthathuku thank you... En manasukulla ivlo precious aana idam pidichathuku thank you...

**Thank you for those unforgettable 5 years and 7 months, my Thangopillai.** 😭❤️`,
    `Namma future epdi irukkumnu enakku theriyala da... Aana namma past la irukkura azhagana memories ah naan eppovum nandriyoda nenachuppan.

Unna pathi ninaikkumbothu oru naal kanneer vanthalum, antha memories enakku oru azhagana gift dhaan.

**You may not be beside me in every tomorrow, but I will always be grateful for every yesterday we shared.** 🥹💔`,
    `En thangameyyy... Innaiku mattum illa da... Un life la vara ovvoru birthday um, ovvoru pudhu beginning um, ovvoru azhagana moment um unakku happiness kudukkanum.

Nee eppovum sirichitte irukkanum da...

**Once again, Happy Birthday, En Uyirana Thangopillaiiiii!** 🎂🦚❤️`,
    `Love you sooooo much da, en chellowww... 😭🫂❤️`,
    `*Some people become memories...*

*Some memories become a part of our lives...*

**But YOU became a part of my heart that time can never erase.** ❤️♾️`,
    `With all my love, all my memories, and all my gratitude...`,
  ],
  signature: 'Un Anna ♡',
  closing: '5 Years • 7 Months • Countless Memories • One Precious Person ♾️',
}

/** Extra hidden surprises. */
export const hidden = {
  cloudMessage: 'One more little secret... you mean more than words can say.',
  finalStar: `**Thank You, My Thangopillai...** ♡

If I could ask time for one little favour, I wouldn't ask it to change our future... I would ask it to let me visit one of our happiest moments, just once more. 🥹❤️`,
  candleWish:
    'Make a wish da chellowww... Unakku pidicha ellaa santhoshamum un life la kidaikkanum. Happy Birthday, my little star! ✨',
}

/** Chapter 1 gallery strip — the little windows into the chapters. */
export const journeyPreview = [
  { key: 'letter', label: 'First Letter', caption: 'A sealed envelope with something inside' },
  { key: 'games', label: 'Mini-Games', caption: 'Three small games, no losing badly allowed' },
  { key: 'vault', label: 'Secret Vault', caption: 'Three keys, and you already know them' },
  { key: 'garden', label: 'Kindness Garden', caption: 'Five flowers waiting to bloom' },
  { key: 'final', label: 'The Last Page', caption: 'Written by hand, just for you' },
]
