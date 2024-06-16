import { useCallback, useEffect, useMemo, useState } from 'react';
import { formatUnits, parseUnits } from 'viem';
import {
  useAccount,
  useBalance,
  useReadContracts,
  useWaitForTransactionReceipt,
  useWatchContractEvent,
  useWriteContract,
} from 'wagmi';

import { IAddress, IMetadata, IMint, IStatus } from '../types';

import { abi } from './utils';

import ActionButton from '../ActionButton';
import Steps from '../Steps';
import EthAddressInput from './EthAddress';

import IconAddress from '../Icons/IconAddress';
import IconCheckSquare from '../Icons/IconCheckSquare';
import IconCopy from '../Icons/IconCopy';
import IconImagePlus from '../Icons/IconImagePlus';
import IconMinus from '../Icons/IconMinus';
import IconPlus from '../Icons/IconPlus';
import IconTags from '../Icons/IconTags';
import IconUserReceivedLine from '../Icons/IconUserReceivedLine';

const IPFS_GATEWAY = 'https://ipfs.io/ipfs/';

const useContracts = (address: IAddress) => {
  return useMemo(
    () => [
      { address, abi, functionName: 'maxSupply' },
      { address, abi, functionName: 'tokenPrice' },
      { address, abi, functionName: 'totalSupply' },
      { address, abi, functionName: 'baseURI' },
    ],
    [address]
  ) as any;
};

