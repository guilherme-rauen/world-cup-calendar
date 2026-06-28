// Generates docs/fifa-world-cup-2026.ics — FIFA World Cup 2026 subscription calendar.
// Source kickoff times are US Eastern (ET). June/July 2026 ET = EDT = UTC-4,
// so UTC = ET + 4h. We build each Date in UTC by adding 4 to the ET hour and
// let Date normalize day/month rollovers. Events stored in UTC (Z) so every
// subscriber's phone localizes automatically.

const { ANNEX_C_WINNERS, ANNEX_C_ROWS } = require("./annex-c");

const FLAGS = {
  Mexico: "🇲🇽",
  "South Africa": "🇿🇦",
  "South Korea": "🇰🇷",
  Czechia: "🇨🇿",
  Canada: "🇨🇦",
  "Bosnia & Herzegovina": "🇧🇦",
  Qatar: "🇶🇦",
  Switzerland: "🇨🇭",
  Brazil: "🇧🇷",
  Morocco: "🇲🇦",
  Haiti: "🇭🇹",
  Scotland: "🏴\u{E0067}\u{E0062}\u{E0073}\u{E0063}\u{E0074}\u{E007F}",
  USA: "🇺🇸",
  Paraguay: "🇵🇾",
  Australia: "🇦🇺",
  Turkey: "🇹🇷",
  Germany: "🇩🇪",
  "Ivory Coast": "🇨🇮",
  Ecuador: "🇪🇨",
  Curaçao: "🇨🇼",
  Netherlands: "🇳🇱",
  Sweden: "🇸🇪",
  Tunisia: "🇹🇳",
  Japan: "🇯🇵",
  Belgium: "🇧🇪",
  Egypt: "🇪🇬",
  Iran: "🇮🇷",
  "New Zealand": "🇳🇿",
  Spain: "🇪🇸",
  "Cape Verde": "🇨🇻",
  "Saudi Arabia": "🇸🇦",
  Uruguay: "🇺🇾",
  France: "🇫🇷",
  Senegal: "🇸🇳",
  Iraq: "🇮🇶",
  Norway: "🇳🇴",
  Argentina: "🇦🇷",
  Algeria: "🇩🇿",
  Austria: "🇦🇹",
  Jordan: "🇯🇴",
  Portugal: "🇵🇹",
  "DR Congo": "🇨🇩",
  Uzbekistan: "🇺🇿",
  Colombia: "🇨🇴",
  England: "🏴\u{E0067}\u{E0062}\u{E0065}\u{E006E}\u{E0067}\u{E007F}",
  Croatia: "🇭🇷",
  Ghana: "🇬🇭",
  Panama: "🇵🇦",
};

