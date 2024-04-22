import { useCallback, useEffect, useMemo, useState } from "react";
import { formatUnits, parseUnits } from "viem";
import {
  useWriteContract,
  useWaitForTransactionReceipt,
  useAccount,
  useReadContracts,
  useBalance,
} from "wagmi";

import { IMint, IStatus } from "../types";

import { abi } from "./utils";

import IconArrowDown from "../Icons/IconArrowDown";
import IconRepeat from "../Icons/IconRepeat";
import ActionButton from "../ActionButton";
import EthAddressInput from "./EthAddress";

const MintERC20 = ({ address, handle }: IMint) => {
  const { address: accountAddress } = useAccount();
  const { data: balance } = useBalance({ address: accountAddress });

  const contract = { address, abi } as const;
  const functionName = "mint";

  const [receiver, setReceiver] = useState(accountAddress);
  const [status, setStatus] = useState<IStatus>("idle");
  const [args, setArgs] = useState<[`0x${string}`, bigint]>();
  const [amount, setAmount] = useState<string | undefined>();
  const [ethAmount, setEthAmount] = useState<string | undefined>();

  const {
    writeContract,
    status: offChain,
    data: hash,
    error,
  } = useWriteContract(); // offChain: idle -> pending -> success
  const { status: onChain } = useWaitForTransactionReceipt({ hash }); // onChain: pending -> success

  console.log(error);

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
        functionName: "symbol",
      },
      {
        ...contract,
        functionName: "balanceOf",
        args: [receiver],
      },
    ];
  }, [address, receiver]);
  const query = { enabled: !!contracts };

  const { data, refetch } = useReadContracts({ contracts, query });

  const maxSupply = useMemo(() => {
    return data?.[0]?.result as bigint | undefined;
  }, [data]);
  const tokenPrice = useMemo(() => {
    return data?.[1]?.result as bigint | undefined;
  }, [data]);
  const totalSupply = useMemo(() => {
    return data?.[2]?.result as bigint | undefined;
  }, [data]);
  const symbol = useMemo(() => {
    return data?.[3]?.result as string | undefined;
  }, [data]);
  const balanceOf = useMemo(() => {
    return data?.[4]?.result as bigint | undefined;
  }, [data]);

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
      handle({ data: amount ? [amount] : undefined, hash, status: "success" });
      setStatus("success");
      setAmount(undefined);
      setEthAmount(undefined);
      refetch();
      setTimeout(() => {
        setStatus("idle");
      }, 10_000);
    }
  }, [hash, offChain, onChain]);

  useEffect(() => {
    if (receiver === undefined || amount === undefined) return;

    setArgs([receiver, parseUnits(amount, 18)]);
  }, [receiver, amount]);

  const handleMint = useCallback(() => {
    if (!address || !ethAmount) return;
    const value = parseUnits(ethAmount, 18);
    writeContract({ abi, address, functionName, args, value });

    console.log("args", args, value);
  }, [address, functionName, args, ethAmount]);

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
        setEthAmount("");
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

      setEthAmount(eth);
      setAmount(input.replace(/[^0-9\.]/g, ""));
    },
    [amount, tokenPrice, totalSupply, maxSupply]
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
        setEthAmount("");
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
      setEthAmount(input.replace(/[^0-9\.]/g, ""));
    },
    [ethAmount, tokenPrice, totalSupply, maxSupply]
  );

  if (!address)
    return (
      <div className="flex justify-center items-center text-slate-700 dark:text-slate-500 text-xl font-extrabold">
        Token Address Not Found
      </div>
    );

  return (
    <div className="min-w-96">
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
                value={ethAmount ?? ""}
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
                  {parseFloat(formatUnits(balance?.value ?? 0n, 18)).toFixed(3)}
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
                value={amount ?? ""}
                onChange={handleAmount}
                className="block font-extrabold w-full p-4 pl-0 pr-20 text-3xl bg-slate-50 text-slate-600 border-0 rounded-lg dark:bg-slate-800 dark:border-slate-100 dark:placeholder-slate-400 dark:text-slate-50 placeholder:text-slate-300 focus:ring-0 focus:outline-0"
                placeholder="0"
                required
              />
              <div className="text-slate-600 font-extrabold inset-y-0 absolute top-4 right-0 h-9 bg-slate-100 rounded-lg text-sm px-4 py-2 dark:text-slate-50 dark:bg-slate-900 shadow-xs">
                {symbol}
              </div>
              <div className="flex justify-between items-center w-full">
                <div className="relative flex items-center text-xs">
                  <span className="mr-2 text-slate-300 dark:text-slate-600">
                    Receiver:
                  </span>
                  <EthAddressInput
                    initialAddress={receiver}
                    defaultText={
                      accountAddress === receiver
                        ? `You will receive tokens`
                        : undefined
                    }
                    handler={(addr) => setReceiver(addr)}
                  />
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
          <ActionButton
            defaultText={`Swap`}
            successText={`Done`}
            defaultIcon={<IconRepeat />}
            status={status}
            onClick={() => handleMint()}
          />
        </div>
      </div>
    </div>
  );
};

export default MintERC20;