const MintERC721 = ({ address, steps = true, handle }: IMint) => {
  const { address: accountAddress } = useAccount();
  const { data: balance } = useBalance({ address: accountAddress });

  const functionName = 'mint';
  const eventName = 'Transfer';

  const [receiver, setReceiver] = useState(accountAddress);
  const [status, setStatus] = useState<IStatus>('idle');
  const [nftIds, setNftIds] = useState<string[] | undefined>();
  const [args, setArgs] = useState<[`0x${string}`, bigint]>();
  const [nftCount, setNftCount] = useState<number | undefined>();
  const [ethAmount, setEthAmount] = useState<string | undefined>();
  const [metadata, setMetadata] = useState<IMetadata | undefined>();
  const [image, setImage] = useState<string | undefined>();

  const contracts = useContracts(address);
  const query = { enabled: !!address };

  const onLogs = (logs: any[]) =>
    logs.forEach(log => {
      if (log.transactionHash === hash) {
        console.log('[Event] Transaction:', hash, log?.args);
        const id = log?.args?.tokenId?.toString() as string | undefined;
        if (id) setNftIds(ids => (ids ? [...ids, id] : [id]));
      }
    });

  useWatchContractEvent({ address, abi, eventName, onLogs });
  const { writeContract, status: offChain, data: hash } = useWriteContract();
  const { status: onChain } = useWaitForTransactionReceipt({ hash });
  const { data } = useReadContracts({ contracts, query });

  const maxSupply = useMemo(() => {
    return data?.[0]?.result as bigint | undefined;
  }, [data]);
  const tokenPrice = useMemo(() => {
    return data?.[1]?.result as bigint | undefined;
  }, [data]);
  const totalSupply = useMemo(() => {
    return data?.[2]?.result as bigint | undefined;
  }, [data]);
  const baseURI = useMemo(() => {
    return data?.[3]?.result as string | undefined;
  }, [data]);

  const soldOut = useMemo(
    () => (totalSupply ?? 0n) >= (maxSupply ?? 0n),
    [totalSupply, maxSupply]
  );

  useEffect(() => {
    if (
      totalSupply === undefined ||
      maxSupply === undefined ||
      baseURI === undefined ||
      totalSupply >= maxSupply
    )
      return;

    const fetchMetadata = async () => {
      const response = await fetch(
        /^ipfs:\/\//.test(baseURI)
          ? `${IPFS_GATEWAY}${baseURI.replace(/ipfs:\/\//g, '')}${(
              totalSupply + 1n
            ).toString()}`
          : `${baseURI}${(totalSupply + 1n).toString()}`
      );

      if (!response.ok) return;
      const metadata = await response.json();
      metadata.image = /^ipfs/.test(metadata.image)
        ? `${IPFS_GATEWAY}${metadata.image.replace(/ipfs:\/\//g, '')}`
        : metadata.image;

      setMetadata(metadata);
      if (image === undefined) setImage(metadata.image);
    };

    fetchMetadata();
  }, [totalSupply, maxSupply, baseURI]);

  useEffect(() => {
    const data = undefined;

    if (offChain === 'error' || onChain === 'error') {
      if (handle) handle({ data, hash, status: 'error' });
      setStatus('error');
    }
    if (onChain === 'pending') {
      if (offChain === 'idle') {
        if (handle) handle({ data, hash, status: 'idle' });
        setStatus('idle');
      } else if (offChain === 'pending') {
        if (handle) handle({ data, hash, status: 'wallet' });
        setStatus('wallet');
      } else if (offChain === 'success') {
        if (handle) handle({ data, hash, status: 'pending' });
        setStatus('pending');
      }
    }
    if (onChain === 'success') {
      setTimeout(() => {
        if (status !== 'success') {
          console.error('[Error] Transaction:', hash);
        }
      }, 15_000);
    }
  }, [hash, offChain, onChain]);

  useEffect(() => {
    if (nftIds === undefined) return;

    if (nftIds.length === nftCount) {
      if (handle) handle({ data: nftIds, hash, status: 'success' });
      setStatus('success');
    }
  }, [nftIds]);

  useEffect(() => {
    if (
      receiver === undefined ||
      tokenPrice === undefined ||
      totalSupply === undefined ||
      maxSupply === undefined ||
      totalSupply >= maxSupply
    )
      return;

    const _nftCount = nftCount ?? 1;
    const _ethAmount =
      tokenPrice > 0n
        ? formatUnits(
            (parseUnits(_nftCount.toString(), 18) * tokenPrice) / 10n ** 18n,
            18
          )
        : '0';

    setArgs([receiver, BigInt(_nftCount)]);
    setNftCount(_nftCount);
    setEthAmount(_ethAmount);
  }, [receiver, tokenPrice, nftCount, totalSupply, maxSupply]);

  const handleMint = useCallback(() => {
    if (!address) return;
    const value = parseUnits(ethAmount ?? '0', 18);
    writeContract({ abi, address, functionName, args, value });

    console.log('args', args, value);
  }, [address, functionName, args, ethAmount]);

  const BtnText = () => (
    <div className="relative line-clamp-2 flex flex-col gap-0">
      <div className={`transform ${ethAmount ? '-translate-y-2' : ''}`}>
        Mint
      </div>
      {ethAmount && (
        <div className="mt-[-12px] text-xs opacity-50">
          <span className="font-mono">{ethAmount}</span> {balance?.symbol}
        </div>
      )}
    </div>
  );

  const Success = () => (
    <div className="flex flex-1 items-center">
      <ul role="list" className="w-full list-none space-y-3">
        <li>
          <div className="relative flex h-6 items-center justify-center">
            <div className="absolute w-full px-2 text-center">
              <div className="overflow-hidden text-ellipsis text-nowrap font-extrabold">
                Add NFT to wallet
              </div>
            </div>
          </div>
        </li>
        <li>
          <div className="flex items-center justify-between">
            <div className="mr-1 flex items-center justify-between">
              <span className="mr-1 h-6 w-6 text-slate-400 dark:text-slate-500">
                <IconAddress />
              </span>
              <span className="text-xs">Address</span>
            </div>
            {address && (
              <div className="flex items-center justify-center">
                <span
                  className="mx-1 font-mono text-xs font-extrabold text-slate-400 underline decoration-dotted underline-offset-4 dark:text-slate-500"
                  title={address}
                >
                  <a
                    href={`https://etherscan.io/address/${address}`}
                    target="_blank"
                  >
                    {address.substring(0, 5)}..
                    {address.substring(address.length - 4)}
                  </a>
                </span>
                <IconCopy
                  className="ml-3 h-4 w-4 -translate-x-1 text-slate-400 hover:scale-105 hover:cursor-pointer active:text-sky-500 dark:text-slate-500"
                  onClick={() => {
                    navigator.clipboard
                      .writeText(address)
                      .catch(err => console.error('Failed to copy text:', err));
                  }}
                />
              </div>
            )}
          </div>
        </li>
        <li>
          <div className="flex w-full items-center justify-between">
            <div className="flex flex-none items-center justify-center">
              <span className="mr-1 h-6 w-6 text-slate-400 dark:text-slate-500">
                <IconTags />
              </span>
              <span className="text-xs">IDs</span>
            </div>
            {nftIds && (
              <div className="flex">
                {nftIds.length < 3 ? (
                  nftIds.map(id => (
                    <span
                      key={id}
                      className="mx-1 rounded-md bg-slate-100 px-1 font-extrabold text-slate-800 dark:bg-slate-800 dark:text-slate-50"
                    >
                      {id}
                    </span>
                  ))
                ) : (
                  <>
                    <span className="mx-1 rounded-md bg-slate-100 px-1 font-extrabold text-slate-800 dark:bg-slate-800 dark:text-slate-50">
                      {nftIds[0]}
                    </span>
                    {' - '}
                    <span className="mx-1 rounded-md bg-slate-100 px-1 font-extrabold text-slate-800 dark:bg-slate-800 dark:text-slate-50">
                      {nftIds[nftIds.length - 1]}
                    </span>
                  </>
                )}
              </div>
            )}
          </div>
        </li>
      </ul>
    </div>
  );

  const Mint = () => (
    <div className="flex flex-1 items-center">
      <ul role="list" className="w-full list-none space-y-3">
        <li>
          <div className="relative flex h-6 items-center justify-center">
            <div className="absolute w-full px-2 text-center">
              <div className="overflow-hidden text-ellipsis text-nowrap font-extrabold">
                {metadata?.name}
              </div>
            </div>
          </div>
        </li>
        <li>
          <div className="flex items-center justify-between">
            <div className="mr-1 flex items-center justify-between">
              <span className="mr-1 h-6 w-6 text-slate-400 dark:text-slate-500">
                <IconUserReceivedLine />
              </span>
              <span className="text-xs">Receiver</span>
            </div>
            <div className="relative w-full">
              <EthAddressInput
                initialAddress={receiver}
                defaultText={
                  accountAddress === receiver
                    ? `You will receive NFT`
                    : undefined
                }
                handler={newAddress => setReceiver(newAddress)}
              />
            </div>
          </div>
        </li>
        <li>
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-between">
              <span className="mr-1 h-6 w-6 text-slate-400 dark:text-slate-500">
                <IconImagePlus />
              </span>
              <span className="text-xs">Mint</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="relative w-full">
                <form className="mx-auto max-w-xs">
                  <div className="relative flex items-center">
                    <button
                      type="button"
                      id="decrement-button"
                      data-input-counter-decrement="counter-input"
                      className="inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md border border-gray-300 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700"
                      onClick={() =>
                        setNftCount(nftCount =>
                          nftCount && nftCount > 1 ? --nftCount : nftCount
                        )
                      }
                    >
                      <IconMinus />
                    </button>
                    <input
                      type="text"
                      id="counter-input"
                      className="max-w-[3.5rem] flex-shrink-0 border-0 bg-transparent text-center text-sm font-normal text-gray-900 focus:outline-none focus:ring-0 dark:text-white"
                      placeholder=""
                      value={`${nftCount ?? 0} NFT`}
                      readOnly
                      required
                      spellCheck={false}
                    />
                    <button
                      type="button"
                      id="increment-button"
                      data-input-counter-increment="counter-input"
                      className="inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md border border-gray-300 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700"
                      onClick={() =>
                        setNftCount(nftCount =>
                          nftCount &&
                          BigInt(nftCount) + (totalSupply ?? 0n) <
                            (maxSupply ?? 0n)
                            ? ++nftCount
                            : nftCount
                        )
                      }
                    >
                      <IconPlus />
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
  );

  if (soldOut)
    return (
      <div className="flex items-center justify-center text-xl font-extrabold text-slate-700 dark:text-slate-500">
        Sold Out
      </div>
    );

  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex w-full flex-col gap-2">
        {steps && (
          <div>
            <Steps status={status} />
          </div>
        )}
        <div className="flex flex-none gap-2">
          {metadata && image && (
            <div className="flex-none">
              <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-xl">
                <img
                  src={image}
                  className="h-24 w-24 rounded-xl object-cover"
                  alt={`NFT Collection: ${address}`}
                ></img>
              </div>
            </div>
          )}
          {status === 'success' ? <Success /> : <Mint />}
        </div>
      </div>
      <div className="w-full">
        <ActionButton
          defaultText={<BtnText />}
          successText="Done"
          defaultIcon={<IconImagePlus />}
          successIcon={<IconCheckSquare />}
          status={status}
          onClick={handleMint}
        />
      </div>
    </div>
  );
};

export default MintERC721;