// [n, month, day, etHour24, etMin, home, away, groupLetter, venue, city]
const groupStage = [
  [
    1,
    6,
    11,
    15,
    0,
    "Mexico",
    "South Africa",
    "A",
    "Estadio Azteca",
    "Mexico City",
  ],
  [2, 6, 11, 22, 0, "South Korea", "Czechia", "A", "Estadio Akron", "Zapopan"],
  [
    3,
    6,
    12,
    15,
    0,
    "Canada",
    "Bosnia & Herzegovina",
    "B",
    "BMO Field",
    "Toronto",
  ],
  [4, 6, 12, 21, 0, "USA", "Paraguay", "D", "SoFi Stadium", "Inglewood"],
  [
    5,
    6,
    13,
    15,
    0,
    "Qatar",
    "Switzerland",
    "B",
    "Levi's Stadium",
    "Santa Clara",
  ],
  [
    6,
    6,
    13,
    18,
    0,
    "Brazil",
    "Morocco",
    "C",
    "MetLife Stadium",
    "East Rutherford",
  ],
  [7, 6, 13, 21, 0, "Haiti", "Scotland", "C", "Gillette Stadium", "Foxborough"],
  [8, 6, 14, 0, 0, "Australia", "Turkey", "D", "BC Place", "Vancouver"],
  [9, 6, 14, 13, 0, "Germany", "Curaçao", "E", "NRG Stadium", "Houston"],
  [10, 6, 14, 16, 0, "Netherlands", "Japan", "F", "AT&T Stadium", "Arlington"],
  [
    11,
    6,
    14,
    19,
    0,
    "Ivory Coast",
    "Ecuador",
    "E",
    "Lincoln Financial Field",
    "Philadelphia",
  ],
  [12, 6, 14, 22, 0, "Sweden", "Tunisia", "F", "Estadio BBVA", "Monterrey"],
  [
    13,
    6,
    15,
    12,
    0,
    "Spain",
    "Cape Verde",
    "H",
    "Mercedes-Benz Stadium",
    "Atlanta",
  ],
  [14, 6, 15, 15, 0, "Belgium", "Egypt", "G", "Lumen Field", "Seattle"],
  [
    15,
    6,
    15,
    18,
    0,
    "Saudi Arabia",
    "Uruguay",
    "H",
    "Hard Rock Stadium",
    "Miami Gardens",
  ],
  [16, 6, 15, 21, 0, "Iran", "New Zealand", "G", "SoFi Stadium", "Inglewood"],
  [
    17,
    6,
    16,
    15,
    0,
    "France",
    "Senegal",
    "I",
    "MetLife Stadium",
    "East Rutherford",
  ],
  [18, 6, 16, 18, 0, "Iraq", "Norway", "I", "Gillette Stadium", "Foxborough"],
  [
    19,
    6,
    16,
    21,
    0,
    "Argentina",
    "Algeria",
    "J",
    "Arrowhead Stadium",
    "Kansas City",
  ],
  [20, 6, 17, 0, 0, "Austria", "Jordan", "J", "Levi's Stadium", "Santa Clara"],
  [21, 6, 17, 13, 0, "Portugal", "DR Congo", "K", "NRG Stadium", "Houston"],
  [22, 6, 17, 16, 0, "England", "Croatia", "L", "AT&T Stadium", "Arlington"],
  [23, 6, 17, 19, 0, "Ghana", "Panama", "L", "BMO Field", "Toronto"],
  [
    24,
    6,
    17,
    22,
    0,
    "Uzbekistan",
    "Colombia",
    "K",
    "Estadio Azteca",
    "Mexico City",
  ],
  [
    25,
    6,
    18,
    12,
    0,
    "Czechia",
    "South Africa",
    "A",
    "Mercedes-Benz Stadium",
    "Atlanta",
  ],
  [
    26,
    6,
    18,
    15,
    0,
    "Switzerland",
    "Bosnia & Herzegovina",
    "B",
    "SoFi Stadium",
    "Inglewood",
  ],
  [27, 6, 18, 18, 0, "Canada", "Qatar", "B", "BC Place", "Vancouver"],
  [28, 6, 18, 21, 0, "Mexico", "South Korea", "A", "Estadio Akron", "Zapopan"],
  [29, 6, 19, 15, 0, "USA", "Australia", "D", "Lumen Field", "Seattle"],
  [
    30,
    6,
    19,
    18,
    0,
    "Scotland",
    "Morocco",
    "C",
    "Gillette Stadium",
    "Foxborough",
  ],
  [
    31,
    6,
    19,
    20,
    30,
    "Brazil",
    "Haiti",
    "C",
    "Lincoln Financial Field",
    "Philadelphia",
  ],
  [
    32,
    6,
    19,
    23,
    0,
    "Turkey",
    "Paraguay",
    "D",
    "Levi's Stadium",
    "Santa Clara",
  ],
  [33, 6, 20, 13, 0, "Netherlands", "Sweden", "F", "NRG Stadium", "Houston"],
  [34, 6, 20, 16, 0, "Germany", "Ivory Coast", "E", "BMO Field", "Toronto"],
  [
    35,
    6,
    20,
    20,
    0,
    "Ecuador",
    "Curaçao",
    "E",
    "Arrowhead Stadium",
    "Kansas City",
  ],
  [36, 6, 21, 0, 0, "Tunisia", "Japan", "F", "Estadio BBVA", "Monterrey"],
  [
    37,
    6,
    21,
    12,
    0,
    "Spain",
    "Saudi Arabia",
    "H",
    "Mercedes-Benz Stadium",
    "Atlanta",
  ],
  [38, 6, 21, 15, 0, "Belgium", "Iran", "G", "SoFi Stadium", "Inglewood"],
  [
    39,
    6,
    21,
    18,
    0,
    "Uruguay",
    "Cape Verde",
    "H",
    "Hard Rock Stadium",
    "Miami Gardens",
  ],
  [40, 6, 21, 21, 0, "New Zealand", "Egypt", "G", "BC Place", "Vancouver"],
  [41, 6, 22, 13, 0, "Argentina", "Austria", "J", "AT&T Stadium", "Arlington"],
  [
    42,
    6,
    22,
    17,
    0,
    "France",
    "Iraq",
    "I",
    "Lincoln Financial Field",
    "Philadelphia",
  ],
  [
    43,
    6,
    22,
    20,
    0,
    "Norway",
    "Senegal",
    "I",
    "MetLife Stadium",
    "East Rutherford",
  ],
  [44, 6, 22, 23, 0, "Jordan", "Algeria", "J", "Levi's Stadium", "Santa Clara"],
  [45, 6, 23, 13, 0, "Portugal", "Uzbekistan", "K", "NRG Stadium", "Houston"],
  [46, 6, 23, 16, 0, "England", "Ghana", "L", "Gillette Stadium", "Foxborough"],
  [47, 6, 23, 19, 0, "Panama", "Croatia", "L", "BMO Field", "Toronto"],
  [48, 6, 23, 22, 0, "Colombia", "DR Congo", "K", "Estadio Akron", "Zapopan"],
  [49, 6, 24, 15, 0, "Switzerland", "Canada", "B", "BC Place", "Vancouver"],
  [
    50,
    6,
    24,
    15,
    0,
    "Bosnia & Herzegovina",
    "Qatar",
    "B",
    "Lumen Field",
    "Seattle",
  ],
  [
    51,
    6,
    24,
    18,
    0,
    "Scotland",
    "Brazil",
    "C",
    "Hard Rock Stadium",
    "Miami Gardens",
  ],
  [
    52,
    6,
    24,
    18,
    0,
    "Morocco",
    "Haiti",
    "C",
    "Mercedes-Benz Stadium",
    "Atlanta",
  ],
  [53, 6, 24, 21, 0, "Czechia", "Mexico", "A", "Estadio Azteca", "Mexico City"],
  [
    54,
    6,
    24,
    21,
    0,
    "South Africa",
    "South Korea",
    "A",
    "Estadio BBVA",
    "Monterrey",
  ],
  [
    55,
    6,
    25,
    16,
    0,
    "Curaçao",
    "Ivory Coast",
    "E",
    "Lincoln Financial Field",
    "Philadelphia",
  ],
  [
    56,
    6,
    25,
    16,
    0,
    "Ecuador",
    "Germany",
    "E",
    "MetLife Stadium",
    "East Rutherford",
  ],
  [57, 6, 25, 19, 0, "Japan", "Sweden", "F", "AT&T Stadium", "Arlington"],
  [
    58,
    6,
    25,
    19,
    0,
    "Tunisia",
    "Netherlands",
    "F",
    "Arrowhead Stadium",
    "Kansas City",
  ],
  [59, 6, 25, 22, 0, "Turkey", "USA", "D", "SoFi Stadium", "Inglewood"],
  [
    60,
    6,
    25,
    22,
    0,
    "Paraguay",
    "Australia",
    "D",
    "Levi's Stadium",
    "Santa Clara",
  ],
  [61, 6, 26, 15, 0, "Norway", "France", "I", "Gillette Stadium", "Foxborough"],
  [62, 6, 26, 15, 0, "Senegal", "Iraq", "I", "BMO Field", "Toronto"],
  [
    63,
    6,
    26,
    20,
    0,
    "Cape Verde",
    "Saudi Arabia",
    "H",
    "NRG Stadium",
    "Houston",
  ],
  [64, 6, 26, 20, 0, "Uruguay", "Spain", "H", "Estadio Akron", "Zapopan"],
  [65, 6, 26, 23, 0, "Egypt", "Iran", "G", "Lumen Field", "Seattle"],
  [66, 6, 26, 23, 0, "New Zealand", "Belgium", "G", "BC Place", "Vancouver"],
  [
    67,
    6,
    27,
    17,
    0,
    "Panama",
    "England",
    "L",
    "MetLife Stadium",
    "East Rutherford",
  ],
  [
    68,
    6,
    27,
    17,
    0,
    "Croatia",
    "Ghana",
    "L",
    "Lincoln Financial Field",
    "Philadelphia",
  ],
  [
    69,
    6,
    27,
    19,
    30,
    "Colombia",
    "Portugal",
    "K",
    "Hard Rock Stadium",
    "Miami Gardens",
  ],
  [
    70,
    6,
    27,
    19,
    30,
    "DR Congo",
    "Uzbekistan",
    "K",
    "Mercedes-Benz Stadium",
    "Atlanta",
  ],
  [
    71,
    6,
    27,
    22,
    0,
    "Algeria",
    "Austria",
    "J",
    "Arrowhead Stadium",
    "Kansas City",
  ],
  [72, 6, 27, 22, 0, "Jordan", "Argentina", "J", "AT&T Stadium", "Arlington"],
];

