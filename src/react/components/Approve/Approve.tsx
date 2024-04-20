import { useCallback, useEffect, useMemo, useState } from "react";
import {
  useWriteContract,
  useWaitForTransactionReceipt,
  useAccount,
  useReadContracts,
} from "wagmi";
import { parseUnits } from "viem";
import IconCheckSquare from "./icons/IconCheckSquare";
import IconEdit from "./icons/IconEdit";
import { Steps } from "./Steps";
import { ActionButton } from "./ActionButton";

import { abi } from "./utils";
import { Info, Nft, Spender, Token } from "./Rows";
import { Skeleton } from "./Skeleton";
import { IApprove, IArgs, IFunctionName, IMetadata, IStatus } from "./IApprove";

const Approve = ({
  address,
  to,
  tokenId,
  operator,
  approved,
  spender,
  value,
  handle,
}: IApprove) => {
  const { address: accountAddress } = useAccount();
  const addr = useMemo(
    () => to || operator || spender,
    [to, operator, spender]
  );

  const [status, setStatus] = useState<IStatus>();
  const [functionName, setFunctionName] = useState<IFunctionName>();
  const [args, setArgs] = useState<IArgs>();
  const [metadata, setMetadata] = useState<IMetadata>();
  const [tokenNotFound, setTokenNotFound] = useState<boolean>(false);

  const {
    writeContract,
    status: offChain,
    data: hash,
    error,
  } = useWriteContract(); // offChain: idle -> pending -> success
  const { status: onChain } = useWaitForTransactionReceipt({ hash }); // onChain: pending -> success

  console.log("Approve error", error);

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
        args: [accountAddress, operator],
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

  const isApproved = useMemo(() => {
    let isApproved = false;
    if (getApproved !== undefined && addr !== undefined) {
      isApproved = getApproved === addr;
    } else if (allowance !== undefined && value !== undefined) {
      isApproved = allowance >= parseUnits(value, 18);
    } else if (isApprovedForAll !== undefined) {
      isApproved = isApprovedForAll;
    }
    return isApproved;
  }, [getApproved, isApprovedForAll, allowance, addr, value]);

  useEffect(() => {
    setTokenNotFound(getApproved === undefined && tokenId !== undefined);
  }, [getApproved, tokenId]);

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
  }, [to, tokenId, operator, approved, spender, value]);

  useEffect(() => {
    if (offChain === "error" || onChain === "error") {
      handle({ data: undefined, status: "error" });
      setStatus("error");
    }
    if (onChain === "pending") {
      if (offChain === "idle") {
        handle({ data: undefined, status: "idle" });
        if (isApproved && status !== "success") {
          setStatus("success");
        } else {
          setStatus("idle");
        }
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
  }, [offChain, onChain, isApproved]);

  useEffect(() => {
    if (tokenURI === undefined) return;

    const fetchMetadata = async () => {
      const response = await fetch(
        `https://dweb.link/ipfs/${tokenURI.replace(/ipfs:\/\//g, "")}`
      );

      if (!response.ok) return;
      const metadata = await response.json();
      metadata.image = /^ipfs/.test(metadata.image)
        ? `https://dweb.link/ipfs/${metadata.image.replace(/ipfs:\/\//g, "")}`
        : metadata.image;

      setMetadata(metadata);
    };

    fetchMetadata();
  }, [tokenURI]);

  useEffect(() => {
    refetch();
  }, [address, to, tokenId, operator, approved, spender, value]);

  const handleApprove = useCallback(() => {
    if (!address || !functionName || !args) return;
    writeContract({ abi, address, functionName, args });
  }, [address, functionName, args]);

  return (
    <div className="min-w-96 flex flex-col gap-2">
      {!address ? (
        <div className="flex justify-center items-center text-slate-700 text-xl font-extrabold">
          Token Address Not Found
        </div>
      ) : (
        isLoading &&
        (tokenNotFound ? (
          <div className="flex justify-center items-center text-slate-700 text-xl font-extrabold">
            Token #{tokenId} Not Found
          </div>
        ) : (
          <Skeleton isOneNft={tokenId !== undefined} />
        ))
      )}
      {!isLoading && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4">
            <div>
              <Steps status={status} />
            </div>
            <div className="flex gap-2">
              <div className="flex-none">
                {tokenId && <Nft metadata={metadata} />}
              </div>
              <div className="flex-1 flex items-center">
                <ul
                  role="list"
                  className="list-none space-y-3 text-slate-400 w-full"
                >
                  <li>
                    {functionName === "setApprovalForAll" && (
                      <Info isApproved={isApproved} />
                    )}
                    {functionName === "approve" && (
                      <Info
                        isApproved={isApproved}
                        tokenId={tokenId}
                        value={value}
                        symbol={symbol}
                      />
                    )}
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
              defaultText="Approve"
              successText="Done"
              defaultIcon={<IconEdit />}
              successIcon={<IconCheckSquare />}
              status={status}
              handle={handleApprove}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Approve;
