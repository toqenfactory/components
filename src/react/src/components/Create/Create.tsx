import { useCallback, useEffect, useMemo, useState } from 'react';
import { parseUnits } from 'viem';
import {
  useAccount,
  useBalance,
  useWaitForTransactionReceipt,
  useWatchContractEvent,
  useWriteContract,
} from 'wagmi';

import { IAddress, ICreate, ICreateArgs, IMetadata, IStatus } from '../types';

import { abi, generate } from './utils';

import Steps from '../Steps';

import ActionButton from '../ActionButton';
import IconArrowsRandom from '../Icons/IconArrowsRandom';
import IconCheckSquare from '../Icons/IconCheckSquare';
import IconCoins from '../Icons/IconCoins';
import IconCopy from '../Icons/IconCopy';
import IconCreateDashboard from '../Icons/IconCreateDashboard';
import IconIpfs from '../Icons/IconIpfs';
import IconPointOfSale from '../Icons/IconPointOfSale';

const IPFS_GATEWAY = 'https://ipfs.io/ipfs/';
const ipfs =
  'ipfs://bafybeieyb62vnkv46zr5mw3nfqlhcxt7v2frd2tu6k3cwgkqfgwmnyflme/';

const Create = ({
  standart,
  toqen: address,
  steps = true,
  handle,
}: ICreate) => {
  const { address: accountAddress } = useAccount();
  const { data: balance } = useBalance({ address: accountAddress });

  const isNFT = useMemo(() => standart === 'ERC721', [standart]);

  const eventName = 'TokenCreated';
  const functionName = `create${standart}`;

  const [status, setStatus] = useState<IStatus>();
  const [args, setArgs] = useState<ICreateArgs>();
  const [tokenAddress, setTokenAddress] = useState<IAddress>();
  const [name, setName] = useState<string | undefined>();
  const [symbol, setSymbol] = useState<string | undefined>();
  const [maxSupply, setMaxSupply] = useState<string | undefined>();
  const [tokenPrice, setTokenPrice] = useState<string | undefined>();
  const [baseURI, setBaseURI] = useState<string | undefined>();
  const [metadata, setMetadata] = useState<IMetadata | undefined>();

  const onLogs = (logs: any[]) =>
    logs.forEach(log => {
      if (log.transactionHash === hash) {
        console.log('[Event] Transaction:', hash, log?.args);
        const addr = log?.args?.tokenAddress as IAddress;
        if (addr) setTokenAddress(addr);
      }
    });

  useWatchContractEvent({ address, abi, eventName, onLogs });
  const { writeContract, status: offChain, data: hash } = useWriteContract();
  const { data, status: onChain } = useWaitForTransactionReceipt({ hash });

  useEffect(() => {
    console.log('[Receipt] Transaction:', hash, data?.logs);
    const addr = data?.logs?.[0]?.topics?.[1] as IAddress;
    if (addr) setTokenAddress(`0x${addr.slice(26)}`);
  }, [data]);

  useEffect(() => {
    if (!name || !symbol || !maxSupply || (!baseURI && isNFT)) return;
    const price = tokenPrice ? parseUnits(tokenPrice, 18) : 0n;
    setArgs(
      isNFT
        ? [name, symbol, parseUnits(maxSupply, 0), price, baseURI]
        : [name, symbol, parseUnits(maxSupply, 18), price]
    );
  }, [name, symbol, maxSupply, tokenPrice, baseURI]);

  useEffect(() => {
    const data = undefined;

    if (offChain === 'error' || onChain === 'error') {
      handle({ data, hash, status: 'error' });
      setStatus('error');
    }
    if (onChain === 'pending') {
      if (offChain === 'idle') {
        handle({ data, hash, status: 'idle' });
        setStatus('idle');
      } else if (offChain === 'pending') {
        handle({ data, hash, status: 'wallet' });
        setStatus('wallet');
      } else if (offChain === 'success') {
        handle({ data, hash, status: 'pending' });
        setStatus('pending');
      }
    }
    if (tokenAddress) {
      handle({ data: tokenAddress, hash, status: 'success' });
      setStatus('success');
    }
  }, [offChain, onChain, hash, tokenAddress]);

  useEffect(() => {
    if (maxSupply === undefined || baseURI === undefined) return;

    if (baseURI === '') {
      setBaseURI(undefined);
      setMetadata(undefined);
      return;
    }

    const fetchMetadata = async () => {
      const response = await fetch(
        /^ipfs:\/\//.test(baseURI)
          ? `${IPFS_GATEWAY}${baseURI.replace(/ipfs:\/\//g, '')}1`
          : `${baseURI}1`
      );

      if (!response.ok) return;
      const metadata = await response.json();
      metadata.image = /^ipfs/.test(metadata.image)
        ? `${IPFS_GATEWAY}${metadata.image.replace(/ipfs:\/\//g, '')}`
        : metadata.image;

      setMetadata(metadata);
    };

    fetchMetadata();
  }, [baseURI]);

  const handleCreate = useCallback(() => {
    if (!address) return;
    console.log(address, functionName, args, metadata);
    writeContract({ abi, address, functionName, args });
  }, [abi, address, functionName, args]);

  const handleGenerate = useCallback(() => {
    const random = generate();
    setName(random.name);
    setSymbol(random.symbol);
    setTokenAddress(undefined);
    setStatus(undefined);
  }, []);

  useEffect(() => {
    handleGenerate();
    setMaxSupply(isNFT ? '200' : '18000000');
    setTokenPrice(isNFT ? '0.1' : '0.00002');
    isNFT && setBaseURI(ipfs);
  }, [standart]);

  return (
    <div className="w-96 text-slate-950 dark:text-slate-50">
      <div className="flex w-full flex-col gap-2">
        {steps && (
          <div>
            <Steps status={status} />
          </div>
        )}
        <div className="flex h-6 items-center justify-between font-extrabold">
          {tokenAddress ? (
            <div className="w-full flex-none text-center">
              Your {symbol} Token Address:
            </div>
          ) : (
            <>
              <div className="mr-1 flex-1">
                <input
                  type="text"
                  className="w-full rounded-md bg-transparent px-1 focus:shadow-sm focus:outline-0 focus:ring-0"
                  value={name ?? ''}
                  onChange={e => setName(e.currentTarget.value)}
                />
              </div>
              <div className="flex-none">
                <div
                  title="AI 😂 Generator"
                  className="w-6 rounded-md bg-slate-300 p-1 text-slate-50 hover:scale-110 hover:cursor-pointer hover:bg-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-900"
                  onClick={handleGenerate}
                >
                  <IconArrowsRandom />
                </div>
              </div>
              <div className="flex-none">
                <input
                  type="text"
                  className="w-16 rounded-md bg-transparent px-1 text-right focus:shadow-sm focus:outline-0 focus:ring-0"
                  value={symbol ?? ''}
                  onChange={e => setSymbol(e.currentTarget.value)}
                />
              </div>
            </>
          )}
        </div>
        <div className="flex w-full flex-col gap-2">
          {tokenAddress ? (
            <div className="flex content-center items-center justify-center">
              <div className="my-2 flex items-center rounded-md bg-teal-50 px-2 py-2 text-xs font-extrabold text-teal-900 dark:bg-teal-900 dark:text-teal-100">
                {tokenAddress}
                <IconCopy
                  className="ml-2 h-4 w-4 hover:scale-110 hover:cursor-pointer"
                  onClick={() => {
                    navigator.clipboard
                      .writeText(tokenAddress)
                      .catch(err =>
                        console.error('Failed to copy text: ', err)
                      );
                  }}
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-none gap-2">
              {isNFT && metadata && (
                <div className="flex-none">
                  <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-xl">
                    <img
                      src={metadata.image ?? ''}
                      className="h-24 w-24 rounded-xl object-cover"
                      alt={`NFT Collection`}
                    ></img>
                  </div>
                </div>
              )}
              {isNFT && !metadata && (
                <div className="flex-none">
                  <div className="flex h-24 w-24 animate-pulse items-center justify-center rounded-xl bg-slate-300"></div>
                </div>
              )}
              <div className="flex flex-1 items-center">
                <ul role="list" className="w-full list-none space-y-3">
                  <li>
                    <div className="flex items-center justify-between text-xs">
                      <div className="mr-1 flex flex-none items-center justify-between text-slate-400 dark:text-slate-500">
                        <span className="mr-1 h-6 w-6">
                          <IconCoins />
                        </span>
                        <span className="text-xs">Max&nbsp;Supply</span>
                      </div>
                      <div className="flex flex-1 items-center justify-end">
                        <input
                          type="text"
                          className="w-full rounded-md bg-transparent p-1 text-right focus:shadow-sm focus:outline-0 focus:ring-0"
                          value={maxSupply ?? ''}
                          onChange={e => setMaxSupply(e.currentTarget.value)}
                        />
                        <div className="mx-1 font-extrabold">{symbol}</div>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="flex w-full items-center justify-between text-xs">
                      <div className="mr-1 flex flex-none items-center justify-between text-slate-400 dark:text-slate-500">
                        <span className="mr-1 h-6 w-6">
                          <IconPointOfSale />
                        </span>
                        <span className="text-xs">
                          <span className="font-extrabold">1</span>&nbsp;
                          <span className="font-extrabold text-slate-950 dark:text-slate-50">
                            {symbol}
                          </span>
                          &nbsp;=
                        </span>
                      </div>
                      <div className="flex flex-1 items-center justify-end">
                        <input
                          type="text"
                          className="w-full rounded-md bg-transparent p-1 text-right focus:shadow-sm focus:outline-0 focus:ring-0"
                          value={tokenPrice ?? ''}
                          onChange={e => setTokenPrice(e.currentTarget.value)}
                        />
                        <div className="mx-1 text-slate-400 dark:text-slate-500">
                          {balance?.symbol}
                        </div>
                      </div>
                    </div>
                  </li>
                  {isNFT && (
                    <li>
                      <div className="flex items-center justify-between text-xs">
                        <div className="mr-1 flex flex-none items-center justify-between text-slate-400 dark:text-slate-500">
                          <span className="mr-1 h-6 w-6">
                            <IconIpfs />
                          </span>
                          <span className="text-xs">Base&nbsp;URI</span>
                        </div>
                        <div className="flex flex-1 items-center justify-center">
                          <input
                            type="text"
                            className="w-full rounded bg-transparent p-1 focus:shadow-sm focus:outline-0 focus:ring-0"
                            value={baseURI ?? ''}
                            onChange={e => setBaseURI(e.currentTarget.value)}
                          />
                        </div>
                      </div>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          )}
        </div>
        <div className="w-full">
          <ActionButton
            defaultText="Create"
            successText="Done"
            defaultIcon={<IconCreateDashboard />}
            successIcon={<IconCheckSquare />}
            status={status}
            onClick={handleCreate}
          />
        </div>
      </div>
    </div>
  );
};

export default Create;