// [n, month, day, etHour24, etMin, homeSlot, awaySlot, roundLabel, venue, city]
const knockout = [
  [
    73,
    6,
    28,
    15,
    0,
    "Runner-up Group A",
    "Runner-up Group B",
    "Round of 32",
    "SoFi Stadium",
    "Inglewood",
  ],
  [
    74,
    6,
    29,
    16,
    30,
    "Winner Group E",
    "Best Third (A/B/C/D/F)",
    "Round of 32",
    "Gillette Stadium",
    "Foxborough",
  ],
  [
    75,
    6,
    29,
    21,
    0,
    "Winner Group F",
    "Runner-up Group C",
    "Round of 32",
    "Estadio BBVA",
    "Monterrey",
  ],
  [
    76,
    6,
    29,
    13,
    0,
    "Winner Group C",
    "Runner-up Group F",
    "Round of 32",
    "NRG Stadium",
    "Houston",
  ],
  [
    77,
    6,
    30,
    17,
    0,
    "Winner Group I",
    "Best Third (C/D/F/G/H)",
    "Round of 32",
    "MetLife Stadium",
    "East Rutherford",
  ],
  [
    78,
    6,
    30,
    13,
    0,
    "Runner-up Group E",
    "Runner-up Group I",
    "Round of 32",
    "AT&T Stadium",
    "Arlington",
  ],
  [
    79,
    6,
    30,
    21,
    0,
    "Winner Group A",
    "Best Third (C/E/F/H/I)",
    "Round of 32",
    "Estadio Azteca",
    "Mexico City",
  ],
  [
    80,
    7,
    1,
    12,
    0,
    "Winner Group L",
    "Best Third (E/H/I/J/K)",
    "Round of 32",
    "Mercedes-Benz Stadium",
    "Atlanta",
  ],
  [
    81,
    7,
    1,
    20,
    0,
    "Winner Group D",
    "Best Third (B/E/F/I/J)",
    "Round of 32",
    "Levi's Stadium",
    "Santa Clara",
  ],
  [
    82,
    7,
    1,
    16,
    0,
    "Winner Group G",
    "Best Third (A/E/H/I/J)",
    "Round of 32",
    "Lumen Field",
    "Seattle",
  ],
  [
    83,
    7,
    2,
    19,
    0,
    "Runner-up Group K",
    "Runner-up Group L",
    "Round of 32",
    "BMO Field",
    "Toronto",
  ],
  [
    84,
    7,
    2,
    15,
    0,
    "Winner Group H",
    "Runner-up Group J",
    "Round of 32",
    "SoFi Stadium",
    "Inglewood",
  ],
  [
    85,
    7,
    2,
    23,
    0,
    "Winner Group B",
    "Best Third (E/F/G/I/J)",
    "Round of 32",
    "BC Place",
    "Vancouver",
  ],
  [
    86,
    7,
    3,
    18,
    0,
    "Winner Group J",
    "Runner-up Group H",
    "Round of 32",
    "Hard Rock Stadium",
    "Miami Gardens",
  ],
  [
    87,
    7,
    3,
    21,
    30,
    "Winner Group K",
    "Best Third (D/E/I/J/L)",
    "Round of 32",
    "Arrowhead Stadium",
    "Kansas City",
  ],
  [
    88,
    7,
    3,
    14,
    0,
    "Runner-up Group D",
    "Runner-up Group G",
    "Round of 32",
    "AT&T Stadium",
    "Arlington",
  ],
  [
    89,
    7,
    4,
    17,
    0,
    "Winner Match 74",
    "Winner Match 77",
    "Round of 16",
    "Lincoln Financial Field",
    "Philadelphia",
  ],
  [
    90,
    7,
    4,
    13,
    0,
    "Winner Match 73",
    "Winner Match 75",
    "Round of 16",
    "NRG Stadium",
    "Houston",
  ],
  [
    91,
    7,
    5,
    16,
    0,
    "Winner Match 76",
    "Winner Match 78",
    "Round of 16",
    "MetLife Stadium",
    "East Rutherford",
  ],
  [
    92,
    7,
    5,
    20,
    0,
    "Winner Match 79",
    "Winner Match 80",
    "Round of 16",
    "Estadio Azteca",
    "Mexico City",
  ],
  [
    93,
    7,
    6,
    15,
    0,
    "Winner Match 83",
    "Winner Match 84",
    "Round of 16",
    "AT&T Stadium",
    "Arlington",
  ],
  [
    94,
    7,
    6,
    20,
    0,
    "Winner Match 81",
    "Winner Match 82",
    "Round of 16",
    "Lumen Field",
    "Seattle",
  ],
  [
    95,
    7,
    7,
    12,
    0,
    "Winner Match 86",
    "Winner Match 88",
    "Round of 16",
    "Mercedes-Benz Stadium",
    "Atlanta",
  ],
  [
    96,
    7,
    7,
    16,
    0,
    "Winner Match 85",
    "Winner Match 87",
    "Round of 16",
    "BC Place",
    "Vancouver",
  ],
  [
    97,
    7,
    9,
    16,
    0,
    "Winner Match 89",
    "Winner Match 90",
    "Quarter-final",
    "Gillette Stadium",
    "Foxborough",
  ],
  [
    98,
    7,
    10,
    15,
    0,
    "Winner Match 93",
    "Winner Match 94",
    "Quarter-final",
    "SoFi Stadium",
    "Inglewood",
  ],
  [
    99,
    7,
    11,
    17,
    0,
    "Winner Match 91",
    "Winner Match 92",
    "Quarter-final",
    "Hard Rock Stadium",
    "Miami Gardens",
  ],
  [
    100,
    7,
    11,
    21,
    0,
    "Winner Match 95",
    "Winner Match 96",
    "Quarter-final",
    "Arrowhead Stadium",
    "Kansas City",
  ],
  [
    101,
    7,
    14,
    15,
    0,
    "Winner Match 97",
    "Winner Match 98",
    "Semi-final",
    "AT&T Stadium",
    "Arlington",
  ],
  [
    102,
    7,
    15,
    15,
    0,
    "Winner Match 99",
    "Winner Match 100",
    "Semi-final",
    "Mercedes-Benz Stadium",
    "Atlanta",
  ],
  [
    103,
    7,
    18,
    17,
    0,
    "Loser Match 101",
    "Loser Match 102",
    "Third-place Play-off",
    "Hard Rock Stadium",
    "Miami Gardens",
  ],
  [
    104,
    7,
    19,
    15,
    0,
    "Winner Match 101",
    "Winner Match 102",
    "Final",
    "MetLife Stadium",
    "East Rutherford",
  ],
];

const knockoutFixtures = Object.fromEntries(
  knockout.map(([n, , , , , home, away]) => [n, { home, away }]),
);

// Secured group finishes for knockout slot resolution (manual early locks).
// Completed groups are also derived from results in getEffectiveQualified().
// Key: "1A" = Group A winners, "2B" = Group B runners-up, etc.
const qualified = {
  "1A": "Mexico",
  "1B": "Switzerland",
  "1C": "Brazil",
  "1D": "USA",
  "1E": "Germany",
  "1F": "Netherlands",
  "1G": "Belgium",
  "1H": "Spain",
  "1I": "France",
};

