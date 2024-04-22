import { useReadContracts } from "wagmi";
import { useMemo } from "react";

import { IAddress, IMint } from "../types";

import Skeleton from "../Skeletons/Approve";

import MintERC721 from "./MintERC721";
import MintERC20 from "./MintERC20";

const abi = [
  {
    type: "function",
    name: "decimals",
    inputs: [],
    outputs: [{ name: "", type: "uint8", internalType: "uint8" }],
    stateMutability: "view",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceId",
        type: "bytes4",
      },
    ],
    stateMutability: "view",
    type: "function",
    name: "supportsInterface",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
  },
];

const useContracts = (address: IAddress) =>
  useMemo(
    () => [
      { address, abi, functionName: "decimals" },
      { address, abi, functionName: "supportsInterface", args: ["0x80ac58cd"] },
    ],
    [address]
  ) as any;

const Mint = ({ address, steps = true, handle }: IMint) => {
  const contracts = useContracts(address);
  const query = { enabled: !!address };

  const { data } = useReadContracts({ contracts, query });

  const isERC20 = useMemo(() => {
    return data?.[0]?.result !== undefined;
  }, [data]);
  const isERC721 = useMemo(() => {
    return data?.[1]?.result !== undefined;
  }, [data]);

  if (isERC721 && !isERC20) {
    return <MintERC721 address={address} steps={steps} handle={handle} />;
  } else if (!isERC721 && isERC20) {
    return <MintERC20 address={address} steps={steps} handle={handle} />;
  } else if (address === undefined) {
    return (
      <div className="flex justify-center items-center text-slate-700 dark:text-slate-500 text-xl font-extrabold">
        Token Address Not Found
      </div>
    );
  } else {
    return <Skeleton />;
  }
};

export default Mint;
