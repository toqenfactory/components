import { useCallback, useEffect, useMemo, useState } from "react";
import {
  useWriteContract,
  useWaitForTransactionReceipt,
  useAccount,
  useReadContract,
  useReadContracts,
  useBalance,
} from "wagmi";

import { formatUnits, parseUnits } from "viem";
import IconArrowDown from "./icons/IconArrowDown";
import IconRepeat from "./icons/IconRepeat";
import IconImage from "./icons/IconImage";

const abi = [
  {
    type: "function",
    name: "maxSupply",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "tokenPrice",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "totalSupply",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "symbol",
    inputs: [],
    outputs: [{ name: "", type: "string", internalType: "string" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "balanceOf",
    inputs: [{ name: "account", type: "address", internalType: "address" }],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "mint",
    inputs: [
      { name: "account", type: "address", internalType: "address" },
      { name: "amount", type: "uint256", internalType: "uint256" },
    ],
    outputs: [],
    stateMutability: "payable",
  },
  {
    inputs: [],
    stateMutability: "view",
    type: "function",
    name: "baseURI",
    outputs: [{ internalType: "string", name: "", type: "string" }],
  },
];

const Mint = ({
  address,
  handle,
}: {
  address: `0x${string}` | undefined;
  handle: ({
    data,
    status,
  }: {
    data: string | undefined;
    status: "idle" | "wallet" | "pending" | "success" | "error";
  }) => void;
}) => {
  const { address: accountAddress } = useAccount();
  const [account, setAccount] = useState(accountAddress);
  const { data: balance, refetch: refetchBalance } = useBalance({
    address: accountAddress,
  });

  const {
    writeContract,
    status: offChain,
    data: hash,
    error,
  } = useWriteContract(); // offChain: idle -> pending -> success
  const { status: onChain } = useWaitForTransactionReceipt({ hash }); // onChain: pending -> success

  console.log("Mint error", error);

  const contracts: any = useMemo(() => {
    const contract = { address, abi } as const;
    return [
      {
        ...contract,
        functionName: "maxSupply",
      },
      {
        ...contract,
        functionName: "tokenPrice",
      },
      {
        ...contract,
        functionName: "totalSupply",
      },
      {
        ...contract,
        functionName: "symbol",
      },
      {
        ...contract,
        functionName: "baseURI",
      },
    ];
  }, [address, account, accountAddress]);
  const query = { enabled: !!contracts };

  const { data, refetch } = useReadContracts({ contracts, query });
  const { data: balanceOf, refetch: refetchBalanceOf }: any = useReadContract({
    address,
    abi,
    functionName: "balanceOf",
    args: [account],
  });

  console.log("data", data);

  const maxSupply = useMemo(
    () => data?.[0]?.result as bigint | undefined,
    [data]
  );
  const tokenPrice = useMemo(
    () => data?.[1]?.result as bigint | undefined,
    [data]
  );
  const totalSupply = useMemo(
    () => data?.[2]?.result as bigint | undefined,
    [data]
  );
  const symbol = useMemo(() => data?.[3]?.result as string | undefined, [data]);
  const baseURI = useMemo(
    () => data?.[4]?.result as string | undefined,
    [data]
  );
  const isNFT = useMemo(() => baseURI !== undefined, [baseURI]);

  const [status, setStatus] = useState<
    "idle" | "wallet" | "pending" | "success" | "error"
  >("idle");

  const [args, setArgs] = useState<any>();
  const [ids, setIds] = useState<number | undefined>(1);
  const [amount, setAmount] = useState("");
  const [eth, setEth] = useState("");
  const functionName = "mint";

  const [metadata, setMetadata] = useState<{
    name: string;
    description: string;
    image: string;
    external_url: string;
  }>({
    name: "",
    description: "",
    image: "",
    external_url: "",
  });

  useEffect(() => {
    setArgs([account, isNFT ? ids : parseUnits(amount, 18)]);
  }, [account, amount, ids]);

  useEffect(() => {
    refetchBalanceOf();
  }, [account]);

  useEffect(() => {
    if (totalSupply === undefined || baseURI === undefined) return;

    const fetchMetadata = async () => {
      const response = await fetch(
        `https://ipfs.io/ipfs/${baseURI.replace(/ipfs:\/\//g, "")}${(
          totalSupply + 1n
        ).toString()}`
      );

      if (!response.ok) return;

      const metadata = await response.json();

      metadata.image = /^ipfs/.test(metadata.image)
        ? `https://ipfs.io/ipfs/${metadata.image.replace(/ipfs:\/\//g, "")}`
        : metadata.image;

      setMetadata(metadata);
    };

    fetchMetadata();
  }, [totalSupply, baseURI]);

  useEffect(() => {
    if (offChain === "error" || onChain === "error") {
      handle({ data: undefined, status: "error" });
      setStatus("error");
    }
    if (onChain === "pending") {
      if (offChain === "idle") {
        handle({ data: undefined, status: "idle" });
        setStatus("idle");
      } else if (offChain === "pending") {
        handle({ data: undefined, status: "wallet" });
        setStatus("wallet");
      } else if (offChain === "success") {
        handle({ data: undefined, status: "pending" });
        setStatus("pending");
      }
    }
    if (onChain === "success") {
      handle({ data: undefined, status: "success" });
      setStatus("success");
    }
  }, [offChain, onChain]);

  useEffect(() => {
    if (status === "success") {
      setAmount("");
      setIds((ids) =>
        BigInt(ids ?? 0) + (totalSupply ?? 0n) >= (maxSupply ?? 0) ? 0 : 1
      );
      setEth("");
      refetch();
      refetchBalance();
      refetchBalanceOf();
    }
  }, [status]);

  useEffect(() => {
    setIds(1);
  }, [tokenPrice]);

  useEffect(() => {
    if (tokenPrice === undefined || ids === undefined) return;

    const eth =
      tokenPrice > 0n
        ? formatUnits(
            (parseUnits(ids.toString(), 18) * tokenPrice) / 10n ** 18n,
            18
          )
        : "0";

    if (isNFT) setEth(eth);
  }, [tokenPrice, ids]);

  const handleMint = useCallback(() => {
    if (!address || (!amount && !isNFT)) return;
    const value = parseUnits(eth, 18);
    console.log("args", args, value);
    writeContract({ abi, address, functionName, args, value });
  }, [address, functionName, args, amount, eth, tokenPrice]);

  const handleAmount = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (
        tokenPrice === undefined ||
        totalSupply === undefined ||
        maxSupply === undefined
      )
        return;

      let input = e.currentTarget.value;
      if (!input) {
        setAmount("");
        setEth("");
      }

      const [whole, fraction = ""] = input.replace(/[^0-9\.]/g, "").split(".");
      let amount = whole + "." + fraction.padEnd(18, "0").slice(0, 18);

      if (parseUnits(amount, 18) + totalSupply > maxSupply) {
        amount = formatUnits(maxSupply - totalSupply, 18);
        input = amount;
      }

      const eth =
        tokenPrice > 0n
          ? formatUnits((parseUnits(amount, 18) * tokenPrice) / 10n ** 18n, 18)
          : "0";

      setEth(eth);
      setAmount(input.replace(/[^0-9\.]/g, ""));
    },
    [amount, tokenPrice]
  );

  const handleEth = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (
        tokenPrice === undefined ||
        totalSupply === undefined ||
        maxSupply === undefined ||
        tokenPrice <= 0n
      )
        return;

      let input = e.currentTarget.value;
      if (!input) {
        setAmount("");
        setEth("");
      }

      const [whole, fraction = ""] = input.replace(/[^0-9\.]/g, "").split(".");
      const eth = whole + "." + fraction.padEnd(18, "0").slice(0, 18);
      let amount = formatUnits(
        (parseUnits(eth, 18) * 10n ** 18n) / tokenPrice,
        18
      );

      if (parseUnits(amount, 18) + totalSupply > maxSupply) {
        amount = formatUnits(maxSupply - totalSupply, 18);
        input =
          tokenPrice > 0n
            ? formatUnits(
                (parseUnits(amount, 18) * tokenPrice) / 10n ** 18n,
                18
              )
            : "0";
      }

      setAmount(amount);
      setEth(input.replace(/[^0-9\.]/g, ""));
    },
    [eth, tokenPrice]
  );

  console.log("metadata", metadata);

  return (
    <div className="min-w-96">
      {isNFT ? (
        <div className="w-full">
          <div className="grid grid-cols-2 grid-rows-1 gap-2">
            <div className="row-span-1 col-span-1 rounded-xl overflow-hidden">
              <img
                src={metadata?.image}
                className={`w-full h-full object-cover rounded-xl ${
                  status === "wallet" || status === "pending"
                    ? `animate-pulse`
                    : ``
                }`}
              ></img>
            </div>
            <div className="row-span-1 col-span-1 overflow-hidden relative">
              <div className="flex flex-col justify-center items-center gap-4 w-full h-full">
                <div className="flex-none whitespace-nowrap w-full text-center">
                  <span className="text-slate-400 font-extrabold text-4xl">
                    {metadata?.name}
                  </span>
                </div>
                <div className="flex-1 flex flex-col justify-between w-full">
                  <div>{metadata?.description}</div>
                  <div className="flex flex-row justify-between w-full gap-4">
                    <div className="flex flex-col justify-between items-start text-xs text-slate-400 w-1/2">
                      <div>Receiver:</div>
                      <div className="w-full relative">
                        <input
                          type="text"
                          className="w-full rounded-md py-1 pr-4 bg-transparent focus:outline focus:outline-slate-300 dark:focus:outline-slate-700"
                          value={account}
                          onChange={(e) =>
                            setAccount(e.currentTarget.value as `0x${string}`)
                          }
                          spellCheck={false}
                        ></input>
                        <div className="absolute inset-y-0 right-2 top-1">
                          ...
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col justify-between items-start text-xs text-slate-400 w-1/2">
                      <div>
                        {accountAddress === account ? `You` : `Receiver`} Have:
                      </div>
                      <div className="w-full font-extrabold text-lg text-center">
                        {balanceOf?.toString()} NFTs
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex-none w-full">
                  <div className="flex justify-center gap-4">
                    <div className="flex flex-col justify-between text-xs text-slate-400 w-1/2">
                      <form className="max-w-xs mx-auto">
                        <div className="relative flex items-center">
                          <button
                            type="button"
                            id="decrement-button"
                            data-input-counter-decrement="bedrooms-input"
                            className="bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 border border-gray-300 rounded-s-lg p-3 h-12 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none"
                            onClick={() =>
                              setIds((ids) => (ids && ids > 1 ? --ids : ids))
                            }
                          >
                            <svg
                              className="w-3 h-3 text-gray-900 dark:text-white"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 18 2"
                            >
                              <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M1 1h16"
                              />
                            </svg>
                          </button>
                          <input
                            type="text"
                            id="bedrooms-input"
                            data-input-counter
                            data-input-counter-min="1"
                            data-input-counter-max="5"
                            aria-describedby="helper-text-explanation"
                            className="bg-gray-50 border-x-0 border-gray-300 h-12 font-medium text-center text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full pb-6 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder=""
                            value={ids}
                            required
                            readOnly
                          />
                          <div className="absolute bottom-1 start-1/2 -translate-x-1/2 rtl:translate-x-1/2 flex items-center text-xs text-gray-400 space-x-1 rtl:space-x-reverse">
                            <span>{eth} ETH</span>
                          </div>
                          <button
                            type="button"
                            id="increment-button"
                            data-input-counter-increment="bedrooms-input"
                            className="bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 border border-gray-300 rounded-e-lg p-3 h-12 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none"
                            onClick={() =>
                              setIds((ids) =>
                                ids && BigInt(ids) < (maxSupply ?? 0n)
                                  ? ++ids
                                  : ids
                              )
                            }
                          >
                            <svg
                              className="w-3 h-3 text-gray-900 dark:text-white"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 18 18"
                            >
                              <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M9 1v16M1 9h16"
                              />
                            </svg>
                          </button>
                        </div>
                      </form>
                    </div>
                    <div className="w-1/2">
                      <button
                        onClick={handleMint}
                        type="button"
                        disabled={status === "pending"}
                        className="group relative overflow-hidden w-full text-slate-400 hover:text-slate-600 bg-gradient-to-r from-slate-100 to-slate-300 hover:bg-gradient-to-r hover:from-slate-300 hover:to-slate-300 dark:text-slate-400 dark:hover:text-slate-200 dark:bg-gradient-to-r dark:from-slate-500 dark:to-slate-700 dark:hover:bg-gradient-to-r dark:hover:from-slate-700 dark:hover:to-slate-700 focus:ring-0 focus:outline-none font-medium rounded-lg text-xl px-5 py-2.5 text-center lowercase"
                      >
                        {status === "wallet"
                          ? `open wallet ...`
                          : status === "pending"
                          ? `please wait ...`
                          : `mint`}
                        <span
                          className={`absolute w-12 h-12 inset-y-0 -top-0 right-2 opacity-10 fill-slate-700 ${
                            status === "wallet" || status === "pending"
                              ? `animate-ping`
                              : `group-hover:scale-110`
                          }`}
                        >
                          <IconImage />
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full">
          <div className="relative flex flex-col items-center justify-between gap-2 rounded-xl p-1">
            <div className="w-full h-32 bg-slate-50 dark:bg-slate-800 rounded-xl px-4 py-2 border border-slate-50 dark:border-slate-800 hover:border-slate-300 hover:dark:border-slate-700">
              <label htmlFor="you-pay" className="text-xs text-slate-500">
                You Pay
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="you-pay"
                  value={eth}
                  onChange={handleEth}
                  className="block font-extrabold w-full p-4 pl-0 pr-20 text-3xl bg-slate-50 text-slate-600 border-0 rounded-lg dark:bg-slate-800 dark:border-slate-100 dark:placeholder-slate-400 dark:text-slate-50 placeholder:text-slate-300 focus:ring-0 focus:outline-0"
                  placeholder="0"
                  required
                />
                <div className="text-slate-600 font-extrabold inset-y-0 absolute top-4 right-0 h-9 bg-slate-100 rounded-lg text-sm px-4 py-2 dark:text-slate-50 dark:bg-slate-900 shadow-xs">
                  ETH
                </div>
                <div className="text-right text-xs text-slate-500">
                  <span>Balance:</span>{" "}
                  <span>
                    {parseFloat(formatUnits(balance?.value ?? 0n, 18)).toFixed(
                      3
                    )}
                  </span>
                </div>
              </div>
            </div>

            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <IconArrowDown
                className={`${
                  (status === "wallet" || status === "pending") &&
                  `animate-bounce`
                } w-10 h-10 text-slate-500 bg-slate-100 dark:bg-slate-800 font-extrabold rounded-xl px-2 py-1 border-2 border-white dark:border-slate-700`}
              />
            </div>

            <div className="w-full h-32 bg-slate-50 dark:bg-slate-800 rounded-xl px-4 py-2 border border-slate-50 dark:border-slate-800 hover:border-slate-300 hover:dark:border-slate-700">
              <label htmlFor="you-receive" className="text-xs text-slate-500">
                You Receive
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="you-receive"
                  value={amount}
                  onChange={handleAmount}
                  className="block font-extrabold w-full p-4 pl-0 pr-20 text-3xl bg-slate-50 text-slate-600 border-0 rounded-lg dark:bg-slate-800 dark:border-slate-100 dark:placeholder-slate-400 dark:text-slate-50 placeholder:text-slate-300 focus:ring-0 focus:outline-0"
                  placeholder="0"
                  required
                />
                <div className="text-slate-600 font-extrabold inset-y-0 absolute top-4 right-0 h-9 bg-slate-100 rounded-lg text-sm px-4 py-2 dark:text-slate-50 dark:bg-slate-900 shadow-xs">
                  {symbol}
                </div>
                <div className="flex justify-between w-full">
                  <div className="relative text-xs text-slate-300 dark:text-slate-600">
                    {accountAddress === account ? `You:` : `Receiver:`}
                    <input
                      type="text"
                      value={account}
                      className="px-1 pr-4 mx-1 bg-slate-50 dark:bg-slate-800 rounded-sm focus:outline focus:outline-slate-300 dark:focus:outline-slate-600"
                      onChange={(e) =>
                        setAccount(e.currentTarget.value as `0x${string}`)
                      }
                      spellCheck={false}
                    ></input>
                    <div className="absolute inset-y-0 right-2 top-0">...</div>
                  </div>
                  <div className="text-right text-xs text-slate-500">
                    <span>Balance:</span>{" "}
                    <span>
                      {parseFloat(formatUnits(balanceOf ?? 0n, 18)).toFixed(3)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-2">
            <button
              onClick={handleMint}
              type="button"
              disabled={status === "pending"}
              className="group relative overflow-hidden w-full text-slate-400 hover:text-slate-600 bg-gradient-to-r from-slate-100 to-slate-300 hover:bg-gradient-to-r hover:from-slate-300 hover:to-slate-300 dark:text-slate-400 dark:hover:text-slate-200 dark:bg-gradient-to-r dark:from-slate-500 dark:to-slate-700 dark:hover:bg-gradient-to-r dark:hover:from-slate-700 dark:hover:to-slate-700 focus:ring-0 focus:outline-none font-medium rounded-lg text-xl px-5 py-2.5 text-center lowercase"
            >
              {status === "wallet"
                ? `open wallet ...`
                : status === "pending"
                ? `please wait ...`
                : `swap`}
              <span
                className={`absolute w-12 h-12 inset-y-0 -top-0 right-2 opacity-10 fill-slate-700 ${
                  status === "wallet" || status === "pending"
                    ? `animate-ping`
                    : `group-hover:scale-110`
                }`}
              >
                <IconRepeat />
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Mint;