// Match results — add an entry after each match day.
// goals: { minute, player, team: "home" | "away", type?: "og" | "penalty", stoppage?: number }
const results = {
  1: {
    home: 2,
    away: 0,
    goals: [
      { minute: 9, player: "Julián Quiñones", team: "home" },
      { minute: 67, player: "Raúl Jiménez", team: "home" },
    ],
  },
  2: {
    home: 2,
    away: 1,
    goals: [
      { minute: 59, player: "Ladislav Krejčí", team: "away" },
      { minute: 67, player: "Hwang In-beom", team: "home" },
      { minute: 80, player: "Oh Hyeon-gyu", team: "home" },
    ],
  },
  3: {
    home: 1,
    away: 1,
    goals: [
      { minute: 21, player: "Jovo Lukic", team: "away" },
      { minute: 78, player: "Cyle Larin", team: "home" },
    ],
  },
  4: {
    home: 4,
    away: 1,
    goals: [
      { minute: 7, player: "Damián Bobadilla", team: "away", type: "og" },
      { minute: 31, player: "Folarin Balogun", team: "home" },
      { minute: 45, stoppage: 5, player: "Folarin Balogun", team: "home" },
      { minute: 73, player: "Mauricio", team: "away" },
      { minute: 90, stoppage: 8, player: "Giovanni Reyna", team: "home" },
    ],
  },
  5: {
    home: 1,
    away: 1,
    goals: [
      { minute: 17, player: "Breel Embolo", team: "away", type: "penalty" },
      { minute: 90, stoppage: 4, player: "Boualem Khoukhi", team: "home" },
    ],
  },
  6: {
    home: 1,
    away: 1,
    goals: [
      { minute: 21, player: "Ismael Saibari", team: "away" },
      { minute: 32, player: "Vinícius Júnior", team: "home" },
    ],
  },
  7: {
    home: 0,
    away: 1,
    goals: [{ minute: 28, player: "John McGinn", team: "away" }],
  },
  8: {
    home: 2,
    away: 0,
    goals: [
      { minute: 27, player: "Nestory Irankunda", team: "home" },
      { minute: 75, player: "Connor Metcalfe", team: "home" },
    ],
  },
  9: {
    home: 7,
    away: 1,
    goals: [
      { minute: 6, player: "Felix Nmecha", team: "home" },
      { minute: 21, player: "Livano Comenencia", team: "away" },
      { minute: 38, player: "Nico Schlotterbeck", team: "home" },
      { minute: 45, stoppage: 5, player: "Kai Havertz", team: "home", type: "penalty" },
      { minute: 47, player: "Jamal Musiala", team: "home" },
      { minute: 68, player: "Nathaniel Brown", team: "home" },
      { minute: 78, player: "Deniz Undav", team: "home" },
      { minute: 88, player: "Kai Havertz", team: "home" },
    ],
  },
  10: {
    home: 2,
    away: 2,
    goals: [
      { minute: 51, player: "Virgil van Dijk", team: "home" },
      { minute: 57, player: "Keito Nakamura", team: "away" },
      { minute: 64, player: "Crysencio Summerville", team: "home" },
      { minute: 89, player: "Daichi Kamada", team: "away" },
    ],
  },
  11: {
    home: 1,
    away: 0,
    goals: [{ minute: 90, player: "Amad Diallo", team: "home" }],
  },
  12: {
    home: 5,
    away: 1,
    goals: [
      { minute: 7, player: "Yasin Ayari", team: "home" },
      { minute: 30, player: "Alexander Isak", team: "home" },
      { minute: 43, player: "Omar Rekik", team: "away" },
      { minute: 59, player: "Viktor Gyökeres", team: "home" },
      { minute: 84, player: "Mattias Svanberg", team: "home" },
      { minute: 90, stoppage: 6, player: "Yasin Ayari", team: "home" },
    ],
  },
  13: {
    home: 0,
    away: 0,
    goals: [],
  },
  14: {
    home: 1,
    away: 1,
    goals: [
      { minute: 20, player: "Emam Ashour", team: "away" },
      { minute: 66, player: "Mohamed Hany", team: "away", type: "og" },
    ],
  },
  15: {
    home: 1,
    away: 1,
    goals: [
      { minute: 41, player: "Abdulelah Al-Amri", team: "home" },
      { minute: 80, player: "Maxi Araújo", team: "away" },
    ],
  },
  16: {
    home: 2,
    away: 2,
    goals: [
      { minute: 7, player: "Elijah Just", team: "away" },
      { minute: 32, player: "Ramin Rezaeian", team: "home" },
      { minute: 54, player: "Elijah Just", team: "away" },
      { minute: 64, player: "Mohammad Mohebi", team: "home" },
    ],
  },
  17: {
    home: 3,
    away: 1,
    goals: [
      { minute: 66, player: "Kylian Mbappé", team: "home" },
      { minute: 82, player: "Bradley Barcola", team: "home" },
      { minute: 90, stoppage: 5, player: "Ibrahim Mbaye", team: "away" },
      { minute: 90, stoppage: 6, player: "Kylian Mbappé", team: "home" },
    ],
  },
  18: {
    home: 1,
    away: 4,
    goals: [
      { minute: 29, player: "Erling Haaland", team: "away" },
      { minute: 39, player: "Aymen Hussein", team: "home" },
      { minute: 43, player: "Erling Haaland", team: "away" },
      { minute: 76, player: "Leo Østigård", team: "away" },
      { minute: 90, stoppage: 6, player: "Aymen Hussein", team: "home", type: "og" },
    ],
  },
  19: {
    home: 3,
    away: 0,
    goals: [
      { minute: 17, player: "Lionel Messi", team: "home" },
      { minute: 60, player: "Lionel Messi", team: "home" },
      { minute: 76, player: "Lionel Messi", team: "home" },
    ],
  },
  20: {
    home: 3,
    away: 1,
    goals: [
      { minute: 20, player: "Romano Schmid", team: "home" },
      { minute: 50, player: "Ali Olwan", team: "away" },
      { minute: 76, player: "Yazan Al Arab", team: "away", type: "og" },
      { minute: 90, stoppage: 12, player: "Marko Arnautovic", team: "home", type: "penalty" },
    ],
  },
  21: {
    home: 1,
    away: 1,
    goals: [
      { minute: 6, player: "João Neves", team: "home" },
      { minute: 45, stoppage: 5, player: "Yoane Wissa", team: "away" },
    ],
  },
  22: {
    home: 4,
    away: 2,
    goals: [
      { minute: 12, player: "Harry Kane", team: "home", type: "penalty" },
      { minute: 36, player: "Martin Baturina", team: "away" },
      { minute: 42, player: "Harry Kane", team: "home" },
      { minute: 45, stoppage: 5, player: "Petar Musa", team: "away" },
      { minute: 47, player: "Jude Bellingham", team: "home" },
      { minute: 85, player: "Marcus Rashford", team: "home" },
    ],
  },
  23: {
    home: 1,
    away: 0,
    goals: [{ minute: 90, stoppage: 5, player: "Caleb Yirenkyi", team: "home" }],
  },
  24: {
    home: 1,
    away: 3,
    goals: [
      { minute: 40, player: "Daniel Muñoz", team: "away" },
      { minute: 60, player: "Abbosbek Fayzullaev", team: "home" },
      { minute: 65, player: "Luis Díaz", team: "away" },
      { minute: 90, stoppage: 9, player: "Jaminton Campaz", team: "away" },
    ],
  },
  25: {
    home: 1,
    away: 1,
    goals: [
      { minute: 6, player: "Michal Sadílek", team: "home" },
      { minute: 83, player: "Teboho Mokoena", team: "away", type: "penalty" },
    ],
  },
  26: {
    home: 4,
    away: 1,
    goals: [
      { minute: 71, player: "Johan Manzambi", team: "home" },
      { minute: 84, player: "Ruben Vargas", team: "home" },
      { minute: 90, player: "Johan Manzambi", team: "home" },
      { minute: 90, stoppage: 3, player: "Ermin Mahmic", team: "away" },
      { minute: 90, stoppage: 7, player: "Granit Xhaka", team: "home", type: "penalty" },
    ],
  },
  27: {
    home: 6,
    away: 0,
    goals: [
      { minute: 16, player: "Cyle Larin", team: "home" },
      { minute: 29, player: "Jonathan David", team: "home" },
      { minute: 45, stoppage: 3, player: "Jonathan David", team: "home" },
      { minute: 64, player: "Nathan Saliba", team: "home" },
      { minute: 75, player: "Mohamed Manai", team: "away", type: "og" },
      { minute: 90, stoppage: 2, player: "Jonathan David", team: "home" },
    ],
  },
  28: {
    home: 1,
    away: 0,
    goals: [{ minute: 50, player: "Luis Romo", team: "home" }],
  },
  29: {
    home: 2,
    away: 0,
    goals: [
      { minute: 11, player: "Cameron Burgess", team: "away", type: "og" },
      { minute: 43, player: "Alex Freeman", team: "home" },
    ],
  },
  30: {
    home: 0,
    away: 1,
    goals: [{ minute: 2, player: "Ismael Saibari", team: "away" }],
  },
  31: {
    home: 3,
    away: 0,
    goals: [
      { minute: 23, player: "Matheus Cunha", team: "home" },
      { minute: 36, player: "Matheus Cunha", team: "home" },
      { minute: 45, stoppage: 3, player: "Vinícius Júnior", team: "home" },
    ],
  },
  32: {
    home: 0,
    away: 1,
    goals: [{ minute: 2, player: "Matías Galarza", team: "away" }],
  },
  33: {
    home: 5,
    away: 1,
    goals: [
      { minute: 5, player: "Brian Brobbey", team: "home" },
      { minute: 17, player: "Brian Brobbey", team: "home" },
      { minute: 47, player: "Cody Gakpo", team: "home" },
      { minute: 54, player: "Cody Gakpo", team: "home" },
      { minute: 59, player: "Anthony Elanga", team: "away" },
      { minute: 89, player: "Crysencio Summerville", team: "home" },
    ],
  },
  34: {
    home: 2,
    away: 1,
    goals: [
      { minute: 30, player: "Franck Kessie", team: "away" },
      { minute: 68, player: "Deniz Undav", team: "home" },
      { minute: 90, stoppage: 4, player: "Deniz Undav", team: "home" },
    ],
  },
  35: {
    home: 0,
    away: 0,
    goals: [],
  },
  36: {
    home: 0,
    away: 4,
    goals: [
      { minute: 4, player: "Daichi Kamada", team: "away" },
      { minute: 31, player: "Ayase Ueda", team: "away" },
      { minute: 69, player: "Junya Ito", team: "away" },
      { minute: 83, player: "Ayase Ueda", team: "away" },
    ],
  },
  37: {
    home: 4,
    away: 0,
    goals: [
      { minute: 10, player: "Lamine Yamal", team: "home" },
      { minute: 21, player: "Mikel Oyarzabal", team: "home" },
      { minute: 24, player: "Mikel Oyarzabal", team: "home" },
      { minute: 49, player: "Hassan Altambakti", team: "away", type: "og" },
    ],
  },
  38: {
    home: 0,
    away: 0,
    goals: [],
  },
  39: {
    home: 2,
    away: 2,
    goals: [
      { minute: 21, player: "Kevin Pina", team: "away" },
      { minute: 44, player: "Maxi Araújo", team: "home" },
      { minute: 45, stoppage: 6, player: "Agustin Canobbio", team: "home" },
      { minute: 61, player: "Helio Varela", team: "away" },
    ],
  },
  40: {
    home: 1,
    away: 3,
    goals: [
      { minute: 15, player: "Finn Surman", team: "home" },
      { minute: 58, player: "Mostafa Zico", team: "away" },
      { minute: 67, player: "Mohamed Salah", team: "away" },
      { minute: 82, player: "Trézéguet", team: "away" },
    ],
  },
  41: {
    home: 2,
    away: 0,
    goals: [
      { minute: 38, player: "Lionel Messi", team: "home" },
      { minute: 90, stoppage: 5, player: "Lionel Messi", team: "home" },
    ],
  },
  42: {
    home: 3,
    away: 0,
    goals: [
      { minute: 14, player: "Kylian Mbappé", team: "home" },
      { minute: 54, player: "Kylian Mbappé", team: "home" },
      { minute: 66, player: "Ousmane Dembélé", team: "home" },
    ],
  },
  43: {
    home: 3,
    away: 2,
    goals: [
      { minute: 43, player: "Marcus Pedersen", team: "home" },
      { minute: 48, player: "Erling Haaland", team: "home" },
      { minute: 53, player: "Ismaïla Sarr", team: "away" },
      { minute: 58, player: "Erling Haaland", team: "home" },
      { minute: 90, stoppage: 3, player: "Ismaïla Sarr", team: "away" },
    ],
  },
  44: {
    home: 1,
    away: 2,
    goals: [
      { minute: 36, player: "Nizar Al Rashdan", team: "home" },
      { minute: 69, player: "Nadhir Benbouali", team: "away" },
      { minute: 82, player: "Amine Gouiri", team: "away" },
    ],
  },
  45: {
    home: 5,
    away: 0,
    goals: [
      { minute: 6, player: "Cristiano Ronaldo", team: "home" },
      { minute: 17, player: "Nuno Mendes", team: "home" },
      { minute: 39, player: "Cristiano Ronaldo", team: "home" },
      { minute: 60, player: "Abduvokhid Nematov", team: "away", type: "og" },
      { minute: 87, player: "Rafael Leão", team: "home" },
    ],
  },
  46: {
    home: 0,
    away: 0,
    goals: [],
  },
  47: {
    home: 0,
    away: 1,
    goals: [{ minute: 54, player: "Ante Budimir", team: "away" }],
  },
  48: {
    home: 1,
    away: 0,
    goals: [{ minute: 76, player: "Daniel Muñoz", team: "home" }],
  },
  49: {
    home: 2,
    away: 1,
    goals: [
      { minute: 46, player: "Rubén Vargas", team: "home" },
      { minute: 57, player: "Johan Manzambi", team: "home" },
      { minute: 76, player: "Promise David", team: "away" },
    ],
  },
  50: {
    home: 3,
    away: 1,
    goals: [
      { minute: 29, player: "Kerim Alajbegovic", team: "home" },
      { minute: 34, player: "Mahmoud Abunada", team: "away", type: "og" },
      { minute: 42, player: "Hassan Al Haydos", team: "away" },
      { minute: 80, player: "Ermin Mahmic", team: "home" },
    ],
  },
  51: {
    home: 0,
    away: 3,
    goals: [
      { minute: 7, player: "Vinícius Júnior", team: "away" },
      { minute: 45, stoppage: 3, player: "Vinícius Júnior", team: "away" },
      { minute: 60, player: "Matheus Cunha", team: "away" },
    ],
  },
  52: {
    home: 4,
    away: 2,
    goals: [
      { minute: 10, player: "Yassine Bounou", team: "home", type: "og" },
      { minute: 39, player: "Achraf Hakimi", team: "home" },
      { minute: 43, player: "Wilson Isidor", team: "away" },
      { minute: 45, stoppage: 1, player: "Ismael Saibari", team: "home" },
      { minute: 78, player: "Soufiane Rahimi", team: "home" },
      { minute: 89, player: "Gessime Yassine", team: "home" },
    ],
  },
  53: {
    home: 0,
    away: 3,
    goals: [
      { minute: 55, player: "Mateo Chávez", team: "away" },
      { minute: 61, player: "Julián Quiñones", team: "away" },
      { minute: 90, stoppage: 4, player: "Álvaro Fidalgo", team: "away" },
    ],
  },
  54: {
    home: 1,
    away: 0,
    goals: [{ minute: 63, player: "Thapelo Maseko", team: "home" }],
  },
  55: {
    home: 0,
    away: 2,
    goals: [
      { minute: 7, player: "Nicolas Pépé", team: "away" },
      { minute: 64, player: "Nicolas Pépé", team: "away" },
    ],
  },
  56: {
    home: 2,
    away: 1,
    goals: [
      { minute: 2, player: "Leroy Sané", team: "away" },
      { minute: 9, player: "Nilson Angulo", team: "home" },
      { minute: 77, player: "Gonzalo Plata", team: "home" },
    ],
  },
  57: {
    home: 1,
    away: 1,
    goals: [
      { minute: 56, player: "Daizen Maeda", team: "home" },
      { minute: 62, player: "Anthony Elanga", team: "away" },
    ],
  },
  58: {
    home: 1,
    away: 3,
    goals: [
      { minute: 3, player: "Ellyes Skhiri", team: "home", type: "og" },
      { minute: 7, player: "Brian Brobbey", team: "away" },
      { minute: 54, player: "Hazem Mastouri", team: "home" },
      { minute: 62, player: "Jan Paul van Hecke", team: "away" },
    ],
  },
  59: {
    home: 3,
    away: 2,
    goals: [
      { minute: 3, player: "Auston Trusty", team: "away" },
      { minute: 10, player: "Arda Güler", team: "home" },
      { minute: 31, player: "Baris Alper Yilmaz", team: "home" },
      { minute: 49, player: "Sebastian Berhalter", team: "away" },
      { minute: 90, stoppage: 8, player: "Kaan Ayhan", team: "home" },
    ],
  },
  60: {
    home: 0,
    away: 0,
    goals: [],
  },
  61: {
    home: 1,
    away: 4,
    goals: [
      { minute: 7, player: "Ousmane Dembélé", team: "away" },
      { minute: 20, player: "Ousmane Dembélé", team: "away" },
      { minute: 21, player: "Thelo Aasgaard", team: "home" },
      { minute: 32, player: "Ousmane Dembélé", team: "away" },
      { minute: 90, stoppage: 4, player: "Désiré Doué", team: "away" },
    ],
  },
  62: {
    home: 5,
    away: 0,
    goals: [
      { minute: 4, player: "Habib Diarra", team: "home" },
      { minute: 56, player: "Ismaïla Sarr", team: "home" },
      { minute: 59, player: "Pape Gueye", team: "home" },
      { minute: 71, player: "Pape Gueye", team: "home" },
      { minute: 82, player: "Iliman Ndiaye", team: "home" },
    ],
  },
  63: {
    home: 0,
    away: 0,
    goals: [],
  },
  64: {
    home: 0,
    away: 1,
    goals: [{ minute: 42, player: "Álex Baena", team: "away" }],
  },
  65: {
    home: 1,
    away: 1,
    goals: [
      { minute: 5, player: "Mahmoud Saber", team: "home" },
      { minute: 14, player: "Ramin Rezaeian", team: "away" },
    ],
  },
  66: {
    home: 1,
    away: 5,
    goals: [
      { minute: 28, player: "Leandro Trossard", team: "away" },
      { minute: 50, player: "Leandro Trossard", team: "away" },
      { minute: 66, player: "Kevin De Bruyne", team: "away" },
      { minute: 84, player: "Elijah Just", team: "home" },
      { minute: 86, player: "Romelu Lukaku", team: "away" },
      { minute: 90, stoppage: 4, player: "Alexis Saelemaekers", team: "away" },
    ],
  },
  67: {
    home: 0,
    away: 2,
    goals: [
      { minute: 62, player: "Jude Bellingham", team: "away" },
      { minute: 67, player: "Harry Kane", team: "away" },
    ],
  },
  68: {
    home: 2,
    away: 1,
    goals: [
      { minute: 31, player: "Petar Sucic", team: "home" },
      { minute: 73, player: "Derrick Luckassen", team: "away", type: "og" },
      { minute: 83, player: "Nikola Vlasic", team: "home" },
    ],
  },
  69: {
    home: 0,
    away: 0,
    goals: [],
  },
  70: {
    home: 3,
    away: 1,
    goals: [
      { minute: 10, player: "Eldor Shomurodov", team: "away" },
      { minute: 68, player: "Yoane Wissa", team: "home", type: "penalty" },
      { minute: 78, player: "Fiston Mayele", team: "home" },
      { minute: 90, stoppage: 1, player: "Yoane Wissa", team: "home" },
    ],
  },
  71: {
    home: 3,
    away: 3,
    goals: [
      { minute: 28, player: "Marko Arnautovic", team: "away" },
      { minute: 45, player: "Rafik Belghali", team: "home" },
      { minute: 55, player: "Marcel Sabitzer", team: "away" },
      { minute: 60, player: "Riyad Mahrez", team: "home" },
      { minute: 90, stoppage: 3, player: "Riyad Mahrez", team: "home" },
      { minute: 90, stoppage: 6, player: "Sasa Kalajdzic", team: "away" },
    ],
  },
  72: {
    home: 1,
    away: 3,
    goals: [
      { minute: 19, player: "Giovani Lo Celso", team: "away" },
      { minute: 31, player: "Lautaro Martínez", team: "away", type: "penalty" },
      { minute: 55, player: "Mousa Al Tamari", team: "home" },
      { minute: 80, player: "Lionel Messi", team: "away" },
    ],
  },
};

