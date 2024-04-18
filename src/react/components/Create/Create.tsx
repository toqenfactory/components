import { useCallback, useEffect, useMemo, useState } from "react";
import {
  useWriteContract,
  useWaitForTransactionReceipt,
  useWatchContractEvent,
} from "wagmi";
import { parseUnits } from "viem";

import { abi, generate } from "./utils";
import Steps from "./Steps";
import IconChevronRight from "./icons/IconChevronRight";
import IconChevronLeft from "./icons/IconChevronLeft";
import IconGrid from "./icons/IconGrid";
import IconCopy from "./icons/IconCopy";

const mtd =
  "ipfs://bafybeieyb62vnkv46zr5mw3nfqlhcxt7v2frd2tu6k3cwgkqfgwmnyflme/";

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
    status: "idle" | "wallet" | "pending" | "success" | "error";
  }) => void;
}) => {
  const {
    writeContract,
    status: offChain,
    data: hash,
    error,
  } = useWriteContract(); // offChain: idle -> pending -> success
  const { data, status: onChain } = useWaitForTransactionReceipt({ hash }); // onChain: pending -> success

  const eventName = "TokenCreated";
  const functionName = useMemo(() => `create${standart}`, [standart]);

  console.log(error);

  const [step, setStep] = useState(1);
  const [status, setStatus] = useState("");

  const [args, setArgs] = useState<any>();
  const [tokenAddress, setTokenAddress] = useState<`0x${string}` | undefined>();

  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [maxSupply, setMaxSupply] = useState("18000000");
  const [tokenPrice, setTokenPrice] = useState("0.000001");

  const [baseURI, setBaseURI] = useState(mtd);

  useEffect(() => {
    const price = tokenPrice ? parseUnits(tokenPrice, 18) : 0n;
    setArgs(
      standart === "ERC20"
        ? [name, symbol, parseUnits(maxSupply, 18), price]
        : [name, symbol, parseUnits(maxSupply, 0), price, baseURI]
    );
  }, [name, symbol, maxSupply, tokenPrice, baseURI]);

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
      handle({ data: tokenAddress, status: "success" });
      setStatus("success");
    }

    const tokenAddressByReceipt = data?.logs?.[0]?.topics?.[1];
    if (tokenAddressByReceipt) {
      console.log("tokenAddressByReceipt", tokenAddressByReceipt);
      if (!tokenAddress)
        setTokenAddress(`0x${tokenAddressByReceipt.slice(26)}`);
    }
  }, [offChain, onChain, data]);

  useWatchContractEvent({
    address,
    abi,
    eventName,
    onLogs(logs) {
      logs.forEach((log: any) => {
        if (log.transactionHash === hash && log?.args?.tokenAddress) {
          console.log("log.args.tokenAddress", log.args.tokenAddress);
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
    const random = generate();
    setName(random.name);
    setSymbol(random.symbol);
    setTokenAddress(undefined);
    setStatus("");
    setStep(1);
  }, []);

  useEffect(() => handleGenerate(), [standart]);

  return (
    <div className="flex flex-col gap-2 min-w-96">
      <Steps step={step} />
      {step === 1 && (
        <>
          <div className="w-full">
            <label
              htmlFor="search"
              className="mb-2 text-sm font-medium text-slate-900 sr-only dark:text-slate-50"
            >
              Token Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                Token Name:
              </div>
              <input
                type="search"
                id="search"
                className="block shadow-sm font-extrabold w-full p-4 ps-32 text-lg text-slate-900 border-0 rounded-lg  dark:bg-slate-700 dark:border-slate-100 dark:placeholder-slate-400 dark:text-slate-50 placeholder:text-slate-100 focus:ring-0 focus:outline-0"
                placeholder="Token Name"
                value={name}
                onChange={(e) => {
                  setName(e.currentTarget.value);
                }}
                required
              />
              <button
                type="submit"
                className="text-slate-950 absolute end-3 bottom-3 bg-slate-100 hover:bg-slate-50 focus:ring-0 focus:outline-none rounded-lg text-sm px-4 py-2 dark:text-slate-50 dark:bg-slate-800 dark:hover:bg-slate-900 ring-0 outline-0 shadow-xs"
                onClick={handleGenerate}
              >
                AI 😂 Generate
              </button>
            </div>
          </div>
          <div className="w-full">
            <input
              type="text"
              className="block w-full p-0 text-center text-6xl font-extrabold text-slate-700 dark:text-slate-50 placeholder:text-slate-100 dark:placeholder:text-slate-700 ring-0 border-0 outline-0 bg-transparent"
              placeholder="Token Symbol"
              value={symbol}
              onChange={(e) => {
                setSymbol(e.currentTarget.value.toUpperCase());
              }}
              required
            />
          </div>
        </>
      )}
      {step === 2 && (
        <>
          <div className="w-full">
            <label
              htmlFor="max-supply"
              className="mb-2 text-sm font-medium text-slate-900 sr-only dark:text-slate-50"
            >
              Max Supply
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                Max Supply:
              </div>
              <input
                type="text"
                id="max-supply"
                className="block shadow-sm w-full p-4 ps-32 text-lg font-extrabold text-slate-900 border-0 rounded-lg  dark:bg-slate-700 dark:border-slate-100 dark:placeholder-slate-400 dark:text-slate-50 placeholder:text-slate-100 focus:ring-0 focus:outline-0"
                placeholder="18000000"
                value={maxSupply}
                onChange={(e) => {
                  setMaxSupply(e.currentTarget.value);
                }}
                required
              />
              <div className="text-slate-950 absolute end-3 bottom-3 bg-slate-100 rounded-lg text-sm px-4 py-2 dark:bg-slate-800 dark:text-slate-50">
                {symbol}
              </div>
            </div>
          </div>
          <div className="w-full">
            <label
              htmlFor="max-supply"
              className="mb-2 text-sm font-medium text-slate-900 sr-only dark:text-slate-50"
            >
              Token Price
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                1{" "}
                <div className="text-slate-950 bg-slate-100 rounded-lg text-sm px-4 py-2 mx-2 dark:bg-slate-800 dark:text-slate-50">
                  {symbol}
                </div>{" "}
                =
              </div>
              <input
                type="text"
                id="max-supply"
                className="block shadow-sm w-full p-4 ps-32 text-lg font-extrabold text-slate-900 border-0 rounded-lg  dark:bg-slate-700 dark:border-slate-100 dark:placeholder-slate-400 dark:text-slate-50 placeholder:text-slate-100 focus:ring-0 focus:outline-0"
                placeholder="18000000"
                value={tokenPrice}
                onChange={(e) => {
                  setTokenPrice(e.currentTarget.value);
                }}
                required
              />
              <div className="text-slate-950 absolute end-3 bottom-3 bg-slate-100 rounded-lg text-sm px-4 py-2 dark:bg-slate-800 dark:text-slate-50 ring-0 outline-0">
                ETH
              </div>
            </div>
          </div>
          {standart === "ERC721" && (
            <div className="w-full">
              <label
                htmlFor="max-supply"
                className="mb-2 text-sm font-medium text-slate-900 sr-only dark:text-slate-50"
              >
                Base URI
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                  Base URI:
                </div>
                <input
                  type="text"
                  id="max-supply"
                  className="block shadow-sm w-full p-4 ps-32 text-lg font-extrabold text-slate-900 border-0 rounded-lg dark:bg-slate-700 dark:border-slate-100 dark:placeholder-slate-400 dark:text-slate-50 placeholder:text-slate-100 focus:ring-0 focus:outline-0"
                  placeholder="ipfs://CID/json/"
                  value={baseURI}
                  onChange={(e) => {
                    setBaseURI(e.currentTarget.value);
                  }}
                  required
                />
                <a
                  href="https://bafybeieyb62vnkv46zr5mw3nfqlhcxt7v2frd2tu6k3cwgkqfgwmnyflme.ipfs.dweb.link/"
                  target="_blank"
                >
                  <div className="absolute end-3 bottom-3 rounded-lg text-sm px-4 py-2 bg-slate-100 text-slate-950 dark:bg-slate-800 dark:text-slate-50 ring-0 outline-0">
                    ?
                  </div>
                </a>
              </div>
            </div>
          )}
        </>
      )}
      {step === 3 &&
        (tokenAddress ? (
          <div className="flex justify-center items-center content-center">
            <div className="flex items-center text-slate-50 text-md font-extrabold my-4 rounded-md py-4 px-8 bg-slate-600 dark:bg-slate-950">
              <div className="font-extrabold text-slate-100 bg-slate-500 rounded-md px-2 py-1 mx-1">
                ${symbol}
              </div>{" "}
              : {tokenAddress}{" "}
              <IconCopy
                className="ml-4 w-6 h-6 hover:cursor-pointer hover:scale-105"
                onClick={() => {
                  navigator.clipboard
                    .writeText(tokenAddress)
                    .catch((err) =>
                      console.error("Failed to copy text: ", err)
                    );
                }}
              />
            </div>
          </div>
        ) : (
          <ul
            role="list"
            className="marker:text-slate-800 dark:marker:text-slate-100 list-disc pl-5 space-y-3 text-slate-400"
          >
            <li>
              $
              <span className="bg-slate-100 text-slate-950 dark:bg-slate-800 dark:text-slate-50 rounded-md px-2 py-1 mx-1">
                {symbol}
              </span>
              :{" "}
              <span className="text-slate-950 dark:text-slate-50 font-extrabold">
                {name}
              </span>
            </li>
            <li>
              Max Sypply:{" "}
              <span className="text-slate-950 dark:text-slate-50 font-extrabold">
                {maxSupply.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              </span>{" "}
              <span className="bg-slate-100 text-slate-950 dark:bg-slate-800 dark:text-slate-50 rounded-md px-2 py-1 mx-1">
                {symbol}
              </span>
            </li>
            <li>
              <span>Mint Price:</span> 1{" "}
              <span className="bg-slate-100 text-slate-950 dark:bg-slate-800 dark:text-slate-50 rounded-md px-2 py-1 mx-1">
                {symbol}
              </span>{" "}
              ={" "}
              <span className="font-extrabold text-slate-950 dark:text-slate-50">
                {tokenPrice}
              </span>{" "}
              ETH
            </li>
            {standart === "ERC721" && (
              <li>
                Base URI:{" "}
                <span className="font-extrabold text-slate-950 dark:text-slate-50">
                  <a
                    href={baseURI}
                    target="_blank"
                    className=" underline underline-offset-8 decoration-dotted"
                  >
                    {`${baseURI.substring(0, 12)}..${baseURI.substring(
                      baseURI.length - 12
                    )}`}
                  </a>
                </span>
              </li>
            )}
          </ul>
        ))}
      <div className="w-full flex gap-2 mt-4">
        {step > 1 && (
          <div className="flex-1">
            <button
              onClick={() => setStep((step) => step - 1)}
              type="button"
              className="group relative overflow-hidden w-full text-slate-400 hover:text-slate-600 bg-gradient-to-l from-slate-100 to-slate-300 hover:bg-gradient-to-l hover:from-slate-300 hover:to-slate-300 dark:text-slate-400 dark:hover:text-slate-200 dark:bg-gradient-to-l dark:from-slate-500 dark:to-slate-700 dark:hover:bg-gradient-to-l dark:hover:from-slate-700 dark:hover:to-slate-700 focus:ring-0 focus:outline-none font-medium rounded-lg text-xl px-5 py-2.5 text-center lowercase"
            >
              prev
              <span className="absolute w-16 h-16 inset-y-0 -top-2 left-0 opacity-10 fill-slate-700 group-hover:-translate-x-1">
                <IconChevronLeft />
              </span>
            </button>
          </div>
        )}
        {step < 3 && (
          <div className="flex-1">
            <button
              onClick={() => setStep((step) => step + 1)}
              type="button"
              className="group relative overflow-hidden w-full text-slate-400 hover:text-slate-600 bg-gradient-to-r from-slate-100 to-slate-300 hover:bg-gradient-to-r hover:from-slate-300 hover:to-slate-300 dark:text-slate-400 dark:hover:text-slate-200 dark:bg-gradient-to-r dark:from-slate-500 dark:to-slate-700 dark:hover:bg-gradient-to-r dark:hover:from-slate-700 dark:hover:to-slate-700 focus:ring-0 focus:outline-none font-medium rounded-lg text-xl px-5 py-2.5 text-center lowercase"
            >
              next
              <span className="absolute w-16 h-16 inset-y-0 -top-2 right-0 opacity-10 fill-slate-700 group-hover:translate-x-1">
                <IconChevronRight />
              </span>
            </button>
          </div>
        )}
        {step === 3 && status !== "success" && (
          <div className="flex-1">
            <button
              onClick={handleCreate}
              type="button"
              disabled={status === "pending"}
              className="group relative overflow-hidden w-full text-slate-400 hover:text-slate-600 bg-gradient-to-r from-slate-100 to-slate-300 hover:bg-gradient-to-r hover:from-slate-300 hover:to-slate-300 dark:text-slate-400 dark:hover:text-slate-200 dark:bg-gradient-to-r dark:from-slate-500 dark:to-slate-700 dark:hover:bg-gradient-to-r dark:hover:from-slate-700 dark:hover:to-slate-700 focus:ring-0 focus:outline-none font-medium rounded-lg text-xl px-5 py-2.5 text-center lowercase"
            >
              {status === "wallet"
                ? `open wallet ...`
                : status === "pending"
                ? `please wait ...`
                : `create`}
              <span
                className={`absolute w-12 h-12 inset-y-0 -top-0 right-2 opacity-10 fill-slate-700 ${
                  status === "wallet" || status === "pending"
                    ? `animate-ping`
                    : `group-hover:scale-110`
                }`}
              >
                <IconGrid />
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Create;
