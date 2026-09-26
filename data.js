/* Italia Scroll — content pack (v14, media audited + verified clips)
   Phase 1: English statement → pick matching Italian caption.
   Sneak: now vs past-scene feel + high-frequency chunks. No tense labels.
   Person scope: io, tu, lui/lei, noi (spread evenly per level). Silent unlock every 15 clears.
   Every card has ONE explicit, visually verified photo of the place named on the card.
   No rotation arrays. v14: 9 place-verified muted clips (card.video, photo = poster/fallback),
   4 place-verified people photos, 1 bonus sing-along card (v14.3: Apple Music 30 s preview streamed only on tap,
   plays the chorus segment; no YouTube, never autoplays).
   Correct-answer slot varies per card.
*/
window.ITALIA_SCROLL = {
  "version": 14,
  "unlockEvery": 15,
  "levels": [
    {
      "id": 1,
      "title": "Costa Campania",
      "blurb": "Bacoli → Monte → Ischia → Capri…",
      "minutes": "≈ 8–10 min"
    },
    {
      "id": 2,
      "title": "Sud e isole",
      "blurb": "Tropea → Polignano → Matera…",
      "minutes": "≈ 8–10 min"
    },
    {
      "id": 3,
      "title": "Centro e Nord",
      "blurb": "Bologna → Genova → Braies…",
      "minutes": "≈ 8–10 min"
    }
  ],
  "quickPlay": {
    "title": "Quick Play",
    "blurb": "Eight cards · about two–three minutes.",
    "minutes": "≈ 2–3 min",
    "cardIds": [
      "c1-05",
      "c1-09",
      "c1-03",
      "c2-12",
      "c2-02",
      "c3-07",
      "c3-02",
      "c3-01"
    ]
  },
  "cards": [
    {
      "id": "c1-01",
      "level": 1,
      "region": "Bacoli",
      "image": "images/hometown/notte-luna.jpg",
      "culture": "Bacoli · moon on the gulf",
      "prompt": "We’re in Bacoli and the gulf looks amazing tonight.",
      "gloss": "right now",
      "person": "noi",
      "captions": [
        "Eravamo a Bacoli e il golfo era sempre stupendo",
        "Siamo a Bacoli e stasera il golfo è stupendo"
      ],
      "correct": 1,
      "why": [
        "That one is how it used to feel. Your English says tonight.",
        ""
      ],
      "help": "Match the English: you’re there tonight. New chunk: il golfo = the gulf.",
      "explain": "Siamo… è… stasera = we’re there, it is, tonight — live, not a memory.",
      "softExplain": "Read the English line. Pick the Italian that says the same thing.",
      "prove": {
        "choices": [
          "We’re there tonight",
          "We used to be there"
        ],
        "correct": 0,
        "miss": "Live now — not a memory."
      },
      "hook": false,
      "lockIn": {
        "it": "il golfo",
        "en": "the gulf"
      }
    },
    {
      "id": "c1-05",
      "level": 1,
      "region": "Roma",
      "image": "images/places/roma-ferrari-colosseo.jpg",
      "culture": "Roma · rosso corsa at the Colosseo",
      "prompt": "I see a red Ferrari in front of the Colosseum — wild!",
      "gloss": "right now",
      "person": "io",
      "captions": [
        "Vedo una Ferrari rossa davanti al Colosseo, pazzesco!",
        "Vedevo sempre una Ferrari rossa davanti al Colosseo"
      ],
      "correct": 0,
      "why": [
        "",
        "That one is what you used to see. English is this second."
      ],
      "help": "Match “I see it now.” Vedo = I see. davanti a = in front of.",
      "explain": "Vedo… = spotting it live this second.",
      "softExplain": "Read the English line. Pick the Italian that says the same thing.",
      "prove": {
        "choices": [
          "I used to see that Ferrari",
          "I see the red Ferrari now"
        ],
        "correct": 1,
        "miss": "Live look = now."
      },
      "hook": true,
      "lockIn": {
        "it": "davanti al Colosseo",
        "en": "in front of the Colosseum"
      }
    },
    {
      "id": "c1-03",
      "level": 1,
      "region": "Ischia",
      "image": "images/places/ischia-2.jpg",
      "culture": "Ischia summers · looking back",
      "prompt": "Every summer we used to go to Ischia and stay on the beach for hours.",
      "gloss": "used to",
      "person": "noi",
      "captions": [
        "Ogni estate andavamo a Ischia e stavamo in spiaggia per ore",
        "Ogni estate andiamo a Ischia e stiamo in spiaggia per ore"
      ],
      "correct": 0,
      "why": [
        "",
        "That one is today’s habit. English looks back."
      ],
      "help": "Match the old summer habit. la spiaggia = the beach.",
      "explain": "andavamo / stavamo = how summers used to go — not today’s plan.",
      "softExplain": "Read the English line. Pick the Italian that says the same thing.",
      "prove": {
        "choices": [
          "We used to go every summer",
          "We go every summer now"
        ],
        "correct": 0,
        "miss": "“Used to” = past habit."
      },
      "hook": false,
      "lockIn": {
        "it": "la spiaggia",
        "en": "the beach"
      }
    },
    {
      "id": "c1-08",
      "level": 1,
      "region": "Capri",
      "image": "images/places/capri-1.jpg",
      "video": "videos/capri-faraglioni.mp4",
      "culture": "Capri · pointing them out",
      "prompt": "Do you see the Faraglioni? Look over there!",
      "gloss": "right now",
      "person": "tu",
      "captions": [
        "Da piccolo vedevi i faraglioni da lì?",
        "Vedi i faraglioni? Guarda lì!"
      ],
      "correct": 1,
      "why": [
        "That one asks about when you were little. English is live.",
        ""
      ],
      "help": "Match you talking to a friend live. Guarda lì! = Look over there!",
      "explain": "Vedi i faraglioni? Guarda lì! = you’re pointing them out right now.",
      "softExplain": "Read the English line. Pick the Italian that says the same thing.",
      "prove": {
        "choices": [
          "You see them right now",
          "You used to see them as a kid"
        ],
        "correct": 0,
        "miss": "Live point."
      },
      "hook": false,
      "lockIn": {
        "it": "Guarda lì!",
        "en": "Look over there!"
      }
    },
    {
      "id": "c1-06",
      "level": 1,
      "region": "Procida",
      "image": "images/places/procida-1.jpg",
      "culture": "Procida · colorful harbor",
      "prompt": "Every summer Marco used to draw the colors of the harbor.",
      "gloss": "used to",
      "person": "lui",
      "captions": [
        "Ogni estate Marco disegnava i colori del porto",
        "Ogni estate Marco disegna i colori del porto"
      ],
      "correct": 0,
      "why": [
        "",
        "That one is what he does now. English looks back."
      ],
      "help": "Match Marco’s old summer habit. il porto = the harbor.",
      "explain": "disegnava = he used to draw — a past-scene habit.",
      "softExplain": "Read the English line. Pick the Italian that says the same thing.",
      "prove": {
        "choices": [
          "Marco draws the harbor now",
          "Marco used to draw the harbor"
        ],
        "correct": 1,
        "miss": "Old summers."
      },
      "hook": false,
      "lockIn": {
        "it": "il porto",
        "en": "the harbor"
      }
    },
    {
      "id": "c1-10",
      "level": 1,
      "region": "Bacoli",
      "image": "images/hometown/molo-tramonto.jpg",
      "culture": "Bacoli · waiting on sunset",
      "prompt": "I’m staying in Bacoli until sunset — I’m not leaving.",
      "gloss": "right now",
      "person": "io",
      "captions": [
        "Restavo sempre a Bacoli fino al tramonto",
        "Resto a Bacoli fino al tramonto, non me ne vado"
      ],
      "correct": 1,
      "why": [
        "That one is an old habit. English is tonight.",
        ""
      ],
      "help": "Match staying for sunset now. il tramonto = sunset.",
      "explain": "Resto… non me ne vado = staying now, not leaving.",
      "softExplain": "Read the English line. Pick the Italian that says the same thing.",
      "prove": {
        "choices": [
          "I used to stay for sunset",
          "I’m staying for sunset"
        ],
        "correct": 1,
        "miss": "Tonight = present."
      },
      "hook": false,
      "lockIn": {
        "it": "il tramonto",
        "en": "sunset"
      }
    },
    {
      "id": "c1-07",
      "level": 1,
      "region": "Amalfi",
      "image": "images/places/amalfi-2.jpg",
      "video": "videos/amalfi-dal-mare.mp4",
      "culture": "Amalfi · lemon gelato memory",
      "prompt": "In Amalfi you always used to get a lemon gelato.",
      "gloss": "used to",
      "person": "tu",
      "captions": [
        "Ad Amalfi prendi sempre un gelato al limone",
        "Ad Amalfi prendevi sempre un gelato al limone"
      ],
      "correct": 1,
      "why": [
        "That one is your habit today. English looks back.",
        ""
      ],
      "help": "Match your old Amalfi habit. gelato al limone = lemon gelato.",
      "explain": "prendevi sempre… = what you always used to get.",
      "softExplain": "Read the English line. Pick the Italian that says the same thing.",
      "prove": {
        "choices": [
          "You used to get lemon gelato",
          "You get lemon gelato now"
        ],
        "correct": 0,
        "miss": "Used-to habit."
      },
      "hook": true,
      "lockIn": {
        "it": "gelato al limone",
        "en": "lemon gelato"
      }
    },
    {
      "id": "c1-09",
      "level": 1,
      "region": "Capri",
      "image": "images/places/capri-2.jpg",
      "video": "videos/capri-belvedere.mp4",
      "culture": "Capri · belvedere story time",
      "prompt": "She’s filming a story at the belvedere right now — wait.",
      "gloss": "right now",
      "person": "lei",
      "captions": [
        "Sta facendo una storia al belvedere, aspetta",
        "Faceva sempre le storie al belvedere"
      ],
      "correct": 0,
      "why": [
        "",
        "That one is how she used to post. English is live."
      ],
      "help": "Match her live story. sta facendo una storia = she’s filming a story.",
      "explain": "Sta facendo… aspetta = happening this second.",
      "softExplain": "Read the English line. Pick the Italian that says the same thing.",
      "prove": {
        "choices": [
          "She used to post stories here",
          "She’s posting a story now"
        ],
        "correct": 1,
        "miss": "Live story."
      },
      "hook": true,
      "lockIn": {
        "it": "fare una storia",
        "en": "to film / post a story"
      }
    },
    {
      "id": "c1-15",
      "level": 1,
      "region": "Bacoli",
      "image": "images/hometown/faro.jpg",
      "culture": "Bacoli · Sunday lighthouse walks",
      "prompt": "Every Sunday I used to go to the lighthouse with my grandpa.",
      "gloss": "used to",
      "person": "io",
      "captions": [
        "Ogni domenica vado al faro con il nonno",
        "Ogni domenica andavo al faro con il nonno"
      ],
      "correct": 1,
      "why": [
        "That one is what you do now. English looks back.",
        ""
      ],
      "help": "Match the old Sunday habit. il faro = the lighthouse.",
      "explain": "andavo = I used to go — a memory with nonno.",
      "softExplain": "Read the English line. Pick the Italian that says the same thing.",
      "prove": {
        "choices": [
          "I used to go with Grandpa",
          "I go with Grandpa now"
        ],
        "correct": 0,
        "miss": "Old Sundays."
      },
      "hook": false,
      "lockIn": {
        "it": "il faro",
        "en": "the lighthouse"
      }
    },
    {
      "id": "c1-02",
      "level": 1,
      "region": "Monte di Procida",
      "image": "images/hometown/capo-miseno.jpg",
      "culture": "Monte · her hometown overlook",
      "prompt": "You’re at the belvedere in Monte di Procida — our teacher’s hometown!",
      "gloss": "right now",
      "person": "tu",
      "captions": [
        "Sei al belvedere di Monte di Procida, il paese della prof!",
        "Eri al belvedere di Monte di Procida, il paese della prof"
      ],
      "correct": 0,
      "why": [
        "",
        "That one paints a past visit. English is right now."
      ],
      "help": "Match “you’re at the belvedere now.” il belvedere = scenic overlook.",
      "explain": "Sei al belvedere… = you’re standing there now.",
      "softExplain": "Read the English line. Pick the Italian that says the same thing.",
      "prove": {
        "choices": [
          "You were at her town overlook",
          "You’re at her town overlook now"
        ],
        "correct": 1,
        "miss": "You’re there live."
      },
      "hook": false,
      "lockIn": {
        "it": "il belvedere",
        "en": "scenic overlook / viewpoint"
      }
    },
    {
      "id": "c1-13",
      "level": 1,
      "region": "Amalfi",
      "image": "images/places/amalfi-1.jpg",
      "culture": "Amalfi · group pic",
      "prompt": "He’s smiling for the photo in Amalfi right now.",
      "gloss": "right now",
      "person": "lui",
      "captions": [
        "Sorride per la foto ad Amalfi",
        "Sorrideva sempre nelle foto ad Amalfi"
      ],
      "correct": 0,
      "why": [
        "",
        "That one is how he used to smile in pics. English is now."
      ],
      "help": "Match his live smile. sorride = he’s smiling.",
      "explain": "Sorride… = smile happening now.",
      "softExplain": "Read the English line. Pick the Italian that says the same thing.",
      "prove": {
        "choices": [
          "He used to smile in photos",
          "He’s smiling for the photo now"
        ],
        "correct": 1,
        "miss": "Live smile."
      },
      "hook": true,
      "lockIn": {
        "it": "sorride",
        "en": "he/she is smiling"
      }
    },
    {
      "id": "c1-11",
      "level": 1,
      "region": "Monte di Procida",
      "image": "images/hometown/scogli-golfo.jpg",
      "culture": "Monte · the teacher’s gelato memory",
      "prompt": "On the seafront our teacher always used to get a gelato while watching the gulf.",
      "gloss": "used to",
      "person": "lei",
      "captions": [
        "Sul lungomare la prof prende sempre un gelato guardando il golfo",
        "Sul lungomare la prof prendeva sempre un gelato guardando il golfo"
      ],
      "correct": 1,
      "why": [
        "That one is her habit today. English looks back.",
        ""
      ],
      "help": "Match her old gelato habit. prendeva = she used to get.",
      "explain": "prendeva sempre… = how gelato stops used to go.",
      "softExplain": "Read the English line. Pick the Italian that says the same thing.",
      "prove": {
        "choices": [
          "She used to get gelato by the sea",
          "She gets gelato by the sea today"
        ],
        "correct": 0,
        "miss": "Old gelato loop."
      },
      "hook": false,
      "lockIn": {
        "it": "prendeva un gelato",
        "en": "she used to get a gelato"
      }
    },
    {
      "id": "c1-04",
      "level": 1,
      "region": "Capri",
      "image": "images/places/capri-piazzetta.jpg",
      "culture": "Capri · the Piazzetta",
      "prompt": "Every summer I used to have a granita in the Piazzetta.",
      "gloss": "used to",
      "person": "io",
      "captions": [
        "Ogni estate prendevo una granita in Piazzetta",
        "Ogni estate prendo una granita in Piazzetta"
      ],
      "correct": 0,
      "why": [
        "",
        "That one is your summer habit now. English looks back."
      ],
      "help": "Match the old summer habit. la Piazzetta = Capri’s little main square.",
      "explain": "prendevo = I used to get — a past-scene habit.",
      "softExplain": "Read the English line. Pick the Italian that says the same thing.",
      "prove": {
        "choices": [
          "I used to get a granita there",
          "I get a granita there now"
        ],
        "correct": 0,
        "miss": "Old summers."
      },
      "hook": false,
      "lockIn": {
        "it": "in Piazzetta",
        "en": "in Capri’s main square"
      }
    },
    {
      "id": "c1-14",
      "level": 1,
      "region": "Procida",
      "image": "images/places/procida-2.jpg",
      "culture": "Procida · harbor tonight",
      "prompt": "We’re at the harbor in Procida watching the colors and chatting.",
      "gloss": "right now",
      "person": "noi",
      "captions": [
        "Eravamo al porto di Procida, guardavamo i colori e chiacchieravamo",
        "Siamo al porto di Procida, guardiamo i colori e chiacchieriamo"
      ],
      "correct": 1,
      "why": [
        "That one is a past evening. English is live.",
        ""
      ],
      "help": "Match the live harbor moment. chiacchieriamo = we’re chatting.",
      "explain": "Siamo… guardiamo… chiacchieriamo = all happening now.",
      "softExplain": "Read the English line. Pick the Italian that says the same thing.",
      "prove": {
        "choices": [
          "We used to sit at the harbor",
          "We’re at the harbor now"
        ],
        "correct": 1,
        "miss": "Live evening."
      },
      "hook": false,
      "lockIn": {
        "it": "chiacchieriamo",
        "en": "we’re chatting"
      }
    },
    {
      "id": "c1-12",
      "level": 1,
      "region": "Ischia",
      "image": "images/places/ischia-1.jpg",
      "culture": "Ischia · ferry memories",
      "prompt": "In Ischia you always used to wait for the ferry at the harbor bar.",
      "gloss": "used to",
      "person": "tu",
      "captions": [
        "A Ischia aspetti sempre il traghetto al bar del porto",
        "A Ischia aspettavi sempre il traghetto al bar del porto"
      ],
      "correct": 1,
      "why": [
        "That one is how you wait today. English looks back.",
        ""
      ],
      "help": "Match the old waiting habit. il traghetto = the ferry.",
      "explain": "aspettavi sempre… = how waiting used to go.",
      "softExplain": "Read the English line. Pick the Italian that says the same thing.",
      "prove": {
        "choices": [
          "You used to wait for the ferry there",
          "You wait for the ferry there now"
        ],
        "correct": 0,
        "miss": "Old habit."
      },
      "hook": false,
      "lockIn": {
        "it": "il traghetto",
        "en": "the ferry"
      }
    },
    {
      "id": "c1-16",
      "level": 1,
      "region": "Bonus 🎶",
      "image": "images/bonus/sara-perche-ti-amo.jpg",
      "song": {
        "trackId": 311429581,
        "title": "Sarà perché ti amo",
        "artist": "Ricchi e Poveri",
        "year": 1981,
        "recording": "Ricchi e Poveri’s own later recording (Apple Music album “Ricchi E Poveri - Grandi Successi”, ℗ 1997); the 1981 master’s preview has no title line",
        "preview": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/6c/04/47/6c04478e-e910-ed78-66c4-bac183383546/mzaf_336326340722790076.plus.aac.p.m4a",
        "view": "https://music.apple.com/it/album/sara-perche-ti-amo/311429533?i=311429581",
        "lineStart": 10.1,
        "lineEnd": 24.2
      },
      "culture": "Bonus · a 1981 Sanremo classic to sing along to",
      "prompt": "We’re all singing ‘Sarà perché ti amo’ together right now!",
      "gloss": "right now",
      "person": "noi",
      "captions": [
        "Cantiamo tutti insieme «Sarà perché ti amo»!",
        "Cantavamo sempre tutti insieme «Sarà perché ti amo»"
      ],
      "correct": 0,
      "why": [
        "",
        "That one is how it used to go. English is right now."
      ],
      "help": "Tap ▶ to hear the chorus (sound on), then pick. No sound? Just read and pick. cantiamo = we sing / we’re singing. insieme = together.",
      "explain": "Cantiamo tutti insieme… = we’re singing together right now — live.",
      "softExplain": "Read the English line. Pick the Italian that says the same thing.",
      "prove": {
        "choices": [
          "We used to sing it together",
          "We’re singing it together now"
        ],
        "correct": 1,
        "miss": "Live sing-along = now."
      },
      "hook": true,
      "lockIn": {
        "it": "cantiamo insieme",
        "en": "we sing / we’re singing together"
      }
    },
    {
      "id": "c2-01",
      "level": 2,
      "region": "Tropea",
      "image": "images/places/tropea-1.jpg",
      "video": "videos/tropea-isola-giorno.mp4",
      "culture": "Tropea · Santa Maria dell’Isola",
      "prompt": "We’re in Tropea right now and the sea looks insane today 💙",
      "gloss": "right now",
      "person": "noi",
      "captions": [
        "Siamo a Tropea e oggi il mare è pazzesco 💙",
        "Eravamo a Tropea e il mare era pazzesco"
      ],
      "correct": 0,
      "why": [
        "",
        "That one is a past beach day. English is today."
      ],
      "help": "Match live from the sand. il mare = the sea.",
      "explain": "Siamo… oggi il mare è… = there now, sea today.",
      "softExplain": "Read the English line. Pick the Italian that says the same thing.",
      "prove": {
        "choices": [
          "We used to be there",
          "We’re there today"
        ],
        "correct": 1,
        "miss": "Today = present."
      },
      "hook": false,
      "lockIn": {
        "it": "il mare",
        "en": "the sea"
      }
    },
    {
      "id": "c2-08",
      "level": 2,
      "region": "Palermo",
      "image": "images/places/palermo-1.jpg",
      "video": "videos/palermo-cattedrale.mp4",
      "culture": "Palermo · panelle by the Cattedrale",
      "prompt": "Luca is eating panelle in front of the Cathedral — wait for him!",
      "gloss": "right now",
      "person": "lui",
      "captions": [
        "Luca mangiava sempre le panelle davanti alla Cattedrale",
        "Luca mangia le panelle davanti alla Cattedrale, aspettalo!"
      ],
      "correct": 1,
      "why": [
        "That one is Luca’s old habit. English is now.",
        ""
      ],
      "help": "Match Luca eating now. le panelle = chickpea fritters (Palermo street food).",
      "explain": "Luca mangia… aspettalo! = eating right now.",
      "softExplain": "Read the English line. Pick the Italian that says the same thing.",
      "prove": {
        "choices": [
          "Luca is eating panelle now",
          "Luca used to eat panelle there"
        ],
        "correct": 0,
        "miss": "Mid-bite = present."
      },
      "hook": false,
      "lockIn": {
        "it": "le panelle",
        "en": "chickpea fritters (Palermo)"
      }
    },
    {
      "id": "c2-02",
      "level": 2,
      "region": "Polignano",
      "image": "images/people/polignano-lama-sera.jpg",
      "culture": "Polignano · August nights",
      "prompt": "Every August evening you used to jump in and then get a gelato.",
      "gloss": "used to",
      "person": "tu",
      "captions": [
        "Ogni sera d’agosto ti tuffi e poi prendi un gelato",
        "Ogni sera d’agosto ti tuffavi e poi prendevi un gelato"
      ],
      "correct": 1,
      "why": [
        "That one is this August. English looks back.",
        ""
      ],
      "help": "Match the old August habit. ti tuffavi = you used to dive / jump in.",
      "explain": "ti tuffavi… prendevi = how August nights used to go.",
      "softExplain": "Read the English line. Pick the Italian that says the same thing.",
      "prove": {
        "choices": [
          "You used to dive, then get gelato",
          "You dive, then get gelato now"
        ],
        "correct": 0,
        "miss": "Old August loop."
      },
      "hook": false,
      "lockIn": {
        "it": "ti tuffavi",
        "en": "you used to dive / jump in"
      }
    },
    {
      "id": "c2-12",
      "level": 2,
      "region": "Matera",
      "image": "images/people/matera-sassi-ragazza.jpg",
      "culture": "Matera · first look at the Sassi",
      "prompt": "I’m looking at the Sassi and I’m speechless.",
      "gloss": "right now",
      "person": "io",
      "captions": [
        "Guardo i Sassi e resto senza parole",
        "Guardavo i Sassi e restavo senza parole"
      ],
      "correct": 0,
      "why": [
        "",
        "That one is a past visit. English is now."
      ],
      "help": "Match your live reaction. senza parole = speechless.",
      "explain": "Guardo… resto… = happening now.",
      "softExplain": "Read the English line. Pick the Italian that says the same thing.",
      "prove": {
        "choices": [
          "I used to look at the Sassi",
          "I’m looking at the Sassi now"
        ],
        "correct": 1,
        "miss": "Live look."
      },
      "hook": true,
      "lockIn": {
        "it": "senza parole",
        "en": "speechless"
      }
    },
    {
      "id": "c2-07",
      "level": 2,
      "region": "Lecce",
      "image": "images/places/lecce-duomo-notte.jpg",
      "culture": "Lecce · evening lights",
      "prompt": "In the evening we always used to see the lights on the baroque buildings.",
      "gloss": "used to",
      "person": "noi",
      "captions": [
        "La sera vediamo sempre le luci sui palazzi barocchi",
        "La sera vedevamo sempre le luci sui palazzi barocchi"
      ],
      "correct": 1,
      "why": [
        "That one is tonight. English looks back.",
        ""
      ],
      "help": "Match the old evening lights. i palazzi barocchi = baroque buildings.",
      "explain": "vedevamo sempre… = how evenings used to look.",
      "softExplain": "Read the English line. Pick the Italian that says the same thing.",
      "prove": {
        "choices": [
          "We see the lights every evening now",
          "We used to see the lights every evening"
        ],
        "correct": 1,
        "miss": "Used-to evenings."
      },
      "hook": false,
      "lockIn": {
        "it": "i palazzi barocchi",
        "en": "the baroque buildings"
      }
    },
    {
      "id": "c2-06",
      "level": 2,
      "region": "Polignano",
      "image": "images/places/polignano-2.jpg",
      "culture": "Polignano · cliff laughs",
      "prompt": "On the cliffs she always used to laugh with her friends.",
      "gloss": "used to",
      "person": "lei",
      "captions": [
        "Sulla scogliera rideva sempre con le amiche",
        "Sulla scogliera ride sempre con le amiche"
      ],
      "correct": 0,
      "why": [
        "",
        "That one is how she laughs today. English looks back."
      ],
      "help": "Match how she used to laugh. la scogliera = the cliff.",
      "explain": "rideva sempre… = old cliff laughs.",
      "softExplain": "Read the English line. Pick the Italian that says the same thing.",
      "prove": {
        "choices": [
          "She used to laugh on the cliffs",
          "She laughs on the cliffs today"
        ],
        "correct": 0,
        "miss": "Used-to laugh."
      },
      "hook": true,
      "lockIn": {
        "it": "la scogliera",
        "en": "the cliff / rocky shore"
      }
    },
    {
      "id": "c2-05",
      "level": 2,
      "region": "Alberobello",
      "image": "images/people/alberobello-passeggiata.jpg",
      "culture": "Alberobello · trulli stroll",
      "prompt": "You’re walking around the trulli — classic!",
      "gloss": "right now",
      "person": "tu",
      "captions": [
        "Fai un giro tra i trulli, classico!",
        "Facevi sempre un giro tra i trulli"
      ],
      "correct": 0,
      "why": [
        "",
        "That one is a past stroll. English is now."
      ],
      "help": "Match you doing it live. i trulli = cone-roofed houses.",
      "explain": "Fai un giro… = you’re doing it now.",
      "softExplain": "Read the English line. Pick the Italian that says the same thing.",
      "prove": {
        "choices": [
          "You used to wander around the trulli",
          "You’re wandering around the trulli now"
        ],
        "correct": 1,
        "miss": "Right now = present."
      },
      "hook": false,
      "lockIn": {
        "it": "fare un giro",
        "en": "to go for a stroll"
      }
    },
    {
      "id": "c2-10",
      "level": 2,
      "region": "Palermo",
      "image": "images/places/palermo-ballaro.jpg",
      "culture": "Palermo · Ballarò market",
      "prompt": "At Ballarò I always used to grab panelle on the go.",
      "gloss": "used to",
      "person": "io",
      "captions": [
        "A Ballarò prendo sempre le panelle al volo",
        "A Ballarò prendevo sempre le panelle al volo"
      ],
      "correct": 1,
      "why": [
        "That one is your habit today. English looks back.",
        ""
      ],
      "help": "Match the old market habit. al volo = on the go / quickly.",
      "explain": "prendevo sempre… = how market runs used to go.",
      "softExplain": "Read the English line. Pick the Italian that says the same thing.",
      "prove": {
        "choices": [
          "I used to grab panelle there",
          "I grab panelle there now"
        ],
        "correct": 0,
        "miss": "Old market runs."
      },
      "hook": false,
      "lockIn": {
        "it": "al volo",
        "en": "on the go / quickly"
      }
    },
    {
      "id": "c2-09",
      "level": 2,
      "region": "Ortigia",
      "image": "images/places/ortigia-2.jpg",
      "culture": "Ortigia · gelato invite in Piazza Duomo",
      "prompt": "Sofia asks: “Want to get a gelato?”",
      "gloss": "right now",
      "person": "lei",
      "captions": [
        "Sofia chiedeva sempre: “Ti va un gelato?”",
        "Sofia chiede: “Ti va un gelato?”"
      ],
      "correct": 1,
      "why": [
        "That one is how she always used to ask. English is live.",
        ""
      ],
      "help": "Match Sofia asking live. Ti va…? = Do you feel like…? / Want…?",
      "explain": "Sofia chiede… = invitation happening now.",
      "softExplain": "Read the English line. Pick the Italian that says the same thing.",
      "prove": {
        "choices": [
          "She’s inviting you now",
          "She used to invite you"
        ],
        "correct": 0,
        "miss": "Live invite."
      },
      "hook": false,
      "lockIn": {
        "it": "Ti va…?",
        "en": "Want…? / Feel like…?"
      }
    },
    {
      "id": "c2-04",
      "level": 2,
      "region": "Matera",
      "image": "images/places/matera-1.jpg",
      "culture": "Matera · dusk memory",
      "prompt": "In Matera in the evening we used to walk quietly among the Sassi.",
      "gloss": "used to",
      "person": "noi",
      "captions": [
        "A Matera la sera camminavamo in silenzio tra i Sassi",
        "A Matera la sera camminiamo in silenzio tra i Sassi"
      ],
      "correct": 0,
      "why": [
        "",
        "That one is tonight’s walk. English looks back."
      ],
      "help": "Match the old evening walks. i Sassi = Matera’s cave-house neighborhoods.",
      "explain": "camminavamo… = how evenings used to feel.",
      "softExplain": "Read the English line. Pick the Italian that says the same thing.",
      "prove": {
        "choices": [
          "We walk there now",
          "We used to walk there in the evenings"
        ],
        "correct": 1,
        "miss": "“Used to” = past-scene form."
      },
      "hook": false,
      "lockIn": {
        "it": "i Sassi",
        "en": "Matera’s cave-house neighborhoods"
      }
    },
    {
      "id": "c2-03",
      "level": 2,
      "region": "Tropea",
      "image": "images/places/tropea-spiaggia.jpg",
      "culture": "Tropea · packed beach",
      "prompt": "I’m at the beach in Tropea and there are so many people!",
      "gloss": "right now",
      "person": "io",
      "captions": [
        "Andavo sempre in spiaggia a Tropea e c’era un sacco di gente",
        "Sono in spiaggia a Tropea e c’è un sacco di gente!"
      ],
      "correct": 1,
      "why": [
        "That one is how beach days used to be. English is now.",
        ""
      ],
      "help": "Match what you see now. c’è un sacco di gente = there are loads of people.",
      "explain": "Sono… c’è… = it’s happening now.",
      "softExplain": "Read the English line. Pick the Italian that says the same thing.",
      "prove": {
        "choices": [
          "I’m on the beach now",
          "I used to go to that beach"
        ],
        "correct": 0,
        "miss": "Live beach."
      },
      "hook": true,
      "lockIn": {
        "it": "c’è un sacco di gente",
        "en": "there are loads of people"
      }
    },
    {
      "id": "c2-14",
      "level": 2,
      "region": "Ortigia",
      "image": "images/places/ortigia-fonte-aretusa.jpg",
      "culture": "Ortigia · yes to gelato",
      "prompt": "You answer: “Yes, I really feel like a gelato.”",
      "gloss": "right now",
      "person": "tu",
      "captions": [
        "Rispondi: “Sì, mi va proprio un gelato”",
        "Rispondevi sempre: “Sì, mi va un gelato”"
      ],
      "correct": 0,
      "why": [
        "",
        "That one is how you always used to answer. English is live."
      ],
      "help": "Match your live reply. mi va = I feel like it.",
      "explain": "Rispondi… mi va… = answering now.",
      "softExplain": "Read the English line. Pick the Italian that says the same thing.",
      "prove": {
        "choices": [
          "You always used to say yes",
          "You’re saying yes now"
        ],
        "correct": 1,
        "miss": "Live reply."
      },
      "hook": false,
      "lockIn": {
        "it": "mi va…",
        "en": "I feel like…"
      }
    },
    {
      "id": "c2-13",
      "level": 2,
      "region": "Alberobello",
      "image": "images/places/alberobello-rione-monti.jpg",
      "video": "videos/alberobello-trulli.mp4",
      "culture": "Alberobello · sister’s photos",
      "prompt": "My sister always used to take pictures of the trulli.",
      "gloss": "used to",
      "person": "lei",
      "captions": [
        "Mia sorella faceva sempre foto ai trulli",
        "Mia sorella fa sempre foto ai trulli"
      ],
      "correct": 0,
      "why": [
        "",
        "That one is what she does now. English looks back."
      ],
      "help": "Match your sister’s old habit. fare foto = to take pictures.",
      "explain": "faceva sempre… = she always used to.",
      "softExplain": "Read the English line. Pick the Italian that says the same thing.",
      "prove": {
        "choices": [
          "She takes trulli pics now",
          "She used to take trulli pics"
        ],
        "correct": 1,
        "miss": "Old habit."
      },
      "hook": false,
      "lockIn": {
        "it": "fare foto",
        "en": "to take pictures"
      }
    },
    {
      "id": "c2-15",
      "level": 2,
      "region": "Lecce",
      "image": "images/places/lecce-2.jpg",
      "culture": "Lecce · Santa Croce",
      "prompt": "I’m taking pictures in front of Santa Croce right now.",
      "gloss": "right now",
      "person": "io",
      "captions": [
        "Facevo sempre foto davanti a Santa Croce",
        "Faccio foto davanti a Santa Croce"
      ],
      "correct": 1,
      "why": [
        "That one is an old habit. English is now.",
        ""
      ],
      "help": "Match what you’re doing live. davanti a = in front of.",
      "explain": "Faccio foto… = happening now.",
      "softExplain": "Read the English line. Pick the Italian that says the same thing.",
      "prove": {
        "choices": [
          "I’m taking pictures now",
          "I used to take pictures there"
        ],
        "correct": 0,
        "miss": "Live pics."
      },
      "hook": true,
      "lockIn": {
        "it": "davanti a",
        "en": "in front of"
      }
    },
    {
      "id": "c2-11",
      "level": 2,
      "region": "Sperlonga",
      "image": "images/places/sperlonga-spiaggia.jpg",
      "culture": "Sperlonga · beach habit",
      "prompt": "After the beach we always used to get a gelato on the sand.",
      "gloss": "used to",
      "person": "noi",
      "captions": [
        "Dopo il mare prendevamo sempre un gelato sulla spiaggia",
        "Dopo il mare prendiamo sempre un gelato sulla spiaggia"
      ],
      "correct": 0,
      "why": [
        "",
        "That one is today’s ending. English looks back."
      ],
      "help": "Match the old beach-day ending. dopo il mare = after the beach.",
      "explain": "prendevamo sempre… = how beach days used to end.",
      "softExplain": "Read the English line. Pick the Italian that says the same thing.",
      "prove": {
        "choices": [
          "We get gelato after the sea today",
          "We used to get gelato after the sea"
        ],
        "correct": 1,
        "miss": "Old beach ending."
      },
      "hook": false,
      "lockIn": {
        "it": "dopo il mare",
        "en": "after the beach"
      }
    },
    {
      "id": "c3-02",
      "level": 3,
      "region": "Genova",
      "image": "images/places/genova-1.jpg",
      "video": "videos/genova-porto-antico.mp4",
      "culture": "Genova · focaccia dash",
      "prompt": "Grab a focaccia and run to the harbor!",
      "gloss": "right now",
      "person": "tu",
      "captions": [
        "Prendevi sempre una focaccia e correvi al porto",
        "Prendi una focaccia e corri al porto!"
      ],
      "correct": 1,
      "why": [
        "That one is what you used to do. English is now.",
        ""
      ],
      "help": "Match telling a friend live. la focaccia = Ligurian flatbread.",
      "explain": "Prendi… corri… = do it now.",
      "softExplain": "Read the English line. Pick the Italian that says the same thing.",
      "prove": {
        "choices": [
          "Grab it now",
          "You used to grab focaccia"
        ],
        "correct": 0,
        "miss": "Live order."
      },
      "hook": false,
      "lockIn": {
        "it": "la focaccia",
        "en": "focaccia (Liguria flatbread)"
      }
    },
    {
      "id": "c3-01",
      "level": 3,
      "region": "Bologna",
      "image": "images/places/bologna-portici.jpg",
      "culture": "Bologna · after school",
      "prompt": "After school we always used to go under the portici to grab something to eat.",
      "gloss": "used to",
      "person": "noi",
      "captions": [
        "Dopo scuola andavamo sempre sotto i portici a mangiare qualcosa",
        "Dopo scuola andiamo sempre sotto i portici a mangiare qualcosa"
      ],
      "correct": 0,
      "why": [
        "",
        "That one is today’s plan. English looks back."
      ],
      "help": "Match the old after-school habit. i portici = covered walkways / arcades.",
      "explain": "andavamo sempre… = how afternoons used to go.",
      "softExplain": "Read the English line. Pick the Italian that says the same thing.",
      "prove": {
        "choices": [
          "We go under the arches today",
          "We used to go under the arches"
        ],
        "correct": 1,
        "miss": "Old loop = past-scene form."
      },
      "hook": false,
      "lockIn": {
        "it": "i portici",
        "en": "covered walkways / arcades"
      }
    },
    {
      "id": "c3-03",
      "level": 3,
      "region": "Braies",
      "image": "images/people/braies-barca-ragazza.jpg",
      "culture": "Braies · quiet mornings",
      "prompt": "I used to go to the lake early and stay quiet.",
      "gloss": "used to",
      "person": "io",
      "captions": [
        "Vado al lago presto e resto in silenzio",
        "Andavo al lago presto e restavo in silenzio"
      ],
      "correct": 1,
      "why": [
        "That one is today’s plan. English looks back.",
        ""
      ],
      "help": "Match the old lake mornings. il lago = the lake.",
      "explain": "andavo… restavo… = how mornings used to go.",
      "softExplain": "Read the English line. Pick the Italian that says the same thing.",
      "prove": {
        "choices": [
          "I go early and stay quiet today",
          "I used to go early and stay quiet"
        ],
        "correct": 1,
        "miss": "Old mornings."
      },
      "hook": false,
      "lockIn": {
        "it": "il lago",
        "en": "the lake"
      }
    },
    {
      "id": "c3-12",
      "level": 3,
      "region": "Roma",
      "image": "images/places/roma-ferrari-colosseo.jpg",
      "culture": "Roma · rosso spot",
      "prompt": "Do you see that red Ferrari in front of the Colosseum? It’s incredible!",
      "gloss": "right now",
      "person": "tu",
      "captions": [
        "Vedevi sempre quella Ferrari rossa davanti al Colosseo?",
        "Vedi quella Ferrari rossa davanti al Colosseo? È incredibile!"
      ],
      "correct": 1,
      "why": [
        "That one asks what you used to see. English is now.",
        ""
      ],
      "help": "Match pointing it out live. Vedi…? = Do you see…?",
      "explain": "Vedi…? È incredibile = spotting it now.",
      "softExplain": "Read the English line. Pick the Italian that says the same thing.",
      "prove": {
        "choices": [
          "You see the Ferrari now",
          "You used to see that Ferrari"
        ],
        "correct": 0,
        "miss": "Live spot."
      },
      "hook": true,
      "lockIn": {
        "it": "È incredibile!",
        "en": "It’s incredible!"
      }
    },
    {
      "id": "c3-05",
      "level": 3,
      "region": "Bologna",
      "image": "images/places/bologna-portici-farini.jpg",
      "culture": "Bologna · portici laughs",
      "prompt": "She’s laughing with her friends under the portici right now.",
      "gloss": "right now",
      "person": "lei",
      "captions": [
        "Ride con le amiche sotto i portici",
        "Rideva sempre con le amiche sotto i portici"
      ],
      "correct": 0,
      "why": [
        "",
        "That one is how she used to laugh. English is now."
      ],
      "help": "Match her live laugh. ride = she’s laughing.",
      "explain": "Ride… = laugh happening now.",
      "softExplain": "Read the English line. Pick the Italian that says the same thing.",
      "prove": {
        "choices": [
          "She used to laugh under the arches",
          "She’s laughing under the arches now"
        ],
        "correct": 1,
        "miss": "Live laugh."
      },
      "hook": true,
      "lockIn": {
        "it": "ride",
        "en": "he/she laughs / is laughing"
      }
    },
    {
      "id": "c3-04",
      "level": 3,
      "region": "Torino",
      "image": "images/places/torino-murazzi.jpg",
      "culture": "Torino · evening in centro",
      "prompt": "In the evening we always used to hang out downtown eating gianduiotti.",
      "gloss": "used to",
      "person": "noi",
      "captions": [
        "La sera stavamo sempre in centro a mangiare gianduiotti",
        "La sera stiamo sempre in centro a mangiare gianduiotti"
      ],
      "correct": 0,
      "why": [
        "",
        "That one is tonight’s habit. English looks back."
      ],
      "help": "Match the old evening vibe. i gianduiotti = gianduja chocolates.",
      "explain": "stavamo sempre… = how evenings used to feel.",
      "softExplain": "Read the English line. Pick the Italian that says the same thing.",
      "prove": {
        "choices": [
          "We used to hang downtown with chocolate",
          "We hang downtown with chocolate now"
        ],
        "correct": 0,
        "miss": "Used-to evenings."
      },
      "hook": false,
      "lockIn": {
        "it": "i gianduiotti",
        "en": "gianduja chocolates (Torino)"
      }
    },
    {
      "id": "c3-13",
      "level": 3,
      "region": "Bologna",
      "image": "images/places/bologna-2.jpg",
      "culture": "Bologna · tortellini to go",
      "prompt": "I’m getting tortellini to go — be right there!",
      "gloss": "right now",
      "person": "io",
      "captions": [
        "Prendevo sempre i tortellini da asporto",
        "Prendo i tortellini da asporto e arrivo!"
      ],
      "correct": 1,
      "why": [
        "That one is an old lunch habit. English is now.",
        ""
      ],
      "help": "Match ordering live. da asporto = to go / takeaway.",
      "explain": "Prendo… e arrivo = ordering now.",
      "softExplain": "Read the English line. Pick the Italian that says the same thing.",
      "prove": {
        "choices": [
          "I’m grabbing tortellini now",
          "I used to grab tortellini"
        ],
        "correct": 0,
        "miss": "Live order."
      },
      "hook": false,
      "lockIn": {
        "it": "da asporto",
        "en": "to go / takeaway"
      }
    },
    {
      "id": "c3-07",
      "level": 3,
      "region": "Ravenna",
      "image": "images/places/ravenna-1.jpg",
      "culture": "Ravenna · after the mosaics",
      "prompt": "After the mosaics, my aunt always used to buy us a piadina in the piazza.",
      "gloss": "used to",
      "person": "lei",
      "captions": [
        "Dopo i mosaici la zia ci comprava sempre una piadina in piazza",
        "Dopo i mosaici la zia ci compra sempre una piadina in piazza"
      ],
      "correct": 0,
      "why": [
        "",
        "That one is what she does today. English looks back."
      ],
      "help": "Match the old afternoon habit. in piazza = in the square.",
      "explain": "ci comprava sempre… = how afternoons used to go.",
      "softExplain": "Read the English line. Pick the Italian that says the same thing.",
      "prove": {
        "choices": [
          "She buys us piadina today",
          "She used to buy us piadina"
        ],
        "correct": 1,
        "miss": "Old snack loop."
      },
      "hook": false,
      "lockIn": {
        "it": "in piazza",
        "en": "in the square"
      }
    },
    {
      "id": "c3-11",
      "level": 3,
      "region": "Chioggia",
      "image": "images/places/chioggia-2.jpg",
      "culture": "Chioggia · canal evenings",
      "prompt": "In the evening you used to walk along the canals without rushing.",
      "gloss": "used to",
      "person": "tu",
      "captions": [
        "La sera cammini lungo i canali senza fretta",
        "La sera camminavi lungo i canali senza fretta"
      ],
      "correct": 1,
      "why": [
        "That one is tonight’s walk. English looks back.",
        ""
      ],
      "help": "Match the old canal evenings. senza fretta = without rushing.",
      "explain": "camminavi senza fretta = how evenings used to feel.",
      "softExplain": "Read the English line. Pick the Italian that says the same thing.",
      "prove": {
        "choices": [
          "You used to walk the canals slowly",
          "You walk the canals slowly tonight"
        ],
        "correct": 0,
        "miss": "Old evenings."
      },
      "hook": false,
      "lockIn": {
        "it": "senza fretta",
        "en": "without rushing / in no hurry"
      }
    },
    {
      "id": "c3-10",
      "level": 3,
      "region": "Braies",
      "image": "images/places/braies-barche.jpg",
      "video": "videos/braies-lago.mp4",
      "culture": "Braies · lake quiet now",
      "prompt": "We’re at the lake right now and staying quiet.",
      "gloss": "right now",
      "person": "noi",
      "captions": [
        "Eravamo al lago e stavamo in silenzio",
        "Siamo al lago e stiamo in silenzio"
      ],
      "correct": 1,
      "why": [
        "That one is a past quiet scene. English is now.",
        ""
      ],
      "help": "Match being there live. stiamo in silenzio = we’re staying quiet.",
      "explain": "Siamo… stiamo… = there now.",
      "softExplain": "Read the English line. Pick the Italian that says the same thing.",
      "prove": {
        "choices": [
          "We used to stay quiet at the lake",
          "We’re at the lake now"
        ],
        "correct": 1,
        "miss": "Live lake."
      },
      "hook": false,
      "lockIn": {
        "it": "stiamo in silenzio",
        "en": "we’re staying quiet"
      }
    },
    {
      "id": "c3-08",
      "level": 3,
      "region": "Genova",
      "image": "images/places/genova-2.jpg",
      "culture": "Genova · port mornings",
      "prompt": "At the harbor I always used to get a warm focaccia.",
      "gloss": "used to",
      "person": "io",
      "captions": [
        "Al porto prendevo sempre una focaccia calda",
        "Al porto prendo sempre una focaccia calda"
      ],
      "correct": 0,
      "why": [
        "",
        "That one is today’s order. English looks back."
      ],
      "help": "Match the old morning habit. focaccia calda = warm focaccia.",
      "explain": "prendevo sempre… = how mornings used to start.",
      "softExplain": "Read the English line. Pick the Italian that says the same thing.",
      "prove": {
        "choices": [
          "I grab warm focaccia today",
          "I used to grab warm focaccia"
        ],
        "correct": 1,
        "miss": "Old mornings."
      },
      "hook": false,
      "lockIn": {
        "it": "focaccia calda",
        "en": "warm focaccia"
      }
    },
    {
      "id": "c3-14",
      "level": 3,
      "region": "Torino",
      "image": "images/places/torino-2.jpg",
      "culture": "Torino · Piazza San Carlo portici",
      "prompt": "You’re strolling under the portici eating a gianduiotto.",
      "gloss": "right now",
      "person": "tu",
      "captions": [
        "Passeggi sotto i portici e mangi un gianduiotto",
        "Passeggiavi sempre sotto i portici e mangiavi un gianduiotto"
      ],
      "correct": 0,
      "why": [
        "",
        "That one is how walks used to go. English is now."
      ],
      "help": "Match you doing it live. sotto i portici = under the arcades.",
      "explain": "Passeggi… mangi… = you’re doing it now.",
      "softExplain": "Read the English line. Pick the Italian that says the same thing.",
      "prove": {
        "choices": [
          "You’re strolling the arches now",
          "You used to stroll the arches"
        ],
        "correct": 0,
        "miss": "Live stroll."
      },
      "hook": false,
      "lockIn": {
        "it": "sotto i portici",
        "en": "under the arcades"
      }
    },
    {
      "id": "c3-06",
      "level": 3,
      "region": "Chioggia",
      "image": "images/places/chioggia-1.jpg",
      "culture": "Chioggia · market run",
      "prompt": "Luca is going to the market to buy fresh fish right now.",
      "gloss": "right now",
      "person": "lui",
      "captions": [
        "Luca andava sempre al mercato a comprare il pesce fresco",
        "Luca va al mercato a comprare il pesce fresco"
      ],
      "correct": 1,
      "why": [
        "That one is what Luca used to do. English is now.",
        ""
      ],
      "help": "Match Luca live. il mercato = the market; il pesce fresco = fresh fish.",
      "explain": "Luca va… = happening now.",
      "softExplain": "Read the English line. Pick the Italian that says the same thing.",
      "prove": {
        "choices": [
          "Luca used to go",
          "Luca is going now"
        ],
        "correct": 1,
        "miss": "He’s going live."
      },
      "hook": false,
      "lockIn": {
        "it": "il pesce fresco",
        "en": "fresh fish"
      }
    },
    {
      "id": "c3-15",
      "level": 3,
      "region": "Ravenna",
      "image": "images/places/ravenna-2.jpg",
      "culture": "Ravenna · museum mornings",
      "prompt": "In the morning we used to look at the mosaics in silence.",
      "gloss": "used to",
      "person": "noi",
      "captions": [
        "Al mattino guardavamo i mosaici in silenzio",
        "Al mattino guardiamo i mosaici in silenzio"
      ],
      "correct": 0,
      "why": [
        "",
        "That one is today’s visit. English looks back."
      ],
      "help": "Match the old quiet mornings. i mosaici = the mosaics.",
      "explain": "guardavamo… in silenzio = how mornings used to feel.",
      "softExplain": "Read the English line. Pick the Italian that says the same thing.",
      "prove": {
        "choices": [
          "We look at mosaics quietly today",
          "We used to look at mosaics quietly"
        ],
        "correct": 1,
        "miss": "Old mornings."
      },
      "hook": false,
      "lockIn": {
        "it": "i mosaici",
        "en": "the mosaics"
      }
    },
    {
      "id": "c3-09",
      "level": 3,
      "region": "Torino",
      "image": "images/places/torino-1.jpg",
      "video": "videos/torino-mole.mp4",
      "culture": "Torino · Saturdays at the Mole",
      "prompt": "Every Saturday my dad used to take me to the Mole.",
      "gloss": "used to",
      "person": "lui",
      "captions": [
        "Ogni sabato mio padre mi porta alla Mole",
        "Ogni sabato mio padre mi portava alla Mole"
      ],
      "correct": 1,
      "why": [
        "That one is what he does now. English looks back.",
        ""
      ],
      "help": "Match the old Saturday habit. mi portava = he used to take me.",
      "explain": "mi portava… = a past-scene habit.",
      "softExplain": "Read the English line. Pick the Italian that says the same thing.",
      "prove": {
        "choices": [
          "Dad used to take me",
          "Dad takes me now"
        ],
        "correct": 0,
        "miss": "Old Saturdays."
      },
      "hook": false,
      "lockIn": {
        "it": "mi portava",
        "en": "he/she used to take me"
      }
    }
  ]
};
