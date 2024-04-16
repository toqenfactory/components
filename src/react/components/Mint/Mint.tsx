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
];

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
        functionName: "balanceOf",
        args: [accountAddress],
      },
    ];
  }, [address, accountAddress]);
  const query = { enabled: !!contracts };

  const { data, refetch } = useReadContracts({ contracts, query });

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
  const balanceOf = useMemo(
    () => data?.[3]?.result as bigint | undefined,
    [data]
  );

  const [args, setArgs] = useState<any>();
  const [account, setAccount] = useState(accountAddress ?? "");
  const [amount, setAmount] = useState("");

  const functionName = "mint";
  const value = useMemo(
    () => tokenPrice && tokenPrice * BigInt(amount ?? 0n),
    [tokenPrice, amount]
  );

  useEffect(() => {
    setArgs([account, amount]);
  }, [account, amount]);

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

  const handleMint = useCallback(() => {
    if (!address) return;
    writeContract({ abi, address, functionName, args, value });
  }, [address, functionName, args, value]);

  return (
    <div className="flex flex-col gap-2">
      <div>token: {address}</div>
      <div>maxSupply: {maxSupply?.toString()}</div>
      <div>tokenPrice: {tokenPrice?.toString()}</div>
      <div>totalSupply: {totalSupply?.toString()}</div>
      <div>balanceOf: {balanceOf?.toString()}</div>
      <div>
        <Input
          label="Account:"
          placeholder="Reciever Address"
          value={account ?? ""}
          setValue={setAccount}
        />
      </div>
      <div>
        <Input
          label="Amount:"
          placeholder="Token Amount"
          value={amount ?? ""}
          setValue={setAmount}
        />
      </div>
      <div>
        <button onClick={handleMint}>Mint</button>
      </div>
    </div>
  );
};

export default Mint;
