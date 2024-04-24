import { useMemo } from 'react';
import { useReadContracts } from 'wagmi';

import { IAddress, IMint } from '../types';

import Skeleton from '../Skeletons/Approve';

import BaseComponent from '../BaseComponent';
import MintERC20 from './MintERC20';
import MintERC721 from './MintERC721';

const abi = [
  {
    type: 'function',
    name: 'decimals',
    inputs: [],
    outputs: [{ name: '', type: 'uint8', internalType: 'uint8' }],
    stateMutability: 'view',
  },
  {
    inputs: [
      {
        internalType: 'bytes4',
        name: 'interfaceId',
        type: 'bytes4',
      },
    ],
    stateMutability: 'view',
    type: 'function',
    name: 'supportsInterface',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
  },
];

const useContracts = (address: IAddress) =>
  useMemo(
    () => [
      { address, abi, functionName: 'decimals' },
      { address, abi, functionName: 'supportsInterface', args: ['0x80ac58cd'] },
    ],
    [address]
  ) as any;

const Mint = ({ address, steps = true, dark, handle }: IMint) => {
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
    return (
      <BaseComponent dark={dark}>
        <MintERC721 address={address} steps={steps} handle={handle} />
      </BaseComponent>
    );
  } else if (!isERC721 && isERC20) {
    return (
      <BaseComponent dark={dark}>
        <MintERC20 address={address} steps={steps} handle={handle} />
      </BaseComponent>
    );
  } else if (address === undefined) {
    return (
      <BaseComponent dark={dark}>
        <div className="flex items-center justify-center text-xl font-extrabold text-slate-700 dark:text-slate-500">
          Token Address Not Found
        </div>
      </BaseComponent>
    );
  } else {
    return (
      <BaseComponent dark={dark}>
        <Skeleton />
      </BaseComponent>
    );
  }
};

export default Mint;