// Maps each "Best Third (…)" pool to the group-winner letter that slot faces (FIFA R32 schedule).
const BEST_THIRD_POOL_TO_WINNER = {
  "A/B/C/D/F": "E",
  "C/D/F/G/H": "I",
  "C/E/F/H/I": "A",
  "E/H/I/J/K": "L",
  "B/E/F/I/J": "D",
  "A/E/H/I/J": "G",
  "E/F/G/I/J": "B",
  "D/E/I/J/L": "K",
};

const THIRD_PLACE_LOOKUP = new Map();
for (const letters of ANNEX_C_ROWS) {
  const byWinner = {};
  for (let j = 0; j < ANNEX_C_WINNERS.length; j++) {
    byWinner[ANNEX_C_WINNERS[j]] = letters[j];
  }
  THIRD_PLACE_LOOKUP.set(letters.split("").sort().join(""), byWinner);
}

function buildGroupData() {
  const teamsByGroup = {};
  const playedByGroup = {};
  for (const [n, , , , , home, away, group] of groupStage) {
    (teamsByGroup[group] ||= new Set()).add(home);
    teamsByGroup[group].add(away);
    const result = results[n];
    if (!result) continue;
    (playedByGroup[group] ||= []).push({
      home,
      away,
      gh: result.home,
      ga: result.away,
    });
  }
  return { teamsByGroup, playedByGroup };
}

