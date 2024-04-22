import { useReadContracts } from "wagmi";
import { useMemo } from "react";

import { IMint } from "../types";

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

const Mint = ({ address, steps = true, handle }: IMint) => {
  const contracts: any = useMemo(() => {
    return [
      {
        ...{ address, abi },
        functionName: "decimals",
      },
      {
        ...{ address, abi },
        functionName: "supportsInterface",
        args: ["0x80ac58cd"],
      },
    ];
  }, [address]);
  const query = { enabled: !!contracts };

  const { data } = useReadContracts({ contracts, query });

  const decimals = useMemo(() => {
    return data?.[0]?.result as bigint | undefined;
  }, [data]);
  const supportsInterface = useMemo(() => {
    return data?.[1]?.result as boolean | undefined;
  }, [data]);

  if (supportsInterface !== undefined && decimals === undefined) {
    return <MintERC721 address={address} steps={steps} handle={handle} />;
  } else if (supportsInterface === undefined && decimals !== undefined) {
    return <MintERC20 address={address} steps={steps} handle={handle} />;
  } else {
    return <Skeleton />;
  }
};

export default Mint;
