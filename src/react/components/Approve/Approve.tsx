import { useCallback, useEffect, useMemo, useState } from "react";
import {
  useWriteContract,
  useWaitForTransactionReceipt,
  useAccount,
  useReadContracts,
} from "wagmi";
import { parseUnits } from "viem";

import { IApprove, IArgs, IFunctionName, IMetadata, IStatus } from "../types";

import { abi } from "./utils";

import Steps from "../Steps";
import ActionButton from "../ActionButton";
import Skeleton from "../Skeletons";
import MintERC721 from "../Mint/MintERC721";
import { Info, Nft, Spender, Token } from "./Rows";

import IconCheckSquare from "../Icons/IconCheckSquare";
import IconEdit from "../Icons/IconEdit";

const Approve = ({
  address,
  to,
  tokenId,
  operator,
  approved,
  spender,
  value,
  steps = true,
  handle,
}: IApprove) => {
  const { address: accountAddress } = useAccount();
  const addr = useMemo(
    () => to || operator || spender,
    [to, operator, spender]
  );

  const [isMint, setIsMint] = useState<boolean | undefined>(false);

  const [status, setStatus] = useState<IStatus>("idle");
  const [functionName, setFunctionName] = useState<IFunctionName>();
  const [args, setArgs] = useState<IArgs>();
  const [metadata, setMetadata] = useState<IMetadata>();
  const [isApprove, setIsApprove] = useState<boolean | undefined>();

  const {
    writeContract,
    status: offChain,
    data: hash,
    error,
  } = useWriteContract(); // offChain: idle -> pending -> success
  const { status: onChain } = useWaitForTransactionReceipt({ hash }); // onChain: pending -> success

  console.log(error);

  const contracts: any = useMemo(() => {
    const contract = { address, abi } as const;
    return [
      {
        ...contract,
        functionName: "getApproved",
        args: [tokenId],
      },
      {
        ...contract,
        functionName: "isApprovedForAll",
        args: [accountAddress, operator ?? to],
      },
      {
        ...contract,
        functionName: "allowance",
        args: [accountAddress, spender],
      },
      {
        ...contract,
        functionName: "symbol",
      },
      {
        ...contract,
        functionName: "tokenURI",
        args: [tokenId],
      },
    ];
  }, [address, to, tokenId, operator, approved, spender, value]);
  const query = { enabled: !!contracts };

  const { data, refetch } = useReadContracts({ contracts, query });

  const getApproved = useMemo(
    () => data?.[0]?.result as `0x${string}` | undefined,
    [data]
  );
  const isApprovedForAll = useMemo(
    () => data?.[1]?.result as boolean | undefined,
    [data]
  );
  const allowance = useMemo(
    () => data?.[2]?.result as bigint | undefined,
    [data]
  );
  const symbol = useMemo(() => data?.[3]?.result as string | undefined, [data]);
  const tokenURI = useMemo(
    () => data?.[4]?.result as string | undefined,
    [data]
  );

  const isLoading = useMemo(
    () =>
      getApproved === undefined &&
      isApprovedForAll === undefined &&
      allowance === undefined,
    [getApproved, isApprovedForAll, allowance]
  );

  const isDone = useMemo(() => {
    let isDone = false;

    if (isApprovedForAll !== undefined && approved !== undefined) {
      isDone = isApprovedForAll === approved;
    } else if (getApproved !== undefined && addr !== undefined) {
      isDone = isApprovedForAll || getApproved === addr;
    } else if (allowance !== undefined && value !== undefined) {
      isDone = allowance >= parseUnits(value, 18);
    }

    setIsApprove(approved ?? true);
    setStatus(isDone ? "success" : "idle");

    return isDone;
  }, [getApproved, isApprovedForAll, allowance, approved, addr, value]);

  useEffect(() => {
    if (to !== undefined && tokenId !== undefined) {
      setFunctionName("approve");
      setArgs([to, parseUnits(tokenId, 0)]);
    } else if (spender !== undefined && value !== undefined) {
      setFunctionName("approve");
      setArgs([spender, parseUnits(value, 18)]);
    } else if (operator !== undefined && approved !== undefined) {
      setFunctionName("setApprovalForAll");
      setArgs([operator, approved]);
    }

    refetch();
  }, [address, to, tokenId, operator, approved, spender, value]);

  useEffect(() => {
    if (offChain === "error" || onChain === "error") {
      handle({ data: undefined, status: "error" });
      setStatus("error");
    }
    if (onChain === "pending") {
      if (offChain === "idle") {
        handle({ data: undefined, status: "idle" });
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
      refetch();
    }
  }, [offChain, onChain]);

  useEffect(() => {
    if (tokenURI === undefined) return;

    const fetchMetadata = async () => {
      const response = await fetch(
        `https://ipfs.io/ipfs/${tokenURI.replace(/ipfs:\/\//g, "")}`
      );

      if (!response.ok) return;
      const metadata = await response.json();
      metadata.image = /^ipfs/.test(metadata.image)
        ? `https://ipfs.io/ipfs/${metadata.image.replace(/ipfs:\/\//g, "")}`
        : metadata.image;

      setMetadata(metadata);
    };

    fetchMetadata();
  }, [tokenURI]);

  const handleApprove = useCallback(() => {
    if (!address || !functionName || !args) return;
    writeContract({ abi, address, functionName, args });

    console.log(functionName, args);
  }, [address, functionName, args]);

  if (!address)
    return (
      <div className="flex justify-center items-center text-slate-700 dark:text-slate-500 text-xl font-extrabold">
        Token Address Not Found
      </div>
    );

  if (getApproved === undefined && tokenId !== undefined)
    return (
      <div className="min-w-96 flex flex-col gap-2">
        {!isMint && (
          <div className="flex flex-col justify-center items-center gap-4 text-slate-700 dark:text-slate-500 text-xl font-extrabold">
            <div>Token #{tokenId} Not Found</div>
            <div className="w-full">
              <ActionButton
                defaultText="Mint NFT"
                defaultIcon={<IconEdit />}
                onClick={() => {
                  setIsMint(true);
                }}
              />
            </div>
          </div>
        )}
        {isMint && (
          <MintERC721
            address={address}
            steps={steps}
            handle={({ status }) => {
              if (status === "success") {
                refetch();
                setIsMint(false);
              }
            }}
          />
        )}
      </div>
    );

  if (isLoading) return <Skeleton isOneNft={tokenId !== undefined} />;

  return (
    <div className="min-w-96 flex flex-col gap-2">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4">
          {steps && (
            <div>
              <Steps status={status} />
            </div>
          )}
          <div className="flex gap-2">
            {tokenId && (
              <div className="flex-none">
                <Nft metadata={metadata} />{" "}
              </div>
            )}
            <div className="flex-1 flex items-center">
              <ul role="list" className="list-none space-y-3 w-full">
                <li>
                  <Info
                    isApprove={isApprove ? isDone : !isDone}
                    tokenId={tokenId}
                    value={value}
                    symbol={symbol}
                  />
                </li>
                <li>
                  <Token
                    addr={address}
                    title={value !== undefined ? `Token` : `Collection`}
                  />
                </li>
                <li>
                  <Spender addr={addr} />
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="w-full">
          <ActionButton
            defaultText={isApprove ? `Approve` : `Disapprove`}
            successText="Done"
            defaultIcon={<IconEdit />}
            successIcon={<IconCheckSquare />}
            status={status}
            onClick={handleApprove}
          />
        </div>
      </div>
    </div>
  );
};

export default Approve;
