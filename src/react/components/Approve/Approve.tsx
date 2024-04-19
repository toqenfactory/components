import { useCallback, useEffect, useMemo, useState } from "react";
import {
  useWriteContract,
  useWaitForTransactionReceipt,
  useAccount,
  useReadContracts,
} from "wagmi";
import { parseUnits } from "viem";
import IconCheck from "./icons/IconCheck";
import IconEdit from "./icons/IconEdit";
import { Steps } from "./Steps";
import { ActionButton } from "./ActionButton";

type Status = "idle" | "wallet" | "pending" | "success" | "error" | undefined;
type FunctionName = "approve" | "setApprovalForAll" | undefined;
type Args = [`0x${string}`, bigint | boolean] | undefined;
type Metadata =
  | {
      name: string;
      description: string;
      image: string;
      external_url: string;
    }
  | undefined;
interface ApproveType {
  address: `0x${string}` | undefined;
  to?: `0x${string}` | undefined;
  tokenId?: string | undefined;
  operator?: `0x${string}` | undefined;
  approved?: boolean | undefined;
  spender?: `0x${string}` | undefined;
  value?: string | undefined;
  handle: ({
    data,
    status,
  }: {
    data: string | undefined;
    status: Status;
  }) => void;
}

import { abi } from "./utils";
import { Info, Nft, Spender, Token } from "./Rows";

const Approve = ({
  address,
  to,
  tokenId,
  operator,
  approved,
  spender,
  value,
  handle,
}: ApproveType) => {
  const { address: accountAddress } = useAccount();
  const addr = useMemo(
    () => to || operator || spender,
    [to, operator, spender]
  );

  const [status, setStatus] = useState<Status>();
  const [functionName, setFunctionName] = useState<FunctionName>();
  const [args, setArgs] = useState<Args>();
  const [metadata, setMetadata] = useState<Metadata>();
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

  console.log(
    "address",
    address,
    "to",
    to,
    "tokenId",
    tokenId,
    "operator",
    operator,
    "approved",
    approved,
    "spender",
    spender,
    "value",
    value,
    "getApproved",
    getApproved,
    "isApprovedForAll",
    isApprovedForAll,
    "allowance",
    allowance
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
    if (isApproved) {
      if (status !== "success") setStatus("success");
      return isApproved;
    } else {
      setStatus(undefined);
      return false;
    }
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
      refetch();
    }
  }, [offChain, onChain]);

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
        <div className="flex justify-center items-center">
          Token Address Not Found
        </div>
      ) : (
        isLoading &&
        (tokenNotFound ? (
          <div className="flex justify-center items-center">
            Token #{tokenId} Not Found
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="animate-pulse flex flex-col justify-center gap-2">
              <div className="flex gap-2">
                <div className="rounded-xl bg-slate-200 h-20 w-20"></div>
                <div className="flex-1 space-y-6 py-1">
                  <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="h-4 bg-slate-200 rounded col-span-2"></div>
                      <div className="h-4 bg-slate-200 rounded col-span-1"></div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="h-4 bg-slate-200 rounded col-span-1"></div>
                      <div className="h-4 bg-slate-200 rounded col-span-2"></div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="h-4 bg-slate-200 rounded col-span-2"></div>
                      <div className="h-4 bg-slate-200 rounded col-span-1"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="">
                <div className="h-12 bg-slate-200 rounded-xl"></div>
              </div>
            </div>
          </div>
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
              defaultText="approve"
              successText="approved"
              defaultIcon={<IconEdit />}
              successIcon={<IconCheck />}
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
