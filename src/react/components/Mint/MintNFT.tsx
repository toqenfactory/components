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
import { Steps } from "../Approve/Steps";
import { Info, Nft, Spender, Token } from "../Approve/Rows";
import { Button } from "../Approve/Button";
import IconEdit from "../Approve/icons/IconEdit";
import IconCheckSquare from "../Approve/icons/IconCheckSquare";
import IconShield from "../Approve/icons/IconShield";
import IconLayers from "../Approve/icons/IconLayers";
import IconImagePlus from "./icons/IconImagePlus";
import IconUserReceivedLine from "./icons/IconUserReceivedLine";
import IconPicture from "./icons/IconPicture";
import EthAddress from "./EthAddress";

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

const MintNFT = ({
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
  }, [account, isNFT, amount, ids]);

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

  return (
    <div className="min-w-96">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4">
          <div>
            <Steps status={status} />
          </div>
          <div className="flex gap-2">
            <div className="flex-none">{<Nft metadata={metadata} />}</div>
            <div className="flex-1 flex items-center">
              <ul role="list" className="list-none space-y-3 w-full">
                <li>
                  <div className="flex justify-center items-center">
                    <div className="flex">{metadata?.name}</div>
                  </div>
                </li>
                <li>
                  <div className="flex justify-between items-center">
                    <div className="flex justify-between items-center">
                      <span className="w-6 h-6 mr-1">
                        <IconUserReceivedLine />
                      </span>
                      <span className="text-xs">
                        {accountAddress === account ? `You` : `Receiver`}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="w-full relative">
                        <EthAddress
                          initialAddress={account}
                          handler={(newAddress) => setAccount(newAddress)}
                        />
                      </div>
                    </div>
                  </div>
                </li>
                <li>
                  <div className="flex justify-between items-center">
                    <div className="flex justify-between items-center">
                      <span className="w-6 h-6 mr-1">
                        <IconImagePlus />
                      </span>
                      <span className="text-xs">Mint</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="w-full relative">
                        <form className="max-w-xs mx-auto">
                          <div className="relative flex items-center">
                            <button
                              type="button"
                              id="decrement-button"
                              data-input-counter-decrement="counter-input"
                              className="flex-shrink-0 bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 inline-flex items-center justify-center border border-gray-300 rounded-md h-5 w-5 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none"
                              onClick={() =>
                                setIds((ids) => (ids && ids > 1 ? --ids : ids))
                              }
                            >
                              <svg
                                className="w-2.5 h-2.5 text-gray-900 dark:text-white"
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
                              id="counter-input"
                              data-input-counter
                              className="flex-shrink-0 text-gray-900 dark:text-white border-0 bg-transparent text-sm font-normal focus:outline-none focus:ring-0 max-w-[3.5rem] text-center"
                              placeholder=""
                              value={`${ids} NFT`}
                              required
                            />
                            <button
                              type="button"
                              id="increment-button"
                              data-input-counter-increment="counter-input"
                              className="flex-shrink-0 bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 inline-flex items-center justify-center border border-gray-300 rounded-md h-5 w-5 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none"
                              onClick={() =>
                                setIds((ids) =>
                                  ids && BigInt(ids) < (maxSupply ?? 0n)
                                    ? ++ids
                                    : ids
                                )
                              }
                            >
                              <svg
                                className="w-2.5 h-2.5 text-gray-900 dark:text-white"
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
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="w-full">
          <Button
            defaultText={
              <div className="relative">
                Mint
                {parseFloat(eth) > 0 && (
                  <div className="absolute inset-0 top-5 text-xs opacity-50">
                    <span className="font-mono">{eth}</span> ETH
                  </div>
                )}
              </div>
            }
            successText="Done"
            defaultIcon={<IconPicture />}
            successIcon={<IconCheckSquare />}
            status={status}
            handle={handleMint}
          />
        </div>
      </div>
    </div>
  );
};

export default MintNFT;
