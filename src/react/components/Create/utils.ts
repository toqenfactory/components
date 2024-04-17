export const abi = [
  {
    type: "function",
    name: "createERC20",
    inputs: [
      { name: "name", type: "string", internalType: "string" },
      { name: "symbol", type: "string", internalType: "string" },
      { name: "maxSupply", type: "uint256", internalType: "uint256" },
      { name: "tokenPrice", type: "uint256", internalType: "uint256" },
    ],
    outputs: [
      {
        name: "token",
        type: "address",
        internalType: "contract ERC20Toqen",
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "createERC721",
    inputs: [
      { name: "name", type: "string", internalType: "string" },
      { name: "symbol", type: "string", internalType: "string" },
      { name: "maxSupply", type: "uint256", internalType: "uint256" },
      { name: "tokenPrice", type: "uint256", internalType: "uint256" },
      { name: "baseURI", type: "string", internalType: "string" },
    ],
    outputs: [
      {
        name: "token",
        type: "address",
        internalType: "contract ERC721Toqen",
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "event",
    name: "TokenCreated",
    inputs: [
      {
        name: "tokenAddress",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "creator",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
];

export const generate = (): { name: string; symbol: string } => {
  const firstWords = [
    "Yellow",
    "Blue",
    "Red",
    "Green",
    "White",
    "Black",
    "Silver",
    "Golden",
    "Neon",
    "Dark",
    "Light",
    "Royal",
    "Mystic",
    "Emerald",
    "Sapphire",
    "Ruby",
    "Diamond",
    "Shadow",
    "Bright",
    "Clear",
  ];
  const secondWords = [
    "Tiger",
    "Wolf",
    "Falcon",
    "Eagle",
    "Lion",
    "Dragon",
    "Fox",
    "Bear",
    "Hawk",
    "Serpent",
    "Panther",
    "Raven",
    "Phoenix",
    "Jaguar",
    "Owl",
    "Elk",
    "Buffalo",
    "Python",
    "Puma",
    "Shark",
  ];
  const lastWords = [
    "Baby",
    "Warrior",
    "Forest",
    "Mountain",
    "River",
    "Ocean",
    "Sky",
    "Moon",
    "Star",
    "Sun",
    "Heart",
    "Spirit",
    "Blaze",
    "Storm",
    "Wind",
    "Rock",
    "Ice",
    "Fire",
    "Mist",
    "Wave",
  ];

  const first = firstWords[Math.floor(Math.random() * firstWords.length)];
  const second = secondWords[Math.floor(Math.random() * secondWords.length)];
  const last = lastWords[Math.floor(Math.random() * lastWords.length)];

  const name = `${first} ${second} ${last}`;

  const symbol = `${first[0]}${second[0]}${last[0]}`;

  return { name, symbol };
};