function isGroupComplete(group, playedByGroup, teamsByGroup) {
  const n = teamsByGroup[group].size;
  return (playedByGroup[group]?.length || 0) === (n * (n - 1)) / 2;
}

function tierBy(rows, key) {
  const sorted = rows.slice().sort((x, y) => key(y) - key(x));
  const tiers = [];
  for (const r of sorted) {
    const last = tiers[tiers.length - 1];
    if (last && key(last[0]) === key(r)) last.push(r);
    else tiers.push([r]);
  }
  return tiers;
}

function miniLeagueTable(teams, played) {
  const codes = new Set(teams.map((t) => t.team));
  const table = new Map(
    teams.map((t) => [t.team, { pts: 0, gf: 0, ga: 0, gd: 0 }]),
  );
  for (const { home, away, gh, ga } of played) {
    if (!codes.has(home) || !codes.has(away)) continue;
    const H = table.get(home);
    const A = table.get(away);
    H.gf += gh;
    H.ga += ga;
    A.gf += ga;
    A.ga += gh;
    if (gh > ga) H.pts += 3;
    else if (gh < ga) A.pts += 3;
    else {
      H.pts += 1;
      A.pts += 1;
    }
  }
  for (const row of table.values()) row.gd = row.gf - row.ga;
  return table;
}

