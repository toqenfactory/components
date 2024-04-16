import { useCallback, useEffect, useMemo, useState } from "react";
import {
  useWriteContract,
  useWaitForTransactionReceipt,
  useWatchContractEvent,
} from "wagmi";
import { parseEther } from "viem";

const abi = [
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

const mtd =
  "ipfs://bafybeieyb62vnkv46zr5mw3nfqlhcxt7v2frd2tu6k3cwgkqfgwmnyflme/";

function generateCryptoToken(): { name: string; symbol: string } {
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

  // Select one random word from each list
  const first = firstWords[Math.floor(Math.random() * firstWords.length)];
  const second = secondWords[Math.floor(Math.random() * secondWords.length)];
  const last = lastWords[Math.floor(Math.random() * lastWords.length)];

  // Combine to form the full name
  const name = `${first} ${second} ${last}`;

  // Create the symbol by taking the first letter of each word
  const symbol = `${first[0]}${second[0]}${last[0]}`;

  return { name, symbol };
}

const Input = ({
  label,
  placeholder,
  value,
  setValue,
}: {
  label: string;
  placeholder: string;
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const id = useMemo(() => Math.random(), []);

  return (
    <div className="flex justify-center items-center gap-2">
      <div className="flex-1 text-right">
        <label htmlFor={`id-${id}`}>{label}</label>
      </div>
      <div className="flex-1">
        <input
          type="text"
          id={`id-${id}`}
          placeholder={placeholder}
          value={value}
          onChange={(event) => setValue(event.currentTarget.value)}
          className="p-2 rounded-xl"
        ></input>
      </div>
    </div>
  );
};

const Create = ({
  standart,
  toqen: address,
  handle,
}: {
  standart: "ERC20" | "ERC721";
  toqen: `0x${string}` | undefined;
  handle: ({
    data,
    status,
  }: {
    data: `0x${string}` | undefined;
    status: "idle" | "pending" | "success" | "error";
  }) => void;
}) => {
  const {
    writeContract,
    status: offChain,
    data: hash,
    error,
  } = useWriteContract(); // offChain: idle -> pending -> success
  const { status: onChain } = useWaitForTransactionReceipt({ hash }); // onChain: pending -> success

  const eventName = "TokenCreated";
  const functionName = useMemo(() => `create${standart}`, [standart]);

  console.log(error);

  // const [step, setStep] = useState(0);
  // const [message, setMessage] = useState("");

  const [args, setArgs] = useState<any>();
  const [tokenAddress, setTokenAddress] = useState<`0x${string}` | undefined>();

  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [maxSupply, setMaxSupply] = useState("200");
  const [tokenPrice, setTokenPrice] = useState("0.000001");

  const [baseURI, setBaseURI] = useState(mtd);

  useEffect(() => {
    const price = tokenPrice ? parseEther(tokenPrice) : 0n;
    setArgs(
      standart === "ERC20"
        ? [name, symbol, maxSupply, price]
        : [name, symbol, maxSupply, price, baseURI]
    );
  }, [name, symbol, maxSupply, tokenPrice, baseURI]);

  useEffect(() => {
    if (offChain === "error" || onChain === "error") {
      handle({ data: undefined, status: "error" });
    }
    if (offChain === "idle" && onChain === "pending") {
      handle({ data: undefined, status: "idle" });
    }
    if (["pending", "success"].includes(offChain) && onChain === "pending") {
      handle({ data: undefined, status: "pending" });
    }
    if (onChain === "success") {
      handle({ data: tokenAddress, status: "success" });
    }
  }, [offChain, onChain]);

  // useMemo(() => {
  //   if (data?.logs?.[0]?.address) {
  //     setTokenAddress(data.logs[0].address);
  //   }
  // }, [data]);

  useWatchContractEvent({
    address,
    abi,
    eventName,
    onLogs(logs) {
      logs.forEach((log: any) => {
        if (log.transactionHash === hash && log?.args?.tokenAddress) {
          setTokenAddress(log.args.tokenAddress);
        }
      });
    },
  });

  const handleCreate = useCallback(() => {
    if (!address) return;
    console.log(address, functionName, args);
    writeContract({ abi, address, functionName, args });
  }, [abi, address, functionName, args]);

  const handleGenerate = useCallback(() => {
    const random = generateCryptoToken();
    setName(random.name);
    setSymbol(random.symbol);
  }, []);

  return (
    <div className="flex flex-col gap-2">
      <div>{tokenAddress}</div>
      <div>
        <h2 className="sr-only">Steps</h2>

        <div>
          <ol className="grid grid-cols-1 divide-x divide-gray-100 overflow-hidden rounded-lg border border-gray-100 text-sm text-gray-500 sm:grid-cols-3">
            <li className="flex items-center justify-center gap-2 p-4 bg-gray-50">
              <svg
                className="size-7 shrink-0"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
                />
              </svg>

              <p className="leading-none">
                <strong className="block font-medium"> Details </strong>
                <small className="mt-1"> Some info about token. </small>
              </p>
            </li>

            <li className="relative flex items-center justify-center gap-2 p-4">
              <span className="absolute -left-2 top-1/2 hidden size-4 -translate-y-1/2 rotate-45 border border-gray-100 sm:block border-b-0 border-s-0 bg-white"></span>

              <span className="absolute -right-2 top-1/2 hidden size-4 -translate-y-1/2 rotate-45 border border-gray-100 sm:block border-b-0 border-s-0 bg-gray-50"></span>

              <svg
                className="size-7 shrink-0"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>

              <p className="leading-none">
                <strong className="block font-medium"> Allocation </strong>
                <small className="mt-1"> Settings mint token </small>
              </p>
            </li>

            <li className="flex items-center justify-center gap-2 p-4">
              <svg
                className="size-7 shrink-0"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                />
              </svg>

              <p className="leading-none">
                <strong className="block font-medium"> Success </strong>
                <small className="mt-1"> Create token smart contract </small>
              </p>
            </li>
          </ol>
        </div>
      </div>
      <div>
        <Input
          label="Name:"
          placeholder="Token Name"
          value={name}
          setValue={setName}
        />
      </div>
      <div>
        <Input
          label="Symbol:"
          placeholder="Token Symbol"
          value={symbol}
          setValue={setSymbol}
        />
      </div>
      <div>
        <Input
          label="Max Supply:"
          placeholder={`Maximum Tokens`}
          value={maxSupply}
          setValue={setMaxSupply}
        />
      </div>
      <div>
        <Input
          label="Token Price:"
          placeholder={`Price 1 token`}
          value={tokenPrice}
          setValue={setTokenPrice}
        />
      </div>
      {standart === "ERC721" && (
        <div>
          <Input
            label="BaseURI:"
            placeholder={`IPFS list NFTs metadata ipfs://CID/json/`}
            value={baseURI}
            setValue={setBaseURI}
          />
        </div>
      )}
      <div>
        <button onClick={handleGenerate}>Generate</button>
      </div>
      <div>
        <button onClick={handleCreate}>Create</button>
      </div>
    </div>
  );
};

export default Create;
