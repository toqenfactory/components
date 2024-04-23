import { useCallback, useEffect, useMemo, useState } from 'react';
import { parseUnits } from 'viem';
import {
  useWaitForTransactionReceipt,
  useWatchContractEvent,
  useWriteContract,
} from 'wagmi';

import IconChevronLeft from '../Icons/IconChevronLeft';
import IconChevronRight from '../Icons/IconChevronRight';
import IconCopy from '../Icons/IconCopy';
import IconGrid from '../Icons/IconGrid';
import Steps from './Steps';
import { abi, generate } from './utils';

const mtd =
  'ipfs://bafybeieyb62vnkv46zr5mw3nfqlhcxt7v2frd2tu6k3cwgkqfgwmnyflme/';

const Create = ({
  standart,
  toqen: address,
  handle,
}: {
  standart: 'ERC20' | 'ERC721';
  toqen: `0x${string}` | undefined;
  handle: ({
    data,
    status,
  }: {
    data: `0x${string}` | undefined;
    status: 'idle' | 'wallet' | 'pending' | 'success' | 'error';
  }) => void;
}) => {
  const { writeContract, status: offChain, data: hash } = useWriteContract(); // offChain: idle -> pending -> success
  const { data, status: onChain } = useWaitForTransactionReceipt({ hash }); // onChain: pending -> success

  const eventName = 'TokenCreated';
  const functionName = useMemo(() => `create${standart}`, [standart]);

  const [step, setStep] = useState(1);
  const [status, setStatus] = useState('');

  const [args, setArgs] = useState<any>();
  const [tokenAddress, setTokenAddress] = useState<`0x${string}` | undefined>();

  const [name, setName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [maxSupply, setMaxSupply] = useState('18000000');
  const [tokenPrice, setTokenPrice] = useState('0.000001');

  const [baseURI, setBaseURI] = useState(mtd);

  useEffect(() => {
    const price = tokenPrice ? parseUnits(tokenPrice, 18) : 0n;
    setArgs(
      standart === 'ERC20'
        ? [name, symbol, parseUnits(maxSupply, 18), price]
        : [name, symbol, parseUnits(maxSupply, 0), price, baseURI]
    );
  }, [name, symbol, maxSupply, tokenPrice, baseURI]);

  useEffect(() => {
    if (offChain === 'error' || onChain === 'error') {
      handle({ data: undefined, status: 'error' });
      setStatus('error');
    }
    if (onChain === 'pending') {
      if (offChain === 'idle') {
        handle({ data: undefined, status: 'idle' });
        setStatus('idle');
      } else if (offChain === 'pending') {
        handle({ data: undefined, status: 'wallet' });
        setStatus('wallet');
      } else if (offChain === 'success') {
        handle({ data: undefined, status: 'pending' });
        setStatus('pending');
      }
    }
    if (onChain === 'success') {
      handle({ data: tokenAddress, status: 'success' });
      setStatus('success');
    }

    const tokenAddressByReceipt = data?.logs?.[0]?.topics?.[1];
    if (tokenAddressByReceipt) {
      if (!tokenAddress)
        setTokenAddress(`0x${tokenAddressByReceipt.slice(26)}`);
    }
  }, [offChain, onChain, data]);

  useWatchContractEvent({
    address,
    abi,
    eventName,
    onLogs(logs) {
      logs.forEach((log: any) => {
        if (log.transactionHash === hash && log?.args?.tokenAddress) {
          setTokenAddress(log.args.tokenAddress);
        }
      });
    },
  });

  const handleCreate = useCallback(() => {
    if (!address) return;
    console.log(address, functionName, args);
    writeContract({ abi, address, functionName, args });
  }, [abi, address, functionName, args]);

  const handleGenerate = useCallback(() => {
    const random = generate();
    setName(random.name);
    setSymbol(random.symbol);
    setTokenAddress(undefined);
    setStatus('');
    setStep(1);
  }, []);

  useEffect(() => handleGenerate(), [standart]);

  return (
    <div className="flex min-w-96 flex-col gap-2">
      <Steps step={step} />
      {step === 1 && (
        <>
          <div className="w-full">
            <label
              htmlFor="search"
              className="sr-only mb-2 text-sm font-medium text-slate-900 dark:text-slate-50"
            >
              Token Name
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3">
                Token Name:
              </div>
              <input
                type="search"
                id="search"
                className="block w-full rounded-lg border-0 p-4 ps-32 text-lg font-extrabold text-slate-900 shadow-sm  placeholder:text-slate-100 focus:outline-0 focus:ring-0 dark:border-slate-100 dark:bg-slate-700 dark:text-slate-50 dark:placeholder-slate-400"
                placeholder="Token Name"
                value={name}
                onChange={e => {
                  setName(e.currentTarget.value);
                }}
                required
              />
              <button
                type="submit"
                className="shadow-xs absolute bottom-3 end-3 rounded-lg bg-slate-100 px-4 py-2 text-sm text-slate-950 outline-0 ring-0 hover:bg-slate-50 focus:outline-none focus:ring-0 dark:bg-slate-800 dark:text-slate-50 dark:hover:bg-slate-900"
                onClick={handleGenerate}
              >
                AI 😂 Generate
              </button>
            </div>
          </div>
          <div className="w-full">
            <input
              type="text"
              className="block w-full border-0 bg-transparent p-0 text-center text-6xl font-extrabold text-slate-700 outline-0 ring-0 placeholder:text-slate-100 dark:text-slate-50 dark:placeholder:text-slate-700"
              placeholder="Token Symbol"
              value={symbol}
              onChange={e => {
                setSymbol(e.currentTarget.value.toUpperCase());
              }}
              required
            />
          </div>
        </>
      )}
      {step === 2 && (
        <>
          <div className="w-full">
            <label
              htmlFor="max-supply"
              className="sr-only mb-2 text-sm font-medium text-slate-900 dark:text-slate-50"
            >
              Max Supply
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3">
                Max Supply:
              </div>
              <input
                type="text"
                id="max-supply"
                className="block w-full rounded-lg border-0 p-4 ps-32 text-lg font-extrabold text-slate-900 shadow-sm  placeholder:text-slate-100 focus:outline-0 focus:ring-0 dark:border-slate-100 dark:bg-slate-700 dark:text-slate-50 dark:placeholder-slate-400"
                placeholder="18000000"
                value={maxSupply}
                onChange={e => {
                  setMaxSupply(e.currentTarget.value);
                }}
                required
              />
              <div className="absolute bottom-3 end-3 rounded-lg bg-slate-100 px-4 py-2 text-sm text-slate-950 dark:bg-slate-800 dark:text-slate-50">
                {symbol}
              </div>
            </div>
          </div>
          <div className="w-full">
            <label
              htmlFor="max-supply"
              className="sr-only mb-2 text-sm font-medium text-slate-900 dark:text-slate-50"
            >
              Token Price
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3">
                1{' '}
                <div className="mx-2 rounded-lg bg-slate-100 px-4 py-2 text-sm text-slate-950 dark:bg-slate-800 dark:text-slate-50">
                  {symbol}
                </div>{' '}
                =
              </div>
              <input
                type="text"
                id="max-supply"
                className="block w-full rounded-lg border-0 p-4 ps-32 text-lg font-extrabold text-slate-900 shadow-sm  placeholder:text-slate-100 focus:outline-0 focus:ring-0 dark:border-slate-100 dark:bg-slate-700 dark:text-slate-50 dark:placeholder-slate-400"
                placeholder="18000000"
                value={tokenPrice}
                onChange={e => {
                  setTokenPrice(e.currentTarget.value);
                }}
                required
              />
              <div className="absolute bottom-3 end-3 rounded-lg bg-slate-100 px-4 py-2 text-sm text-slate-950 outline-0 ring-0 dark:bg-slate-800 dark:text-slate-50">
                ETH
              </div>
            </div>
          </div>
          {standart === 'ERC721' && (
            <div className="w-full">
              <label
                htmlFor="max-supply"
                className="sr-only mb-2 text-sm font-medium text-slate-900 dark:text-slate-50"
              >
                Base URI
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3">
                  Base URI:
                </div>
                <input
                  type="text"
                  id="max-supply"
                  className="block w-full rounded-lg border-0 p-4 ps-32 text-lg font-extrabold text-slate-900 shadow-sm placeholder:text-slate-100 focus:outline-0 focus:ring-0 dark:border-slate-100 dark:bg-slate-700 dark:text-slate-50 dark:placeholder-slate-400"
                  placeholder="ipfs://CID/json/"
                  value={baseURI}
                  onChange={e => {
                    setBaseURI(e.currentTarget.value);
                  }}
                  required
                />
                <a
                  href="https://bafybeieyb62vnkv46zr5mw3nfqlhcxt7v2frd2tu6k3cwgkqfgwmnyflme.ipfs.dweb.link/"
                  target="_blank"
                >
                  <div className="absolute bottom-3 end-3 rounded-lg bg-slate-100 px-4 py-2 text-sm text-slate-950 outline-0 ring-0 dark:bg-slate-800 dark:text-slate-50">
                    ?
                  </div>
                </a>
              </div>
            </div>
          )}
        </>
      )}
      {step === 3 &&
        (tokenAddress ? (
          <div className="flex content-center items-center justify-center">
            <div className="text-md my-4 flex items-center rounded-md bg-slate-600 px-8 py-4 font-extrabold text-slate-50 dark:bg-slate-950">
              <div className="mx-1 rounded-md bg-slate-500 px-2 py-1 font-extrabold text-slate-100">
                ${symbol}
              </div>{' '}
              : {tokenAddress}{' '}
              <IconCopy
                className="ml-4 h-6 w-6 hover:scale-105 hover:cursor-pointer"
                onClick={() => {
                  navigator.clipboard
                    .writeText(tokenAddress)
                    .catch(err => console.error('Failed to copy text: ', err));
                }}
              />
            </div>
          </div>
        ) : (
          <ul
            role="list"
            className="list-disc space-y-3 pl-5 text-slate-400 marker:text-slate-800 dark:marker:text-slate-100"
          >
            <li>
              $
              <span className="mx-1 rounded-md bg-slate-100 px-2 py-1 text-slate-950 dark:bg-slate-800 dark:text-slate-50">
                {symbol}
              </span>
              :{' '}
              <span className="font-extrabold text-slate-950 dark:text-slate-50">
                {name}
              </span>
            </li>
            <li>
              Max Sypply:{' '}
              <span className="font-extrabold text-slate-950 dark:text-slate-50">
                {maxSupply.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              </span>{' '}
              <span className="mx-1 rounded-md bg-slate-100 px-2 py-1 text-slate-950 dark:bg-slate-800 dark:text-slate-50">
                {symbol}
              </span>
            </li>
            <li>
              <span>Mint Price:</span> 1{' '}
              <span className="mx-1 rounded-md bg-slate-100 px-2 py-1 text-slate-950 dark:bg-slate-800 dark:text-slate-50">
                {symbol}
              </span>{' '}
              ={' '}
              <span className="font-extrabold text-slate-950 dark:text-slate-50">
                {tokenPrice}
              </span>{' '}
              ETH
            </li>
            {standart === 'ERC721' && (
              <li>
                Base URI:{' '}
                <span className="font-extrabold text-slate-950 dark:text-slate-50">
                  <a
                    href={baseURI}
                    target="_blank"
                    className=" underline decoration-dotted underline-offset-8"
                  >
                    {`${baseURI.substring(0, 12)}..${baseURI.substring(
                      baseURI.length - 12
                    )}`}
                  </a>
                </span>
              </li>
            )}
          </ul>
        ))}
      <div className="mt-4 flex w-full gap-2">
        {step > 1 && (
          <div className="flex-1">
            <button
              onClick={() => setStep(step => step - 1)}
              type="button"
              className="group relative w-full overflow-hidden rounded-lg bg-gradient-to-l from-slate-100 to-slate-300 px-5 py-2.5 text-center text-xl font-medium lowercase text-slate-400 hover:bg-gradient-to-l hover:from-slate-300 hover:to-slate-300 hover:text-slate-600 focus:outline-none focus:ring-0 dark:bg-gradient-to-l dark:from-slate-500 dark:to-slate-700 dark:text-slate-400 dark:hover:bg-gradient-to-l dark:hover:from-slate-700 dark:hover:to-slate-700 dark:hover:text-slate-200"
            >
              prev
              <span className="absolute inset-y-0 -top-2 left-0 h-16 w-16 fill-slate-700 opacity-10 group-hover:-translate-x-1">
                <IconChevronLeft />
              </span>
            </button>
          </div>
        )}
        {step < 3 && (
          <div className="flex-1">
            <button
              onClick={() => setStep(step => step + 1)}
              type="button"
              className="group relative w-full overflow-hidden rounded-lg bg-gradient-to-r from-slate-100 to-slate-300 px-5 py-2.5 text-center text-xl font-medium lowercase text-slate-400 hover:bg-gradient-to-r hover:from-slate-300 hover:to-slate-300 hover:text-slate-600 focus:outline-none focus:ring-0 dark:bg-gradient-to-r dark:from-slate-500 dark:to-slate-700 dark:text-slate-400 dark:hover:bg-gradient-to-r dark:hover:from-slate-700 dark:hover:to-slate-700 dark:hover:text-slate-200"
            >
              next
              <span className="absolute inset-y-0 -top-2 right-0 h-16 w-16 fill-slate-700 opacity-10 group-hover:translate-x-1">
                <IconChevronRight />
              </span>
            </button>
          </div>
        )}
        {step === 3 && status !== 'success' && (
          <div className="flex-1">
            <button
              onClick={handleCreate}
              type="button"
              disabled={status === 'pending'}
              className="group relative w-full overflow-hidden rounded-lg bg-gradient-to-r from-slate-100 to-slate-300 px-5 py-2.5 text-center text-xl font-medium lowercase text-slate-400 hover:bg-gradient-to-r hover:from-slate-300 hover:to-slate-300 hover:text-slate-600 focus:outline-none focus:ring-0 dark:bg-gradient-to-r dark:from-slate-500 dark:to-slate-700 dark:text-slate-400 dark:hover:bg-gradient-to-r dark:hover:from-slate-700 dark:hover:to-slate-700 dark:hover:text-slate-200"
            >
              {status === 'wallet'
                ? `open wallet ...`
                : status === 'pending'
                  ? `please wait ...`
                  : `create`}
              <span
                className={`absolute inset-y-0 -top-0 right-2 h-12 w-12 fill-slate-700 opacity-10 ${
                  status === 'wallet' || status === 'pending'
                    ? `animate-ping`
                    : `group-hover:scale-110`
                }`}
              >
                <IconGrid />
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Create;
