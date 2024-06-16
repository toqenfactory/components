import { useCallback, useEffect, useMemo, useState } from 'react';
import { parseUnits } from 'viem';
import {
  useAccount,
  useReadContracts,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi';

import {
  IAddress,
  IApprove,
  IArgs,
  IFunctionName,
  IMetadata,
  IStatus,
} from '../types';

import { abi } from './utils';

import ActionButton from '../ActionButton';
import Skeleton from '../Skeletons';
import Steps from '../Steps';
import { Info, Spender, Token } from './Rows';

import BaseComponent from '../BaseComponent';
import IconCheckSquare from '../Icons/IconCheckSquare';
import IconImagePlus from '../Icons/IconImagePlus';

const IPFS_GATEWAY = 'https://ipfs.io/ipfs/';

const useContracts = (
  account: IAddress,
  address: IAddress,
  tokenId: string | undefined,
  addr: IAddress
) => {
  return useMemo(
    () => [
      { address, abi, functionName: 'getApproved', args: [tokenId] },
      { address, abi, functionName: 'isApprovedForAll', args: [account, addr] },
      { address, abi, functionName: 'allowance', args: [account, addr] },
      { address, abi, functionName: 'symbol' },
      { address, abi, functionName: 'tokenURI', args: [tokenId] },
    ],
    [account, address, tokenId, addr]
  ) as any;
};

const Approve = ({
  address,
  to,
  tokenId,
  operator,
  approved,
  spender,
  value,
  steps = true,
  dark,
  handle,
}: IApprove) => {
  const { address: account } = useAccount();
  const addr = useMemo(
    () => operator || to || spender,
    [to, operator, spender]
  );

  const [status, setStatus] = useState<IStatus>('idle');
  const [functionName, setFunctionName] = useState<IFunctionName>();
  const [args, setArgs] = useState<IArgs>();
  const [metadata, setMetadata] = useState<IMetadata>();
  const [isApprove, setIsApprove] = useState<boolean | undefined>();

  const contracts = useContracts(account, address, tokenId, addr);
  const query = { enabled: !!address };

  const { writeContract, status: offChain, data: hash } = useWriteContract();
  const { status: onChain } = useWaitForTransactionReceipt({ hash });
  const { data, refetch } = useReadContracts({ contracts, query });

  console.log('data', data);

  const getApproved = useMemo(() => {
    return data?.[0]?.result as `0x${string}` | undefined;
  }, [data]);
  const isApprovedForAll = useMemo(() => {
    return data?.[1]?.result as boolean | undefined;
  }, [data]);
  const allowance = useMemo(() => {
    return data?.[2]?.result as bigint | undefined;
  }, [data]);
  const symbol = useMemo(() => {
    return data?.[3]?.result as string | undefined;
  }, [data]);
  const tokenURI = useMemo(() => {
    return data?.[4]?.result as string | undefined;
  }, [data]);

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
    setStatus(isDone ? 'success' : 'idle');

    return isDone;
  }, [getApproved, isApprovedForAll, allowance, approved, addr, value]);

  useEffect(() => {
    if (to !== undefined && tokenId !== undefined) {
      setFunctionName('approve');
      setArgs([to, parseUnits(tokenId, 0)]);
    } else if (spender !== undefined && value !== undefined) {
      setFunctionName('approve');
      setArgs([spender, parseUnits(value, 18)]);
    } else if (operator !== undefined && approved !== undefined) {
      setFunctionName('setApprovalForAll');
      setArgs([operator, approved]);
    }

    refetch();
  }, [address, to, tokenId, operator, approved, spender, value]);

  useEffect(() => {
    if (offChain === 'error' || onChain === 'error') {
      if (handle) handle({ data: undefined, status: 'error' });
      setStatus('error');
    }
    if (onChain === 'pending') {
      if (offChain === 'idle') {
        if (handle) handle({ data: undefined, status: 'idle' });
      } else if (offChain === 'pending') {
        if (handle) handle({ data: undefined, status: 'wallet' });
        setStatus('wallet');
      } else if (offChain === 'success') {
        if (handle) handle({ data: undefined, status: 'pending' });
        setStatus('pending');
      }
    }
    if (onChain === 'success') {
      if (handle) handle({ data: isApprove, status: 'success' });
      setStatus('success');
      refetch();
    }
  }, [offChain, onChain]);

  useEffect(() => {
    if (tokenURI === undefined) return;

    const fetchMetadata = async () => {
      const response = await fetch(
        /^ipfs:\/\//.test(tokenURI)
          ? `${IPFS_GATEWAY}${tokenURI.replace(/ipfs:\/\//g, '')}`
          : tokenURI
      );

      if (!response.ok) return;
      const metadata = await response.json();
      metadata.image = /^ipfs:\/\//.test(metadata.image)
        ? `${IPFS_GATEWAY}${metadata.image.replace(/ipfs:\/\//g, '')}`
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
      <div className="flex items-center justify-center text-xl font-extrabold text-slate-700 dark:text-slate-500">
        Token Address Not Found
      </div>
    );

  if (getApproved === undefined && tokenId !== undefined)
    return (
      <div className="flex items-center justify-center text-xl font-extrabold text-slate-700 dark:text-slate-500">
        <div>Token #{tokenId} Not Found</div>
      </div>
    );

  if (isLoading) return <Skeleton isOneNft={tokenId !== undefined} />;

  return (
    <BaseComponent dark={dark}>
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-2">
          {steps && (
            <div>
              <Steps status={status} />
            </div>
          )}
          <div className="flex gap-2">
            {tokenId && (
              <div className="flex-none">
                {metadata?.image && (
                  <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-xl">
                    <img
                      src={metadata.image}
                      className="h-24 w-24 rounded-xl object-cover"
                      alt={metadata.name}
                    ></img>
                  </div>
                )}
              </div>
            )}
            <div className="flex flex-1 items-center">
              <ul role="list" className="w-full list-none space-y-3">
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
            defaultIcon={<IconImagePlus />}
            successIcon={<IconCheckSquare />}
            status={status}
            onClick={handleApprove}
          />
        </div>
      </div>
    </BaseComponent>
  );
};

export default Approve;
