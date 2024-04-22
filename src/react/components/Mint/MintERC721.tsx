import { useCallback, useEffect, useMemo, useState } from "react";
import { formatUnits, parseUnits } from "viem";
import {
  useWriteContract,
  useWaitForTransactionReceipt,
  useAccount,
  useReadContracts,
  useWatchContractEvent,
  useBalance,
} from "wagmi";

import { IMetadata, IMint, IStatus } from "../types";

import { abi } from "./utils";

import Steps from "../Steps";
import EthAddressInput from "./EthAddress";
import ActionButton from "../ActionButton";

import IconCheckSquare from "../Icons/IconCheckSquare";
import IconImagePlus from "../Icons/IconImagePlus";
import IconUserReceivedLine from "../Icons/IconUserReceivedLine";
import IconPicture from "../Icons/IconPicture";
import IconPlus from "../Icons/IconPlus";
import IconMinus from "../Icons/IconMinus";
import IconAddress from "../Icons/IconAddress";
import IconCopy from "../Icons/IconCopy";
import IconTags from "../Icons/IconTags";

const IPFS_GATEWAY = "https://ipfs.io/ipfs/";

const MintERC721 = ({ address, steps = true, handle }: IMint) => {
  const { address: accountAddress } = useAccount();
  const { data: balance } = useBalance({ address: accountAddress });

  const contract = { address, abi } as const;
  const functionName = "mint";
  const eventName = "Transfer";

  const [receiver, setReceiver] = useState(accountAddress);
  const [status, setStatus] = useState<IStatus>("idle");
  const [nftIds, setNftIds] = useState<string[] | undefined>();
  const [args, setArgs] = useState<[`0x${string}`, bigint]>();
  const [nftCount, setNftCount] = useState<number | undefined>();
  const [ethAmount, setEthAmount] = useState<string | undefined>();
  const [metadata, setMetadata] = useState<IMetadata | undefined>();
  const [image, setImage] = useState<string | undefined>();

  const { writeContract, status: offChain, data: hash } = useWriteContract(); // offChain: idle -> pending -> success
  const { status: onChain } = useWaitForTransactionReceipt({ hash }); // onChain: pending -> success

  useWatchContractEvent({
    ...contract,
    eventName,
    onLogs(logs) {
      logs.forEach((log: any) => {
        if (log.transactionHash === hash) {
          console.log("Transaction:", hash, log?.args);
          const id = log?.args?.tokenId?.toString() as string | undefined;
          if (id) {
            setNftIds((ids) => (ids ? [...ids, id] : [id]));
          }
        }
      });
    },
  });

  const contracts: any = useMemo(() => {
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
        functionName: "baseURI",
      },
    ];
  }, [address]);
  const query = { enabled: !!contracts };

  const { data } = useReadContracts({ contracts, query });

  const maxSupply = useMemo(() => {
    return data?.[0]?.result as bigint | undefined;
  }, [data]);
  const tokenPrice = useMemo(() => {
    return data?.[1]?.result as bigint | undefined;
  }, [data]);
  const totalSupply = useMemo(() => {
    return data?.[2]?.result as bigint | undefined;
  }, [data]);
  const baseURI = useMemo(() => {
    return data?.[3]?.result as string | undefined;
  }, [data]);

  useEffect(() => {
    if (totalSupply === undefined || baseURI === undefined) return;

    const fetchMetadata = async () => {
      const response = await fetch(
        `${IPFS_GATEWAY}${baseURI.replace(/ipfs:\/\//g, "")}${(
          totalSupply + 1n
        ).toString()}`
      );

      if (!response.ok) return;
      const metadata = await response.json();
      metadata.image = /^ipfs/.test(metadata.image)
        ? `${IPFS_GATEWAY}${metadata.image.replace(/ipfs:\/\//g, "")}`
        : metadata.image;

      setMetadata(metadata);
      if (image === undefined) setImage(metadata.image);
    };

    fetchMetadata();
  }, [totalSupply, baseURI]);

  useEffect(() => {
    const data = undefined;

    if (offChain === "error" || onChain === "error") {
      handle({ data, hash, status: "error" });
      setStatus("error");
    }
    if (onChain === "pending") {
      if (offChain === "idle") {
        handle({ data, hash, status: "idle" });
        setStatus("idle");
      } else if (offChain === "pending") {
        handle({ data, hash, status: "wallet" });
        setStatus("wallet");
      } else if (offChain === "success") {
        handle({ data, hash, status: "pending" });
        setStatus("pending");
      }
    }
    if (onChain === "success") {
      setTimeout(() => {
        if (status !== "success") {
          console.error("Transaction:", hash);
        }
      }, 15_000);
    }
  }, [hash, offChain, onChain]);

  useEffect(() => {
    if (nftIds === undefined) return;

    if (nftIds.length === nftCount) {
      handle({ data: nftIds, hash, status: "success" });
      setStatus("success");
    }
  }, [nftIds]);

  useEffect(() => {
    if (receiver === undefined || tokenPrice === undefined) return;

    const _nftCount = nftCount ?? 1;
    const _ethAmount =
      tokenPrice > 0n
        ? formatUnits(
            (parseUnits(_nftCount.toString(), 18) * tokenPrice) / 10n ** 18n,
            18
          )
        : "0";

    setArgs([receiver, BigInt(_nftCount)]);
    setNftCount(_nftCount);
    setEthAmount(_ethAmount);
  }, [receiver, tokenPrice, nftCount]);

  const handleMint = useCallback(() => {
    if (!address) return;
    const value = parseUnits(ethAmount ?? "0", 18);
    writeContract({ abi, address, functionName, args, value });

    console.log("args", args, value);
  }, [address, functionName, args, ethAmount]);

  const BtnText = () => (
    <div className="relative">
      <div className={ethAmount && `transform -translate-y-2`}>Mint</div>
      {ethAmount && (
        <div className="absolute inset-0 top-5 text-xs opacity-50">
          <span className="font-mono">{ethAmount}</span> {balance?.symbol}
        </div>
      )}
    </div>
  );

  if (!address)
    return (
      <div className="flex justify-center items-center text-slate-700 dark:text-slate-500 text-xl font-extrabold">
        Token Address Not Found
      </div>
    );

  return (
    <div className="w-96">
      <div className="flex flex-col gap-2 w-full">
        <div className="flex flex-col gap-2 w-full">
          {steps && (
            <div>
              <Steps status={status} />
            </div>
          )}
          <div className="flex-none flex gap-2">
            {metadata && image && (
              <div className="flex-none">
                <div className="flex justify-center items-center rounded-xl overflow-hidden w-full h-full">
                  <img
                    src={image}
                    className="w-24 h-24 object-cover rounded-xl"
                    alt={`NFT Collection: ${address}`}
                  ></img>
                </div>
              </div>
            )}
            {status === "success" ? (
              <div className="flex-1 flex items-center">
                <ul role="list" className="list-none space-y-3 w-full">
                  <li>
                    <div className="relative flex justify-center items-center h-6">
                      <div className="absolute w-full px-2 text-center">
                        <div className="text-nowrap overflow-hidden text-ellipsis font-extrabold">
                          Add NFT to wallet
                        </div>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="flex justify-between items-center">
                      <div className="flex justify-between items-center mr-1">
                        <span className="w-6 h-6 mr-1 text-slate-400 dark:text-slate-500">
                          <IconAddress />
                        </span>
                        <span className="text-xs">Address</span>
                      </div>
                      {address && (
                        <div className="flex justify-center items-center">
                          <span
                            className="text-xs underline underline-offset-4 decoration-dotted font-mono font-extrabold text-slate-400 dark:text-slate-500 mx-1"
                            title={address}
                          >
                            <a
                              href={`https://etherscan.io/address/${address}`}
                              target="_blank"
                            >
                              {address.substring(0, 5)}..
                              {address.substring(address.length - 4)}
                            </a>
                          </span>
                          <IconCopy
                            className="ml-3 w-4 h-4 text-slate-400 dark:text-slate-500 hover:cursor-pointer hover:scale-105 active:text-sky-500 -translate-x-1"
                            onClick={() => {
                              navigator.clipboard
                                .writeText(address)
                                .catch((err) =>
                                  console.error("Failed to copy text:", err)
                                );
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </li>
                  <li>
                    <div className="flex justify-between items-center w-full">
                      <div className="flex-none flex justify-center items-center">
                        <span className="w-6 h-6 mr-1 text-slate-400 dark:text-slate-500">
                          <IconTags />
                        </span>
                        <span className="text-xs">IDs</span>
                      </div>
                      {nftIds && (
                        <div className="flex">
                          {nftIds.length < 3 ? (
                            nftIds.map((id) => (
                              <span
                                key={id}
                                className="rounded-md bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-50 font-extrabold px-1 mx-1"
                              >
                                {id}
                              </span>
                            ))
                          ) : (
                            <>
                              <span className="rounded-md bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-50 font-extrabold px-1 mx-1">
                                {nftIds[0]}
                              </span>
                              {" - "}
                              <span className="rounded-md bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-50 font-extrabold px-1 mx-1">
                                {nftIds[nftIds.length - 1]}
                              </span>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="flex-1 flex items-center">
                <ul role="list" className="list-none space-y-3 w-full">
                  <li>
                    <div className="relative flex justify-center items-center h-6">
                      <div className="absolute w-full px-2 text-center">
                        <div className="text-nowrap overflow-hidden text-ellipsis font-extrabold">
                          {metadata?.name}
                        </div>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="flex justify-between items-center">
                      <div className="flex justify-between items-center mr-1">
                        <span className="w-6 h-6 mr-1 text-slate-400 dark:text-slate-500">
                          <IconUserReceivedLine />
                        </span>
                        <span className="text-xs">Receiver</span>
                      </div>
                      <div className="relative w-full">
                        <EthAddressInput
                          initialAddress={receiver}
                          defaultText={
                            accountAddress === receiver
                              ? `You will receive NFT`
                              : undefined
                          }
                          handler={(newAddress) => setReceiver(newAddress)}
                        />
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="flex justify-between items-center">
                      <div className="flex justify-between items-center">
                        <span className="w-6 h-6 mr-1 text-slate-400 dark:text-slate-500">
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
                                  setNftCount((nftCount) =>
                                    nftCount && nftCount > 1
                                      ? --nftCount
                                      : nftCount
                                  )
                                }
                              >
                                <IconMinus />
                              </button>
                              <input
                                type="text"
                                id="counter-input"
                                className="flex-shrink-0 text-gray-900 dark:text-white border-0 bg-transparent text-sm font-normal focus:outline-none focus:ring-0 max-w-[3.5rem] text-center"
                                placeholder=""
                                value={`${nftCount ?? 0} NFT`}
                                readOnly
                                required
                              />
                              <button
                                type="button"
                                id="increment-button"
                                data-input-counter-increment="counter-input"
                                className="flex-shrink-0 bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 inline-flex items-center justify-center border border-gray-300 rounded-md h-5 w-5 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none"
                                onClick={() =>
                                  setNftCount((nftCount) =>
                                    nftCount &&
                                    BigInt(nftCount) + (totalSupply ?? 0n) <
                                      (maxSupply ?? 0n)
                                      ? ++nftCount
                                      : nftCount
                                  )
                                }
                              >
                                <IconPlus />
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
        <div className="w-full">
          <ActionButton
            defaultText={<BtnText />}
            successText="Done"
            defaultIcon={<IconPicture />}
            successIcon={<IconCheckSquare />}
            status={status}
            onClick={handleMint}
          />
        </div>
      </div>
    </div>
  );
};

export default MintERC721;
