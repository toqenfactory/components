import { useCallback, useEffect, useMemo, useState } from "react";
import {
  useWriteContract,
  useWaitForTransactionReceipt,
  useAccount,
  useReadContracts,
} from "wagmi";

const abi = [
  {
    type: "function",
    name: "approve",
    inputs: [
      { name: "spender", type: "address", internalType: "address" },
      { name: "value", type: "uint256", internalType: "uint256" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "setApprovalForAll",
    inputs: [
      { name: "operator", type: "address", internalType: "address" },
      { name: "approved", type: "bool", internalType: "bool" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "getApproved",
    inputs: [{ name: "tokenId", type: "uint256", internalType: "uint256" }],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "isApprovedForAll",
    inputs: [
      { name: "owner", type: "address", internalType: "address" },
      { name: "operator", type: "address", internalType: "address" },
    ],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "allowance",
    inputs: [
      { name: "owner", type: "address", internalType: "address" },
      { name: "spender", type: "address", internalType: "address" },
    ],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
];

const Approve = ({
  address,
  to,
  tokenId,
  operator,
  approved,
  spender,
  value,
  handle,
}: {
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
    status: "idle" | "pending" | "success" | "error";
  }) => void;
}) => {
  const { address: accountAddress } = useAccount();

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

  console.log(getApproved, isApprovedForAll, allowance);

  const [functionName, setFunctionName] = useState("");
  const [args, setArgs] = useState<any>();

  useEffect(() => {
    if (to !== undefined && tokenId !== undefined) {
      setFunctionName("approve");
      setArgs([to, tokenId]);
    } else if (spender !== undefined && value !== undefined) {
      setFunctionName("approve");
      setArgs([spender, value]);
    } else if (operator !== undefined && approved !== undefined) {
      setFunctionName("setApprovalForAll");
      setArgs([operator, approved]);
    }
  }, [to, tokenId, operator, approved, spender, value]);

  useEffect(() => {
    refetch();
  }, [onChain]);

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
      handle({ data: undefined, status: "success" });
    }
  }, [offChain, onChain]);

  const handleApprove = useCallback(() => {
    if (!address || !functionName) return;
    writeContract({ abi, address, functionName, args });
  }, [address, functionName, args]);

  return (
    <div className="flex flex-col gap-2">
      <div>getApproved: {getApproved?.toString()}</div>
      <div>isApprovedForAll: {isApprovedForAll?.toString()}</div>
      <div>allowance: {allowance?.toString()}</div>
      <div>
        <button onClick={handleApprove}>Approve</button>
      </div>
    </div>
  );
};

export default Approve;