function sameMini(a, b) {
  return a.pts === b.pts && a.gd === b.gd && a.gf === b.gf;
}

function fallback(teams) {
  return teams
    .slice()
    .sort((x, y) => y.gd - x.gd || y.gf - x.gf || x.team.localeCompare(y.team));
}

function resolveTie(teams, played) {
  const mini = miniLeagueTable(teams, played);
  const ranked = teams.slice().sort((x, y) => {
    const mx = mini.get(x.team);
    const my = mini.get(y.team);
    return my.pts - mx.pts || my.gd - mx.gd || my.gf - mx.gf;
  });
  const runs = [];
  for (const r of ranked) {
    const last = runs[runs.length - 1];
    if (last && sameMini(mini.get(last[0].team), mini.get(r.team))) last.push(r);
    else runs.push([r]);
  }
  if (runs.length === 1) return fallback(teams);
  const out = [];
  for (const run of runs) {
    out.push(...(run.length === 1 ? run : resolveTie(run, played)));
  }
  return out;
}

function rankStandings(rows, played) {
  const out = [];
  for (const tier of tierBy(rows, (r) => r.pts)) {
    out.push(...(tier.length === 1 ? tier : resolveTie(tier, played)));
  }
  return out;
}

function rankGroup(group, playedByGroup, teamsByGroup) {
  const rows = {};
  for (const team of teamsByGroup[group]) {
    rows[team] = { team, pts: 0, gf: 0, ga: 0, gd: 0, played: 0 };
  }
  for (const { home, away, gh, ga } of playedByGroup[group] || []) {
    const H = rows[home];
    const A = rows[away];
    H.gf += gh;
    H.ga += ga;
    A.gf += ga;
    A.ga += gh;
    H.played++;
    A.played++;
    if (gh > ga) H.pts += 3;
    else if (gh < ga) A.pts += 3;
    else {
      H.pts += 1;
      A.pts += 1;
    }
  }
  const arr = Object.values(rows);
  for (const r of arr) r.gd = r.gf - r.ga;
  return rankStandings(arr, playedByGroup[group] || []);
}

function getEffectiveQualified() {
  const { teamsByGroup, playedByGroup } = buildGroupData();
  const merged = { ...qualified };
  for (const group of Object.keys(teamsByGroup).sort()) {
    if (!isGroupComplete(group, playedByGroup, teamsByGroup)) continue;
    const ranked = rankGroup(group, playedByGroup, teamsByGroup);
    if (ranked[0]) merged[`1${group}`] = ranked[0].team;
    if (ranked[1]) merged[`2${group}`] = ranked[1].team;
  }
  return merged;
}

function pickBestThirds(thirds) {
  return thirds
    .slice()
    .sort(
      (x, y) =>
        y.row.pts - x.row.pts ||
        y.row.gd - x.row.gd ||
        y.row.gf - x.row.gf ||
        x.team.localeCompare(y.team),
    )
    .slice(0, 8);
}

function getThirdByWinner() {
  const { teamsByGroup, playedByGroup } = buildGroupData();
  if (
    !Object.keys(teamsByGroup).every((g) =>
      isGroupComplete(g, playedByGroup, teamsByGroup),
    )
  ) {
    return {};
  }

  const thirds = [];
  for (const group of Object.keys(teamsByGroup).sort()) {
    const ranked = rankGroup(group, playedByGroup, teamsByGroup);
    if (ranked[2]) thirds.push({ group, team: ranked[2].team, row: ranked[2] });
  }

  const best = pickBestThirds(thirds);
  const combo = best
    .map((t) => t.group)
    .sort()
    .join("");
  const byWinner = THIRD_PLACE_LOOKUP.get(combo);
  if (!byWinner) return {};

  const thirdByGroup = Object.fromEntries(thirds.map((t) => [t.group, t.team]));
  const thirdByWinner = {};
  for (const w of ANNEX_C_WINNERS) {
    const g = byWinner[w];
    if (g && thirdByGroup[g]) thirdByWinner[w] = thirdByGroup[g];
  }
  return thirdByWinner;
}

const effectiveQualified = getEffectiveQualified();
const thirdByWinner = getThirdByWinner();

const pad = (n) => String(n).padStart(2, "0");

function icsNow() {
  const d = new Date();
  return `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`;
}

function formatMinute({ minute, stoppage }) {
  if (stoppage != null) return `${minute}+${stoppage}`;
  return String(minute);
}

function formatMatchTitle(home, away, fh, fa, result) {
  if (!result) return `${fh} ${home} vs ${fa} ${away}`;
  return `${fh} ${home} ${result.home} x ${result.away} ${fa} ${away}`;
}

function resolveKnockoutSlot(slot, visiting = new Set()) {
  const winnerMatch = slot.match(/^Winner Match (\d+)$/);
  if (winnerMatch) {
    const matchN = Number(winnerMatch[1]);
    if (visiting.has(matchN)) return { name: slot, flag: "" };
    visiting.add(matchN);

    const fixture = knockoutFixtures[matchN];
    if (!fixture) {
      visiting.delete(matchN);
      return { name: slot, flag: "" };
    }

    const home = resolveKnockoutSlot(fixture.home, visiting);
    const away = resolveKnockoutSlot(fixture.away, visiting);
    visiting.delete(matchN);

    const result = results[matchN];
    if (result) {
      if (result.home > result.away && home.flag) return home;
      if (result.away > result.home && away.flag) return away;
    }

    if (home.flag && away.flag) {
      return {
        name: `${home.flag} ${home.name} | ${away.flag} ${away.name}`,
        flag: "",
      };
    }

    return { name: slot, flag: "" };
  }

  const winner = slot.match(/^Winner Group ([A-L])$/);
  if (winner) {
    const team = effectiveQualified[`1${winner[1]}`];
    if (team) return { name: team, flag: FLAGS[team] || "" };
  }
  const runnerUp = slot.match(/^Runner-up Group ([A-L])$/);
  if (runnerUp) {
    const team = effectiveQualified[`2${runnerUp[1]}`];
    if (team) return { name: team, flag: FLAGS[team] || "" };
  }
  const bestThird = slot.match(/^Best Third \(([^)]+)\)$/);
  if (bestThird) {
    const winnerLetter = BEST_THIRD_POOL_TO_WINNER[bestThird[1]];
    const team = winnerLetter && thirdByWinner[winnerLetter];
    if (team) return { name: team, flag: FLAGS[team] || "" };
  }
  return { name: slot, flag: "" };
}

function formatKnockoutParticipant(slot) {
  const { name, flag } = resolveKnockoutSlot(slot);
  return flag ? `${flag} ${name}` : name;
}

function formatMatchDescription(n, phase, prefix) {
  const line = `Match ${n} · FIFA World Cup 2026 · ${phase}`;
  return prefix ? `${prefix} · ${line}` : line;
}

function formatGoalSuffix(goal) {
  if (goal.type === "og") return " (OG)";
  if (goal.type === "penalty") return " (P)";
  return "";
}

function formatGoalLine(goal, home, away) {
  const teamName = goal.team === "home" ? home : away;
  const flag = FLAGS[teamName] || teamName;
  return `⚽ ${formatMinute(goal)}' ${goal.player} ${flag}${formatGoalSuffix(goal)}`;
}

function appendGoals(desc, goals, home, away) {
  if (!goals?.length) return desc;
  const lines = goals.map((g) => formatGoalLine(g, home, away));
  return `${desc}\n\nGoals:\n${lines.join("\n")}`;
}

function icsStamp(month, day, etHour, etMin) {
  // ET = UTC-4 in June/July; add 4h and let Date normalize rollovers.
  const d = new Date(Date.UTC(2026, month - 1, day, etHour + 4, etMin, 0));
  return `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00Z`;
}

function esc(s) {
  return s
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}

// RFC 5545 line folding at 75 octets (UTF-8 aware).
function fold(line) {
  const bytes = Buffer.from(line, "utf8");
  if (bytes.length <= 75) return line;
  const out = [];
  let start = 0;
  let limit = 75;
  while (start < bytes.length) {
    let end = Math.min(start + limit, bytes.length);
    // don't split a multi-byte char
    while (end < bytes.length && (bytes[end] & 0xc0) === 0x80) end--;
    out.push(bytes.slice(start, end).toString("utf8"));
    start = end;
    limit = 74; // continuation lines start with a space
  }
  return out.join("\r\n ");
}

function vevent({
  n,
  month,
  day,
  etHour,
  etMin,
  title,
  location,
  description,
  dtstamp = "20260611T000000Z",
}) {
  const start = icsStamp(month, day, etHour, etMin);
  const end = icsStamp(month, day, etHour + 2, etMin); // ~2h match window
  return [
    "BEGIN:VEVENT",
    fold(`UID:wc2026-m${n}@worldcup2026.calendar`),
    `DTSTAMP:${dtstamp}`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    fold(`SUMMARY:${esc(title)}`),
    fold(`LOCATION:${esc(location)}`),
    fold(`DESCRIPTION:${esc(description)}`),
    "TRANSP:TRANSPARENT",
    "END:VEVENT",
  ].join("\r\n");
}

const events = [];

for (const [
  n,
  month,
  day,
  etHour,
  etMin,
  home,
  away,
  grp,
  venue,
  city,
] of groupStage) {
  const fh = FLAGS[home] || "";
  const fa = FLAGS[away] || "";
  const result = results[n];
  const title = formatMatchTitle(home, away, fh, fa, result);
  let desc = formatMatchDescription(
    n,
    `Group ${grp}`,
    n === 1 ? "Opening Match" : undefined,
  );
  desc = appendGoals(desc, result?.goals, home, away);
  events.push(
    vevent({
      n,
      month,
      day,
      etHour,
      etMin,
      title,
      location: `${venue}, ${city}`,
      description: desc,
      dtstamp: result ? icsNow() : undefined,
    }),
  );
}

for (const [
  n,
  month,
  day,
  etHour,
  etMin,
  home,
  away,
  round,
  venue,
  city,
] of knockout) {
  const homeTeam = resolveKnockoutSlot(home);
  const awayTeam = resolveKnockoutSlot(away);
  const homeTitle = formatKnockoutParticipant(home);
  const awayTitle = formatKnockoutParticipant(away);
  const result = results[n];
  const title = result
    ? `${homeTitle} ${result.home} x ${result.away} ${awayTitle} — ${round}`
    : `${homeTitle} vs ${awayTitle} — ${round}`;
  let desc = formatMatchDescription(n, round);
  desc = appendGoals(desc, result?.goals, homeTeam.name, awayTeam.name);
  events.push(
    vevent({
      n,
      month,
      day,
      etHour,
      etMin,
      title,
      location: `${venue}, ${city}`,
      description: desc,
      dtstamp: result ? icsNow() : undefined,
    }),
  );
}

const calendar =
  [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//worldcup2026//FIFA World Cup 2026 Calendar//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "X-WR-CALNAME:FIFA World Cup 2026",
    "X-WR-CALDESC:All 104 matches of the 2026 FIFA World Cup (USA · Canada · Mexico). Times localize to your device.",
    "X-WR-TIMEZONE:UTC",
    "REFRESH-INTERVAL;VALUE=DURATION:PT12H",
    "X-PUBLISHED-TTL:PT12H",
    ...events,
    "END:VCALENDAR",
  ].join("\r\n") + "\r\n";

require("fs").writeFileSync(
  __dirname + "/docs/fifa-world-cup-2026.ics",
  calendar,
  "utf8",
);
console.log(
  `Wrote docs/fifa-world-cup-2026.ics with ${events.length} matches.`,
);
